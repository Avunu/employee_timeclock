---
title: Limitations and troubleshooting
description: The known limits of Employee Timeclock, and the messages it shows, with their cause and the fix.
nav_title: Troubleshooting
order: 8
updated: 2026-10-26
---

## Limitations

- **Twelve shifts a day.** A Workday holds at most twelve in and out pairs. Shifts past the twelfth are left off the Workday and its **Total Hours**.
- **Shift length.** A shift cannot be longer than the maximum shift length in Timeclock Settings (at most 48 hours): an IN and an OUT further apart are two missed punches. When an employee forgets to clock out and clocks in again within that time, the first IN is the missed punch and the second pairs with the next OUT.
- **Workdays from before night-shift pairing.** `bench migrate` rebuilds them (see [Rebuilding Workdays for night shifts](install.md#rebuilding-workdays-for-night-shifts)), except those older than the last two weeks (or the date set in `employee_timeclock_rebuild_workdays_from`), those in a payroll period that has a Salary Slip, and those that share a night shift with a Workday it cannot rebuild. Those keep the punches of one calendar date: the Workday Management report shows such a day as **Out of Sync**, and **Rebuild Workdays** moves a night shift's OUT onto the day it started.
- **Adding a night shift's OUT.** In the Workday Management report, the OUT of a night shift is added with the toolbar's **Add Punch** on the next day's date; the **+ Add Punch** row under a day adds a punch on that day's date.
- **Saving a Workday rewrites its own date only.** If the edit re-pairs a punch on a neighbouring day (for example a new 10:00 PM IN that now closes with a lone 6:00 AM OUT the next morning), the neighbouring Workday is not rebuilt. The Workday Management report shows it as **Out of Sync**, and **Rebuild Workdays** fixes it.
- **Punches right after a Workday save.** A punch recorded less than a minute after its Workday was created or saved is not copied into the Workday; this guard stops the two sync hooks from triggering each other. The Workday Management report shows the day as **Out of Sync**, and **Rebuild Workdays** fixes it.
- **Bulk Add makes new Workdays.** It does not merge into an existing Workday, so a day that already has one gets a second, shown as **Duplicate Workday**.
- **Overtime.** Overtime in the payroll reports is hours over 40 in a week, and the 40 cannot be configured. A week runs Sunday to Saturday, whatever the site's first day of the week. The hours the Employee Clock-in/out form shows after a punch start on the first day of the week of the kiosk user's Language or of System Settings instead.
- **Workday Payroll Report and the database.** It is a SQL query report written for MariaDB (`DAYOFWEEK`, `DATE_SUB`).
- **The badge kiosk punches every scan.** Scanning twice at `/timeclock` clocks in and straight back out. Only the Employee Clock-in/out form ignores a second scan in the same minute.
- **Kiosk clocks.** The kiosks take the punch time from the device's clock, so a device with the wrong time or time zone records wrong punches.
- **Timers outlive the session.** Signing out of the job time tracker, or letting the 30-minute badge session run out, does not stop a running timer.
- **Pins and workstations stay in the browser.** The tracker keeps them in the browser's local storage, so they do not follow an employee to another kiosk, and clearing the browser's data loses them.
- **Language and theme.** The kiosk pages are in English only and have no dark theme. The job time tracker's page is titled "Project Tracker".
- **The old tracker.** The old job time tracker at `/job_timeclock_legacy` still ships. `/job_timeclock` replaces it, and it will be removed.

## Troubleshooting

### At a kiosk

#### "Badge not recognised."

The badge is unknown, has been revoked or replaced, or belongs to an employee whose **Status** is not Active. The message is the same on purpose. Check the Employee's status and, if they need one, [issue a badge](badges.md#issue-a-badge). For an RFID tag, check that it is in the Employee's **Attendance Device IDs** table, not ERPNext's single **Attendance Device ID (Biometric/RF tag ID)** field.

#### "The scan was not recorded. Please scan your badge again."

The badge kiosk's request failed and no punch was recorded. The usual causes are more than 30 scans in a minute from the kiosk's IP address, or the kiosk user being signed out. Wait a minute and scan again; if it keeps happening, reload the page and sign the kiosk in again. If no badge works at all, check the site's `encryption_key` (see below).

#### "You hit the rate limit because of too many requests. Please try after sometime."

Frappe's message at the Employee Clock-in/out form after more than 30 scans in a minute from one IP address. Kiosks behind one network address share the limit. Wait a minute.

#### "... was unsuccessfully logged in." or "... was not properly signed out."

The badge was recognised but the Employee Checkin could not be saved, at the badge kiosk. Open the Error Log in the desk: the entry is titled "Timeclock punch failed for" followed by the Employee ID, with the cause.

#### No badge works at the badge kiosk or the job time tracker

If the server's answer, in the browser's console, is "Badge sign-in is unavailable: the site has no encryption key.", the site's `encryption_key` in `site_config.json` is present but empty, so no badge session can be signed. Restore the site's key. Do not generate a new one on a site that already has encrypted passwords, because they could no longer be read.

#### The kiosk page shows Not Permitted

The browser is signed in as a user without the **Timeclock Kiosk** role. `/timeclock` and `/employee-timeclock` accept only that role. Sign in as the kiosk user. The job time tracker also accepts an employee's own login.

#### "Punches are recorded by scanning a badge."

Something submitted the Employee Clock-in/out form through Frappe's generic web form submission, which the app refuses, so a punch cannot be made for a typed Employee ID. Use the form's **Badge** field; it records the punch itself.

#### "Choose Clock In or Clock Out."

**Enter Time Manually** was ticked but no direction was sent. Choose **Clock in** or **Clock out**, then scan again.

#### "Time Traveler!"

The time entered with **Enter Time Manually** is in the future. Check **Override Date** and **Override Time**.

#### A scan does nothing at all

The scanner must type into the page like a keyboard and end with Enter, and the page must have the focus. At the Employee Clock-in/out form, click **Badge** or **Reload Form**.

### In the job time tracker

#### The tracker goes back to the scan screen

The 30-minute badge session ran out, or the server refused it ("Token has expired. Please re-authenticate." or "Invalid token. Please re-authenticate." in the browser's console). Scan the badge again. A timer that was running keeps running.

#### "... failed to start."

The tracker could not start the timer. Most often the operation has no Job Card for this work order: the server's reason, "Job card not found for this operation", is in the browser console. Check that the work order is submitted and has its Job Cards. Other causes are in the Error Log, titled "Error in start_timer".

#### An operation is missing from the list

A machine-time operation is shown only to members of its **Machine Employee Group**. With **My Station** on, only operations at the kiosk's workstations are shown: switch it off, or change the workstations in **Settings**.

#### A work order is missing

The tracker lists only work orders whose status is Submitted, Not Started or In Process. A completed, stopped or draft work order is not listed.

#### "... failed to stop." or "... machine timer failed to stop."

The tracker could not stop the timer, usually because it was already stopped, for example from another kiosk or in the desk: the server's reason, "No active time log found" or "No active machine timer found", is in the browser console. Reload the tracker to see the timers that are running.

#### "Failed to stop machine timer: ..."

"Not a machine operation" means the operation's **Is Machine Time** is not ticked, it has no **Machine Employee Group**, or its group has no members; "No active machine timer found" means the timer was already stopped, for example from another kiosk.

### In the desk

#### "Maximum Shift Length must be more than 0 and at most 48 hours."

Timeclock Settings refuses another value. Pick a length in that range.

#### "Row 1: 10:00 PM to 4:00 PM is longer than the maximum shift of 16 hours."

A Workday row's OUT is more than the maximum shift length after its IN. An OUT earlier than its IN is read as the next morning's, so check AM and PM.

#### A time disappears from a Workday when you save

It was not written as `h:mm AM` or `h:mm PM`. Type it again in that form, for example `7:30 AM`.

#### "Hours must be more than 0", "8 hours is longer than the maximum shift of 16 hours" or "Hours can only be set on an OUT punch"

From the Workday Management report's **Hours** column. Hours are set on an OUT punch that is paired with an IN, and must be more than 0 and at most the maximum shift length.

#### "This OUT punch has no IN to count the hours from"

The OUT is a missed punch. Add the missing IN first, or change the OUT's **Time** instead.

#### "10 hours would end the shift after the next punch at 4:00 PM"

The new end would pass the employee's next punch. Set fewer hours, or correct the next punch first.

#### "Please select at least one punch row using the checkboxes"

**Delete Punches** deletes only ticked punch rows. Tick them in the first column.

#### "Nothing to rebuild. Select rows, or no workdays in view are out of sync."

No row is ticked and no day in view is **No Workday**, **Out of Sync** or **Log Type Mismatch**. Tick the days to rebuild, or widen the dates.

#### A day shows Duplicate Workday

There are two Workdays for one employee and date, often from **Bulk Add**. **Rebuild Workdays** updates only the oldest; delete the others from the Workday list.

#### There is no Timeclock menu on the Employee form

It is shown only to HR Manager and System Manager, and only on a saved Employee.

#### `/timeclock` or `/job_timeclock` is blank

The kiosk pages' scripts were not built. Run `bench build --app employee_timeclock` and reload the page.
