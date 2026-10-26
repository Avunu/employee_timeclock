---
title: Configuration
description: Set up a kiosk, the one setting in Timeclock Settings, the roles the app checks, and a reference of everything the app adds to a site.
nav_title: Configuration
order: 2
updated: 2026-10-26
---

Employee Timeclock has one settings page, Timeclock Settings, with one field. The rest is configured through users, roles and fields on documents you already use. This page sets up a kiosk, lists every setting, then lists everything the app adds to your site.

## Set up a kiosk

1. **Create the kiosk user.** In **User**, add a user for the kiosk device, as a Website User, with only the **Timeclock Kiosk** role and a strong password. One user per device lets you disable one device without the others. The app installs the role, without desk access.
2. **Issue badges.** Give every employee who will clock in a badge: see [Issue and revoke badges](badges.md). Employees with an RFID tag in **Attendance Device IDs** need no new badge.
3. **Set the device's clock.** The badge kiosk and the job time tracker stamp each punch and timer with the device's own clock and time zone, and the Employee Clock-in/out form converts the device's clock into the kiosk user's time zone (the User's **Time Zone**, else the site's). Set the device's time zone to the site's and keep its clock synchronised.
4. **Sign the kiosk in.** On the device, open the kiosk page (`/timeclock`, `/employee-timeclock` or `/job_timeclock`), sign in as the kiosk user and leave the browser on that page. The scanner must type the badge into the page like a keyboard and end with Enter, as most USB scanners do by default.

[Clock in and out](clock-in.md) compares the kiosk pages.

## Timeclock Settings

Open **Timeclock Settings** in the desk. HR Manager and System Manager can change it; HR User can read it.

| Setting                          | Default | What it does                                                                                                                                                                                                                                                                                                                                                                  |
| -------------------------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Maximum Shift Length (Hours)** | 16      | An OUT closes the employee's open IN only when it comes within this many hours of it, and the kiosks treat an IN older than this as a forgotten clock-out. A Workday row longer than this is refused, and so is setting a punch's hours past it. It must be more than 0 and at most 48. Raise it if anyone works longer shifts; lower it to flag forgotten clock-outs sooner. |

