---
title: How it works
description: "The design behind Employee Timeclock: badges and kiosk sessions, the shift pairing rule, the two-way Workday sync, and the job time tracker's timers."
nav_title: How it works
order: 10
updated: 2026-10-26
---

This page describes the design behind the code, for developers. For commands and the build, see [Develop Employee Timeclock](README.md).

## The pieces

| Piece                       | Built with                                               | Entry point                                                                    |
| --------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Employee Clock-in/out form  | A Frappe web form with a client script and a time picker | `timeclock/web_form/employee_timelog/`, `public/js/employee_timelog.bundle.js` |
| Badge kiosk                 | Vue 3, `onscan.js`, served by a `www` page               | `www/timeclock/`, `public/js/timeclock/timeclock.ts`                           |
| Job time tracker            | Vue 3, frappe-ui and Tailwind 3, socket.io for realtime  | `www/job_timeclock/`, `public/js/job_timeclock/job_timeclock.ts`               |
| Workday sync and shift rule | Python, the Frappe Query Builder                         | `timeclock/shifts.py`, `timeclock/api.py`                                      |
| Workday Management report   | A script report with an editable tree grid               | `timeclock/report/workday_management/`                                         |
| Job Card extension          | `extend_doctype_class`                                   | `timeclock/custom/job_card.py`                                                 |

Paths are relative to the `employee_timeclock` package.

## Badges and kiosk sessions

`kiosk.py` holds the access rules. A kiosk is a browser signed in as a user with the **Timeclock Kiosk** role (a fixture), and `require_kiosk_role` (`frappe.only_for`) guards every badge endpoint and kiosk page. `require_login_page` sends Guest to `/login` and back.

A badge is resolved by `resolve_badge`: the SHA-256 of the scan is looked up in the Employee's `timeclock_badge_hash`, then the scan is looked up as an Attendance Device ID row, and either must belong to an Active Employee. A plain digest is enough because the token is 144 random bits (`secrets.token_urlsafe(18)`), and an unsalted digest can be found through an index, so verification compares digests in the database. Every failure returns `None` and is logged without the scanned value, so the caller cannot tell an unknown badge from a revoked one or an inactive employee.

The badge endpoints are rate limited per client IP (`KIOSK_SCAN_LIMIT` 30 in `KIOSK_SCAN_WINDOW` 60 seconds), with Frappe's `rate_limit`.

`KioskAuthenticationError` subclasses `frappe.AuthenticationError` on purpose: Frappe deletes the `sid` cookie when a request ends in exactly `AuthenticationError`, and a misread badge must not sign the kiosk user out.

The badge kiosk and the job time tracker exchange a badge for a 30-minute HS256 JWT (`authenticate_employee`) and send it with each call. `auth.get_token_secret` signs it with the site's `encryption_key`, read per request, and Frappe's `get_encryption_key` creates the key if the site has none. A set but empty key fails closed. The job time tracker's read calls return a refreshed token, so an active session keeps going. Its `_resolve_employee` tries the session user's Employee first and accepts a badge JWT only from a Timeclock Kiosk session, so a leaked token is useless elsewhere.

The clock-in form works differently: it posts the scanned badge itself to `timeclock.api.submit_checkin`, which resolves it on every punch. The web form has an `employee` field, so Frappe's generic `web_form.accept` would insert a punch for any Employee ID it is sent; `kiosk.refuse_web_form_checkin`, a `before_insert` hook on Employee Checkin, refuses any insert made with `frappe.flags.in_web_form`.

## The shift pairing rule

`timeclock/shifts.py` is the one place that pairs punches, and every kiosk, the Workday sync, the Workday Management report and the hours reports use it.

- `pair_punches` takes one employee's punches in time order (then creation order). An OUT closes the open IN when it is no more than the maximum shift length after it; a second IN leaves the first unmatched; an OUT with no open IN is unmatched. A punch with no log type is read as the OUT of an open IN within the window, else an IN, and the inferred type is kept on the punch.
- A `Shift` belongs to its IN's date, or a lone OUT's own date.
- `get_shifts(from_date, to_date)` reads punches a maximum shift length either side of the range, so a night shift at either end is paired whole, then keeps the shifts whose date is in range.
- `next_log_type` is the kiosks' direction: OUT while `open_check_in` finds an IN open within the last maximum shift length, IN otherwise. `last_log_type` is the same answer as the badge kiosk wants it.

The maximum shift length is Timeclock Settings' `max_shift_hours`, 16 when it is unset. `TimeclockSettings.validate` keeps it above 0 and at most 48, because past two days a forgotten OUT would pair with a later shift's.

## Workdays and Employee Checkins

