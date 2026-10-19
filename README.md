<!-- Copyright (c) 2026, Avunu LLC and contributors
For license information, please see license.txt-->

## Employee Timeclock

ERPNext Employee Timeclock

### The kiosks

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

### Setting up a kiosk

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

#### License

MIT
