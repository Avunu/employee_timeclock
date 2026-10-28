<!-- Copyright (c) 2026, Avunu LLC and contributors
For license information, please see license.txt-->

<!-- frappe-nix:begin header -->

<div align="center">

<img src="employee_timeclock/public/images/employee_timeclock-logo.svg" width="80" alt="">

# Employee Timeclock

Badge-scan timeclock kiosks and job-card time tracking for ERPNext and HRMS

[![CI](https://github.com/Avunu/employee_timeclock/actions/workflows/ci.yml/badge.svg?branch=main)](https://github.com/Avunu/employee_timeclock/actions/workflows/ci.yml)
[![Latest release](https://img.shields.io/github/v/release/Avunu/employee_timeclock)](https://github.com/Avunu/employee_timeclock/releases)
[![License: MIT](https://img.shields.io/badge/license-MIT-blue)](license.txt)
[![Frappe v16](https://img.shields.io/badge/Frappe-v16-blue)](https://github.com/frappe/frappe/tree/version-16)
[![Documentation](https://img.shields.io/badge/docs-docs.avunu.net-blue)](https://docs.avunu.net/employee-timeclock/)

<picture>
  <img src="docs/screenshots/job-tracker-light.webp" alt="The job time tracker: open work orders, the workbench order's operations with logged time, and a welding timer running">
</picture>

</div>

<!-- frappe-nix:end header -->

## Overview

Paper time cards and shared logins make payroll slow and hard to trust. Employee Timeclock puts a kiosk on a tablet or PC by the door: employees scan a badge to clock in and out, and the punches land in HRMS as Employee Checkins. Each employee's punches for a day are gathered into one **Workday** record that HR reviews and corrects. On the shop floor, the same badge starts and stops timers on Job Cards, so labour time reaches the work order without anyone re-keying it.

It is for ERPNext sites that pay hourly staff and, optionally, track manufacturing labour. It needs ERPNext and HRMS.

Full documentation: [docs.avunu.net/employee-timeclock/docs/](https://docs.avunu.net/employee-timeclock/docs/).

## Features

- **Badges.** HR issues a random badge token from the Employee form and prints it as a barcode or QR code; only its SHA-256 hash is stored. RFID tags in the Employee's _Attendance Device IDs_ work too. An employee is never identified by their Employee ID. See [docs/badges.md](docs/badges.md).
- **Kiosks.** The badge kiosk (`/timeclock`) and the Employee Clock-in/out form (`/employee-timeclock`, which also takes a time entered by hand) run signed in as a **Timeclock Kiosk** user and decide by themselves whether a scan is an IN or an OUT. See [docs/clock-in.md](docs/clock-in.md).
- **Night shifts.** An IN pairs with the OUT that closes it within a maximum shift length (16 hours unless changed), and the shift's hours count on the IN's date. A punch that pairs with nothing is a missed punch.
- **Workdays.** One Workday per employee per day holds up to twelve shifts and their total hours, in step with the Employee Checkins both ways. The Workday Management report flags missing punches and days out of sync, and lets HR edit, add, delete and rebuild punches in place; **Bulk Add** enters the same punches for several employees. See [docs/workdays.md](docs/workdays.md).
- **Job time tracker** (`/job_timeclock`). Employees start and stop timers and rework timers on a work order's operations, written to the Job Cards as time logs, with machine time, pinned jobs and per-kiosk workstations. See [docs/job-tracker.md](docs/job-tracker.md).
- **Payroll reports.** Regular and overtime hours per employee from Workdays or from punches, hours per day, and a punch list. See [docs/payroll-reports.md](docs/payroll-reports.md).
- **Kiosk safety.** Only Active employees can clock in, badge scans are rate limited per client IP, and an unrecognised badge gets the same answer whatever the reason.

<!-- frappe-nix:begin compatibility -->

## Compatibility

| Frappe | Branch       |
| ------ | ------------ |
| v16    | `version-16` |

| Requires                                     | Version            |
| -------------------------------------------- | ------------------ |
| [erpnext](https://github.com/frappe/erpnext) | `>=16.0.0,<17.0.0` |
| [hrms](https://github.com/frappe/hrms)       | `>=16.0.0,<17.0.0` |

<!-- frappe-nix:end compatibility -->

<!-- frappe-nix:begin installation -->

## Installation

```bash
bench get-app https://github.com/Avunu/employee_timeclock --branch version-16
bench --site <site> install-app employee_timeclock
```

<!-- frappe-nix:end installation -->

The `version-16` branch still holds 16.0.0, from before the app was renamed from `timeclock`. Until the next release moves it, install from `main` instead: `bench get-app https://github.com/Avunu/employee_timeclock --branch main`.

## Upgrading

`bench migrate` runs the app's patches. One of them, `employee_timeclock.patches.rebuild_workdays_for_night_shifts`, changes payroll hours: it rebuilds the Workdays of the last two weeks (or from the date in the site config key `employee_timeclock_rebuild_workdays_from`) so that a night shift sits on the day it started. It leaves alone Workdays in a payroll period with a Salary Slip, writes an Info comment on each Workday it changes, and prints a summary. Read [docs/install.md](docs/install.md#upgrade) before upgrading a site that already has Workdays. A new site gets no rebuild: installing the app marks its patches as done.

## Configuration

1. **Create the kiosk user**, a Website User with only the **Timeclock Kiosk** role, one per device.
2. **Issue badges** from each Employee (_Timeclock → Issue Badge_, HR Manager or System Manager).
3. **Sign the kiosk in** on the device and leave the browser on the kiosk page.

_Timeclock Settings_ holds the **Maximum Shift Length (Hours)**, 16 by default and at most 48. Operations are timed against a machine with _Is Machine Time_ and a _Machine Employee Group_. Every setting, role and change the app makes is in [docs/configuration.md](docs/configuration.md).

## How It Works

- Every punch is an **Employee Checkin**. Punches pair into shifts in `employee_timeclock/timeclock/shifts.py`, which every kiosk, the Workday sync and the hours reports use.
- The clock-in form posts the scanned badge to `submit_checkin`; the badge kiosk and the job tracker exchange a badge for a 30-minute JWT signed with the site's `encryption_key`.
- `doc_events` keep Workdays and Employee Checkins in step both ways, and `TimeclockJobCard` (an `extend_doctype_class` on Job Card) adapts Job Cards to the tracker's timers and machine time.
- The kiosk apps are Vue 3 and frappe-ui, built with Vite by `yarn build`, which `bench build` runs.

The design is described in [docs/development/architecture.md](docs/development/architecture.md).

## Limitations

- A Workday holds at most twelve in and out pairs, and a shift cannot be longer than the maximum shift length.
- Overtime in the payroll reports is hours over 40 in a Sunday-to-Saturday week; the 40 cannot be configured.
- Saving a Workday rewrites only the punches of its own date, and a punch recorded less than a minute after a Workday save is not copied into it; the Workday Management report shows such days as Out of Sync, and _Rebuild Workdays_ fixes them.
- The kiosk pages are in English only and have no dark theme.
- The old job time tracker at `/job_timeclock_legacy` still ships; it is replaced by `/job_timeclock` and will be removed.

The full list, and the messages the app shows with their fixes, are in [docs/troubleshooting.md](docs/troubleshooting.md).

<!-- frappe-nix:begin support -->

## Support

- Documentation: [docs.avunu.net/employee-timeclock/](https://docs.avunu.net/employee-timeclock/)
- Bug reports and questions: [GitHub issues](https://github.com/Avunu/employee_timeclock/issues)
- E-mail: <mail@avu.nu>

<!-- frappe-nix:end support -->

<!-- frappe-nix:begin development -->

## Development

```bash
nix develop        # or: direnv allow
prek install       # the git hooks CI runs
frappe-test        # the tests, the way CI runs them
```

The managed files, checks and release flow are described in the [app standards documentation](https://docs.avunu.net/frappe-nix/docs/app-standards/).

<!-- frappe-nix:end development -->

The build commands, the source layout and the rename shim are described in [docs/development/README.md](docs/development/README.md).

<!-- frappe-nix:begin license -->

## License

MIT, Copyright (c) 2022–present Avunu LLC → [license.txt](license.txt)

<!-- frappe-nix:end license -->