Workdays and Employee Checkins are kept in step both ways by `doc_events` in `hooks.py`.

**From punches to Workdays.** `sync_workday(employee, date)` rebuilds one Workday from the shifts that belong to its date with `fill_workday`, which writes the twelve `check_in_N` and `check_out_N` text fields (`h:mm AM/PM`), their hidden `_dt` datetimes and `total_hours`. It writes with `db_insert` and `db_update`, so the Workday's own hooks do not run, links each punch to the Workday and stores an inferred log type. `resync_around(employee, times)` rebuilds every date a maximum shift length either side of each time, because a punch can re-pair its neighbours: an IN added before a lone next-morning OUT takes that OUT off the next day's Workday, and deleting the IN puts it back.

- `update_workday_from_checkin` (`on_update`) resyncs around a new or changed punch, and around the date of the Workday it was on.
- `clear_workday_punch_on_checkin_trash` (`on_trash`) resyncs around a deleted punch, leaving it out.

**From Workdays to punches.** `workday_update_total_hours` (`before_save`) parses each slot's text on the Workday's date, moves an OUT earlier than its IN to the next day, refuses a slot longer than the maximum shift length, and refills the slots and total through `fill_workday`. `update_checkins_from_workday` (`on_update`) then matches the Workday's INs, in time order, to the IN punches of the shifts that belong to its date, and its OUTs likewise. A moved punch gets `workday_override` and keeps its first time in `overridden_time`; an extra time becomes a new Employee Checkin with device ID `Workday Management`; a punch the Workday no longer holds is deleted.

**The loop guard.** A punch the Workday save just wrote carries `workday_modified`, and a Workday carries `last_modified`. `update_workday_from_checkin` skips a punch written by a Workday save in the last minute, and a Workday saved in the last minute; `clear_workday_punch_on_checkin_trash` skips while `frappe.flags.timeclock_writing_workday` is set. This is why a punch recorded less than a minute after its Workday was saved is not copied in.

Every punch is an Employee Checkin whose device ID says where it came from: `Employee Clock-in/out Device` (the web form), `Timeclock Scanner` (the badge kiosk) or `Workday Management` (a Workday edit or the report). The badge kiosk's punches go through `custom/employee_checkin.insert_punch`, which inserts in a savepoint and rolls back and logs on failure, so the page can answer "unsuccessful" without a half-written Workday.

## The Workday Management report

`report/workday_management/workday_management.py` builds a tree from the Workdays in range and `get_shifts` over the same range, keyed by employee and date, so punches that never got a Workday still show. `_get_issues` computes each day's statuses in priority order. The JavaScript makes the grid editable: a time cell posts to `update_checkin`, an OUT's hours to `set_punch_hours`, a new punch to `add_checkin`, and the **Manage** menu calls `delete_checkins` and `rebuild_workdays`. Each method checks write permission on Workday, then resyncs through `shifts.resync_around` or `sync_workday`. The grid saves the open tree nodes before a refresh and restores them after.

## The job time tracker

`www/job_timeclock/job_timeclock.py` serves the tracker's API, with Pydantic response models in `models.py` mirrored to TypeScript by `generate-types`. Timers are Job Card Time Logs:

- `start_timer` resolves the work order and operation to the Job Card, closes the employee's open labour logs (or, for a machine operation, every open log on that operation), appends a time log and saves with `frappe.flags.in_timeclock` set. With `is_corrective` it appends to the draft corrective Job Card for that card, creating one if needed.
- `stop_timer` closes every open labour log of the employee; `stop_machine_timer` closes the open logs of a machine operation.
- Machine operations are those with `is_machine_time`; `get_operations` shows them only to members of the operation's `employee_group`, and machine timer starts and stops are broadcast with `frappe.publish_realtime("machine_timer_update", room="website")`, which every open tracker listens to.

`TimeclockJobCard` (`custom/job_card.py`) adjusts ERPNext's Job Card for this:

- `before_validate` moves a machine-time log's employee to `machine_operator`.
- `get_overlap_for` skips the overlap check while `frappe.flags.in_timeclock` is set, because the tracker closes open timers itself, and when the log has no employee, which ERPNext would otherwise report as an overlap.
- `validate_sequence_id` enforces the operation sequence only once the card reports a completed quantity, so operations worked in parallel can be timed.
- `complete_job_card` never sends an end time before the open log's start (the field drops seconds), and records the completed quantity on the last log when no log is open.
- `validate_on_hold` lets a paused card whose logs are all closed be submitted.

## The rename shim

The app was called `timeclock`. `hooks.py`'s `override_whitelisted_methods`, between the `frappe-nix:rename-shim-begin` and `frappe-nix:rename-shim-end` markers, maps each old dotted path to the new one.