[How punches pair into shifts](workdays.md#how-punches-pair-into-shifts) explains the rule this setting feeds.

## Site configuration

| Key                                        | What it does                                                                                                                                                                                                                                                                                                              |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `employee_timeclock_rebuild_workdays_from` | A date, `YYYY-MM-DD`. The upgrade patch that rebuilds Workdays for night shifts rebuilds only Workdays on or after it. Unset, the patch uses the site's date minus 14 days. See [Rebuilding Workdays for night shifts](install.md#rebuilding-workdays-for-night-shifts).                                                  |
| `encryption_key`                           | Frappe's own key. The badge kiosk and the job time tracker sign the 30-minute badge sessions with it. A site that has none gets one, generated and saved to `site_config.json` the first time a badge is scanned, as Frappe does the first time it encrypts a password. If it is set but empty, badge sign-in is refused. |

## Roles and permissions

| Who                                | What they can do                                                                                                                                                                                                       |
| ---------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Timeclock Kiosk**                | Open `/timeclock` and `/employee-timeclock`, and sign employees into `/job_timeclock` with a badge. Every badge endpoint refuses any other user, Guest included.                                                       |
| An employee's own user             | Use `/job_timeclock` without a badge, as the Employee whose **User ID** is that user. No role is needed beyond a login.                                                                                                |
| **HR Manager**, **System Manager** | Issue and revoke badges. Read, create, change and delete Workdays, use the Workday Management report and change Timeclock Settings. The Workday Management desk page is for HR Manager and Administrator.              |
| **HR User**                        | Run the Payroll Report, the Work Day Hours Report and the Punch List, which read Employee Checkins. HR User has no access to Workdays, so the Workday Payroll Report and the Workday Management report are not theirs. |
| Anyone who can read Workday        | Sees the **Employee Timeclock** tile on the desk's apps screen. It opens the Workday list.                                                                                                                             |

The editing methods of the Workday Management report (moving, adding and deleting punches, rebuilding Workdays) check write permission on Workday, whatever the report's roles.

## Job time tracking

| Setting                    | Where         | What it does                                                                                                                                                                                   |
| -------------------------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **User ID**                | Employee      | Lets the employee use `/job_timeclock` from their own login, without a badge.                                                                                                                  |
| **Is Machine Time**        | Operation     | Times the operation against a machine instead of a person: see [Machine time](job-tracker.md#machine-time). The Job Card copies it from the Operation.                                         |
| **Machine Employee Group** | Operation     | Shown and required when **Is Machine Time** is ticked. Only members of this Employee Group see the operation in the tracker and its running timer in the machine timer bar.                    |
| **Workstations**           | Tracker, gear | The workstations at this kiosk. Their operations are listed first, and **My Station** shows only them. The choice is kept in that browser's local storage, as are each employee's pinned jobs. |

## What the app adds to your site

This is the complete list, so you can see what a migration changes.

### Doctypes

| Doctype              | What it is                                                                                                                                                                                             |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Workday              | One employee's shifts for one date: up to twelve in and out pairs (**IN1** and **OUT1** to **IN12** and **OUT12**) and **Total Hours**. Named `{employee_name}-{date}-{#####}`, with Track Changes on. |
| Timeclock Settings   | A single doctype with **Maximum Shift Length (Hours)**.                                                                                                                                                |
| Attendance Device ID | A child table of RFID tags (**Biometric/RF tag ID**), shown on the Employee as **Attendance Device IDs**.                                                                                              |

### Custom fields and property setters

| Doctype           | Change                                                                                                                                                                                                                                                                                                                        |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Employee          | **Attendance Device IDs** (table), **Timeclock Badge Issued On** (read-only) and a hidden, read-only **Timeclock Badge Hash**, the SHA-256 of the badge token. They follow ERPNext's own **Attendance Device ID (Biometric/RF tag ID)** field, which the kiosks do not read.                                                  |
| Employee Checkin  | **Manual Override**, **Manual Override Date** and **Manual Override Time** (a punch entered by hand at the clock-in form), **Workday Override** and **Overridden Time** (a punch moved from a Workday or the report keeps its original time here), **Workday** (link) and **Workday Modified**.                               |
| Job Card          | **Is Machine Time**, fetched from the Operation. The **Is Corrective Job Card** field is relabelled **Rework** and shown in the list view, the filters and the preview; Production Item, Expected Start Date and Time Required are added to the preview; For Quantity is removed from the list view; the preview popup is on. |
| Job Card Time Log | **Machine Operator**, a link to the Employee who ran a machine-time log.                                                                                                                                                                                                                                                      |
| Operation         | **Is Machine Time** and **Machine Employee Group**. The Employee Group form lists the Operations that use it under **Manufacturing** in its connections.                                                                                                                                                                      |

### Behaviour

| Where            | Change                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Employee Checkin | `doc_events`: a new, changed or deleted punch rebuilds every Workday it can belong to or re-pair. A punch made through Frappe's generic web form submission is refused, so the clock-in form cannot punch for an Employee ID typed into it.                                                                                                                                                                                                                                                                                                                       |
| Workday          | `doc_events`: saving a Workday reads its times, recalculates **Total Hours** and writes the punches back to Employee Checkins. See [Edit a Workday](workdays.md#edit-a-workday).                                                                                                                                                                                                                                                                                                                                                                                  |
| Job Card         | `extend_doctype_class` (`TimeclockJobCard`): on a machine-time card, a time log's Employee moves to **Machine Operator**. The tracker's own saves skip ERPNext's overlap check (it closes the employee's open timers itself), and so do time logs with no Employee. The operation sequence is enforced only once the card reports a completed quantity. **Complete Job** never records an end time before the open log's start, and records the completed quantity on the last log when no log is open. A paused card whose logs are all closed can be submitted. |
| Employee form    | `doctype_js`: the **Timeclock** menu with **Issue Badge** and **Revoke Badge**, for HR Manager and System Manager.                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Job Card form    | `doctype_js`: the time logs table shows **Machine Operator** instead of Employee on a machine-time card. `doctype_list_js`: the Job Card list hides the name column. It replaces ERPNext's own list settings for Job Card, so each card's indicator reads Draft or Submitted instead of its Job Card status (Open, Work In Progress and so on); the **Status** column still shows it.                                                                                                                                                                             |
| Desk             | `app_include_js`: the **Bulk Add** dialog for Workdays, on every desk page. An **Employee Timeclock** tile on the apps screen, opening `/app/workday`.                                                                                                                                                                                                                                                                                                                                                                                                            |
| Website          | The pages `/timeclock`, `/job_timeclock` and the old `/job_timeclock_legacy`, and the web form `/employee-timeclock`. None of them accepts Guest.                                                                                                                                                                                                                                                                                                                                                                                                                 |
| Desk pages       | The Workday Management page (`/app/workday-management`) and the Workday Management, Workday Payroll, Payroll, Work Day Hours and Punch List reports.                                                                                                                                                                                                                                                                                                                                                                                                              |

The app has no scheduled jobs.

### Whitelisted methods

| Method                                                                                          | Called by                                                                                                                                                 |
| ----------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `employee_timeclock.kiosk.issue_badge`, `revoke_badge`                                          | The Employee form's **Timeclock** menu. HR Manager and System Manager only.                                                                               |
| `employee_timeclock.timeclock.api.submit_checkin`                                               | The Employee Clock-in/out form. Timeclock Kiosk only, rate limited.                                                                                       |
| `employee_timeclock.www.timeclock.authenticate_employee`, `log_in_employee`, `log_out_employee` | The badge kiosk. Timeclock Kiosk only; badge scans are rate limited.                                                                                      |
| `employee_timeclock.www.job_timeclock.job_timeclock.*`                                          | The job time tracker: work orders, operations, timers, machine timers, workstations and the device's IP and MAC address.                                  |
| `employee_timeclock.timeclock.doctype.workday.workday.bulk_add_punches`                         | The **Bulk Add** dialog.                                                                                                                                  |
| `employee_timeclock.timeclock.report.workday_management.workday_management.*`                   | The Workday Management report: `update_checkin`, `set_punch_hours`, `add_checkin`, `delete_checkins` and `rebuild_workdays`. Each needs write on Workday. |
| `employee_timeclock.www.job_timeclock_legacy.*`                                                 | The old job time tracker. Timeclock Kiosk only.                                                                                                           |

The app was called `timeclock` before it was renamed. `hooks.py` maps the old dotted paths of these methods (`timeclock.kiosk.issue_badge` and the like) to the new ones, for cached pages and bookmarks that still use them.

## Related

- [Install and upgrade](install.md)
- [How it works](development/architecture.md) for the code behind each row above
