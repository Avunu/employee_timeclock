---
title: Payroll reports
description: The four reports that turn punches and Workdays into hours, how they pair punches, and how they split regular and overtime hours.
nav_title: Payroll reports
order: 7
updated: 2026-10-26
---

Four reports turn the punches into hours for payroll. Two read Workdays, as HR corrected them; two read the Employee Checkins directly, paired into shifts the same way as the Workdays (see [How punches pair into shifts](workdays.md#how-punches-pair-into-shifts)). Before you run payroll, check the period in the [Workday Management report](workdays.md#the-workday-management-report) with **Issues Only** ticked.

| Report                     | Reads             | Shows                                                                                     | Who can run it                      |
| -------------------------- | ----------------- | ----------------------------------------------------------------------------------------- | ----------------------------------- |
| **Workday Payroll Report** | Workdays          | Per employee: **Regular Hours**, **Overtime Hours** and **Total Hours**                   | HR Manager, System Manager          |
| **Payroll Report**         | Employee Checkins | Per employee: **Regular Hours**, **Overtime Hours**, **Total Hours** and **Missed Punch** | HR User, HR Manager, System Manager |
| **Work Day Hours Report**  | Employee Checkins | Per employee per day: **Work Hours** and **Missed Punch**                                 | HR User, HR Manager, System Manager |
| **Punch List**             | Employee Checkins | Every punch: **Employee Name**, **Time** and **Log Type**, newest first                   | HR User, HR Manager, System Manager |

## Regular and overtime hours

The Workday Payroll Report and the Payroll Report take a **Start Date** and an **End Date**, both required. They add up each employee's hours per week and split each week at 40 hours: up to 40 is regular, the rest is overtime.

- A week runs Sunday to Saturday, whatever the site's first day of the week. A week that spans New Year's Day is one week.
- A shift's hours count on the date of its IN, so a night shift that crosses midnight, or the end of a week, counts whole in the week it started.
- Only the dates you pick are counted. A period that starts or ends mid-week counts only that part of the week toward the 40 hours, so run the reports from a Sunday to a Saturday.
- The 40 hours cannot be configured.

The Workday Payroll Report sums the Workdays' **Total Hours**, so it includes HR's corrections and counts a missed punch as no hours. The Payroll Report pairs the punches itself and ticks **Missed Punch** for an employee with any unmatched punch in the period.

## Hours per day

The Work Day Hours Report lists one row per employee per day that has shifts, with the day's **Work Hours** as hours, minutes and seconds (`8:00:00`) and **Missed Punch** ticked when the day has an unmatched punch. Leave **From Date** or **To Date** blank to start at the first punch on the site or end at the last.

## Punches

The Punch List is a saved Report Builder view of Employee Checkin, sorted newest first, with no filter set: add filters, such as **Employee Name** or **Time**, in the report view. Open a punch to see its **Location / Device ID**, **Workday** and override fields.
