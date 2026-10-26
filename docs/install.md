---
title: Install and upgrade
description: Install Employee Timeclock on a Frappe v16 bench with ERPNext and HRMS, see what the install adds, and upgrade a site that already has Workdays.
nav_title: Install
order: 1
updated: 2026-10-26
---

Employee Timeclock installs like any Frappe app. Two things are specific to it: the kiosk pages are built with Vite, so the assets have to be built, and one upgrade patch rewrites Workdays, so read [Upgrade](#upgrade) before you migrate a site that already uses the app.

## Before you start

- A bench with Frappe v16 and a site that has ERPNext and HRMS installed.
- Node 24 or newer and yarn on the bench machine.
- A System Manager login on the site.

## Install

Run these from the bench directory. `<SITE_NAME>` is your site, for example `site1.example.com`.

```bash
bench get-app https://github.com/Avunu/employee_timeclock --branch version-16
bench --site <SITE_NAME> install-app employee_timeclock
```

> [!IMPORTANT]
> The `version-16` branch still holds 16.0.0, from before the app was renamed from `timeclock`. Until the next release moves it, install from `main` instead: `bench get-app https://github.com/Avunu/employee_timeclock --branch main`.

`bench get-app` builds the app's assets. If you pull new code by hand, run `bench build --app employee_timeclock`: Frappe's build runs the app's `yarn build`, which builds the badge kiosk and the job time tracker with Vite and registers them in `sites/assets/assets.json`. Without it, `/timeclock` and `/job_timeclock` load no script.

Then set the app up: [Configuration](configuration.md#set-up-a-kiosk) walks through the kiosk user, the badges and the kiosk device.

## What installing sets up

The app has no install hook of its own. Installing it syncs these from the app's files:

- **Doctypes.** Workday, Timeclock Settings and Attendance Device ID (the child table behind the Employee's **Attendance Device IDs**).
- **Custom fields and property setters** on Employee, Employee Checkin, Job Card, Job Card Time Log and Operation. [Configuration](configuration.md#what-the-app-adds-to-your-site) lists every one.
- **Fixtures.** The **Timeclock Kiosk** role, without desk access, and the List View Settings of Job Card, which show the columns Operation, Status, Rework, Total Time in Mins, Work Order and Workstation.
- **Pages and reports.** The Employee Clock-in/out web form (`/employee-timeclock`), the Workday Management desk page, and the Workday Management, Workday Payroll, Payroll, Work Day Hours and Punch List reports.
- **Timeclock Settings**, with **Maximum Shift Length (Hours)** at its default of 16.

Frappe marks every patch of a newly installed app as done without running it, so a new site gets no Workday rebuild.

## Upgrade

Update the app the way you update any Frappe app: `bench update`, or pull the new code in `apps/employee_timeclock` and then run these from the bench directory.

```bash
bench build --app employee_timeclock
bench --site <SITE_NAME> migrate
```

`bench migrate` re-syncs the doctypes, custom fields, property setters and fixtures, and runs any patch the app has shipped since you last migrated. One patch changes payroll hours.

### Rebuilding Workdays for night shifts

The patch `employee_timeclock.patches.rebuild_workdays_for_night_shifts` runs once, after the doctypes are migrated. Workdays used to hold the punches of one calendar date, paired by position whatever their log type. Now a shift is an IN and the OUT that closes it, and it belongs to the IN's date (see [How punches pair into shifts](workdays.md#how-punches-pair-into-shifts)). The patch rebuilds the existing Workdays that way, through the same code as **Rebuild Workdays** in the Workday Management report.

**What changes.** Only a Workday whose slots or total hours differ from its punches' shifts, or whose punches are not yet linked to it, is rewritten: its twelve in and out slots, their times and its **Total Hours**. A night shift's OUT moves from the next day's Workday onto the day the shift started, so the first day gains the shift's hours and the next day loses the lone OUT. A day whose punches did not alternate IN, OUT is paired by log type, so two INs in a row now leave the first one a missed punch with no hours where they used to be paired. On the Employee Checkins of the rebuilt days the patch sets **Workday** to the day's Workday, and gives a punch with no log type the one it paired as. It creates and deletes no Workday or Employee Checkin, never changes a punch's time, and runs none of the Workday or Employee Checkin hooks.

**Workdays that trade punches change together.** When a night shift's OUT moves from one Workday onto the one before, both are rebuilt in one step or neither is, so no punch ever shows on two Workdays or drops off both. A run of night shifts chains its Workdays this way.

**Only the last two weeks, by default.** The patch rebuilds only Workdays dated on or after a floor date, so payroll history that is already paid is not rewritten. Without configuration the floor is the site's date minus 14 days. The site config key `employee_timeclock_rebuild_workdays_from` (`YYYY-MM-DD`), when set, replaces it: earlier to rebuild further back, later to rebuild less. Set it before you migrate:

```bash
bench --site <SITE_NAME> set-config employee_timeclock_rebuild_workdays_from 2026-09-01
```

A night shift that starts the day before the floor and ends on it is left alone on both days, so its OUT is neither dropped nor shown twice.

**What it leaves alone.**

- Every Workday before the floor.
- Every Workday in a payroll period that has a draft or submitted Salary Slip for its employee. A cancelled slip does not count.
- Any Workday that trades punches with one of those, with one before the floor, or with a date that has punches but no Workday, since rebuilding it alone would count a punch twice or drop it.
- A Workday whose group shows a time that no Employee Checkin backs (hours typed straight into the Workday), since the rebuild would wipe it.
- Of duplicate Workdays for one employee and date, all but the oldest, as **Rebuild Workdays** does.
- Workdays that already match their punches: they are not written at all.

**Audit.** Each rebuilt Workday gets an Info comment with its hours before and after. `bench migrate` prints a summary: the Workdays checked, rebuilt and left alone, the total hours before and after, and the names of the out-of-date Workdays it left alone. The same summary goes to the `employee_timeclock.patches` log. It also counts the Workdays before the floor and how many of them are out of date.

**Rebuilding older Workdays later.** Use **Rebuild Workdays** in the Workday Management report for the employees and dates to rebuild, once payroll for that period is settled (see [Fix a day that is out of sync](workdays.md#fix-a-day-that-is-out-of-sync)). Or set the floor to an earlier date and run the patch again. It is safe to rerun, and Salary Slip periods are still left alone:

```bash
bench --site <SITE_NAME> set-config employee_timeclock_rebuild_workdays_from 2026-01-01
bench --site <SITE_NAME> execute employee_timeclock.patches.rebuild_workdays_for_night_shifts.execute
```

**Safety.** The patch works one employee at a time and commits after each, so a large site is never held in one transaction. A Workday that fails to rebuild is rolled back with the Workdays it trades punches with, logged to the Error Log and counted, and the rest go on. Running it again rewrites nothing that is already up to date, so a migrate that stops partway can be run again.

Until a Workday is rebuilt, the Workday Management report shows it as **Out of Sync**.

## Uninstall

```bash
bench --site <SITE_NAME> uninstall-app employee_timeclock
```

Frappe backs the site up first, then deletes what belongs to the app's Timeclock module:

- The Workday and Attendance Device ID tables, with every Workday and every registered RFID tag, and Timeclock Settings.
- The web form, the Workday Management page and the five reports.
- The custom field and property setter records listed in [Configuration](configuration.md#what-the-app-adds-to-your-site).

What stays behind:

- Every Employee Checkin, Job Card and Job Card Time Log, because they belong to HRMS and ERPNext.
- The database columns of the custom fields, with their values: Frappe deletes the Custom Field records but does not drop the columns.
- The **Timeclock Kiosk** role and its users, and the Job Card List View Settings. Delete the kiosk users, or disable them, by hand.
- The `encryption_key` in `site_config.json`, which is Frappe's own and also encrypts the site's passwords. Never remove it.

## Next

- [Configuration](configuration.md) sets up a kiosk and lists every setting.
- [Issue and revoke badges](badges.md) gives employees a badge to scan.
