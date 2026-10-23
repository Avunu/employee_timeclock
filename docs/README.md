# Employee Timeclock

Badge-scan timeclock kiosks and job-card time tracking for ERPNext and HRMS

Badge-scan timeclock kiosks for ERPNext and HRMS. Employees clock in and out by scanning a badge, and on the shop floor the same badge starts and stops timers on Job Cards. Each employee's punches for a day are kept in one Workday record, in sync with their Employee Checkins.

## The kiosks

| Page                                                   | Who signs in                             | How an employee identifies                                          |
| ------------------------------------------------------ | ---------------------------------------- | ------------------------------------------------------------------- |
| `/employee-timeclock` (Employee Clock-in/out web form) | a kiosk user                             | scans their badge                                                   |
| `/timeclock` (badge kiosk)                             | a kiosk user                             | scans their badge                                                   |
| `/job_timeclock` (job time tracker)                    | a kiosk user, or the employee's own user | scans their badge at a kiosk; a signed-in employee is already known |

None of the pages or their API methods accept Guest. An employee is never identified by their
Employee ID, which is guessable. A badge is either:

- a **badge token** HR issues from the Employee form. It is random, it is shown once for printing
  on the badge (as a barcode or QR code), and only its SHA-256 hash is stored; or
- an **RFID tag** registered in the Employee's _Attendance Device IDs_ table.

Badge scans are rate limited per client IP, and an unrecognised badge is refused with the same
message whatever the reason, so a kiosk never reveals whether an employee exists.

## Installation

The app needs ERPNext and HRMS on the site. From the bench directory:

```bash
bench get-app https://github.com/Avunu/employee_timeclock --branch main
bench --site <site> install-app employee_timeclock
```

## Setting up a kiosk

1. **Create the kiosk user.** In _User_, add a user for the kiosk device (one per device makes it
   easy to revoke one), as a _Website User_, with only the **Timeclock Kiosk** role. The app
   installs that role. Give it a strong password.
2. **Issue badges.** For each employee who will clock in, open the Employee and choose
   _Timeclock → Issue Badge_ (HR Manager or System Manager only). Print the token shown on the
   employee's badge as a barcode or QR code that the kiosk's scanner reads. Issuing again replaces
   the badge; _Timeclock → Revoke Badge_ disables it for a lost badge or a leaver. Employees who
   already badge in with an RFID tag in _Attendance Device IDs_ keep working without a new badge.
3. **Sign the kiosk in.** On the kiosk device, open the kiosk page, sign in as the kiosk user and
   leave the browser on that page.

Only Active employees can clock in.

## Shifts, night shifts and missed punches

Every punch is an Employee Checkin with a log type, IN or OUT. The kiosks, the Workdays and the
hours reports all pair them the same way:

- Punches are taken in time order. An OUT closes the employee's open IN when it comes no more than
  the **maximum shift length** after it. That pair is one shift.
- A shift's hours count on the date of its IN. A shift from 10 PM Saturday to 6 AM Sunday is eight
  hours on Saturday: on Saturday's Workday, in Saturday's row of the Work Day Hours Report and in
  that week's total for overtime, though Sunday starts a new payroll week.
- A punch that pairs with nothing is a **missed punch** and counts no hours: an IN followed by
  another IN, or by an OUT more than the maximum shift length later, and an OUT with no open IN.
  One missed punch never shifts the pairs after it. The reports flag it, and the Workday
  Management report shows the day as _Missing Punch_ until HR adds or fixes the punch.
- At a kiosk, a scan is an OUT while the employee has an IN open from the last maximum shift length,
  and an IN otherwise. A night worker's scan after midnight closes their shift; an IN left open
  longer ago (a forgotten clock-out) does not turn the next morning's scan into an OUT.

The maximum shift length is set in _Timeclock Settings_ (HR Manager or System Manager), 16 hours by
default and less than 24, since a Workday row and the Workday Management report read an OUT as
the first such time of day after its IN.

On the Workday form, each row is one shift: its IN is on the Workday's date, and an OUT earlier than
its IN is the next morning's. A row longer than the maximum shift length is refused. In the
Workday Management report a night shift's OUT reads, for example, _6:00 AM (+1)_; editing its time
keeps it after its IN, and setting its hours can run past midnight. To add a night shift's missing
OUT, use _Add Punch_ with the next day's date.

Workdays built before this pairing keep a night shift split over two calendar dates until they are
rebuilt: the Workday Management report shows those days as _Out of Sync_, and _Rebuild Workdays_
fixes them.

## Development

The build commands, the source layout and the rename shim are described in [Development](development.md).

## License

[MIT](https://github.com/Avunu/employee_timeclock/blob/main/license.txt), Copyright (c) 2022–present Avunu LLC.
