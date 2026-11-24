---
title: Develop Employee Timeclock
description: Set up the dev shell, build the kiosks, run the Python tests and front-end checks, and see what CI and the release flow do.
nav_title: Development
order: 9
updated: 2026-11-02
---

This page is for people changing the app. [How it works](architecture.md) explains the design behind the code.

## Set up

You need Node 24 or newer and yarn. `nix develop` (or `direnv allow`) gives you both, plus the git hooks and a dev bench with ERPNext and HRMS:

```bash
nix develop
prek install
frappe-test --reuse-site
```

`prek install` installs the git hooks CI runs, and `frappe-test` runs the tests the way CI does. The managed files, the checks and the release flow are described in the [app standards documentation](https://docs.avunu.net/frappe-nix/docs/app-standards/).

## Commands

| Command                    | What it does                                                                                                                                                 |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `yarn build`               | Builds the old Vue job tracker with Vite, then registers it in the bench's `sites/assets/assets.json` (`scripts/vite-register.mjs`; skipped outside a bench) |
| `yarn dev:job_timeclock`   | Rebuilds the old Vue tracker on change                                                                                                                       |
| `yarn typecheck`           | Type-checks the scripts, the desk JavaScript and the kiosks                                                                                                  |
| `yarn lint`, `yarn format` | Runs oxlint and oxfmt; `yarn lint:css` runs stylelint on the SCSS                                                                                            |
| `yarn test`                | Runs the kiosks' tests (Vitest), and fails unless they cover every line and branch                                                                           |
| `yarn run check`           | Runs `format:check`, `lint`, `lint:css` and `typecheck` together, the last including the kiosks' tests (plain `yarn check` is Yarn's own command)            |
| `generate-types`           | Regenerates `www/job_timeclock/src/types.ts` from the Pydantic models in `www/job_timeclock/models.py` (defined in `nix/local.nix`)                          |
| `frappe-test --reuse-site` | Runs the Python tests on the dev site, with coverage                                                                                                         |
| `frappe-shots`             | Rebuilds the demo site (`employee_timeclock/demo.py`) and retakes the screenshots in `docs/screenshots/`                                                     |

The desk JavaScript and the kiosks (`public/js/*.js`, the `*.bundle.*` files in `public/`) are built by `bench build` with esbuild, as in any Frappe app. A kiosk's bundle in `public/js/` is one line importing its `www/<page>/src/main`; all its source lives there. `bench build` also runs `yarn build`, so the old Vue tracker is built with it.

## Where things live

```text
employee_timeclock/
  hooks.py                       doc_events, the Job Card extension, desk scripts, fixtures, rename shim
  kiosk.py                       the Timeclock Kiosk role check, badge resolution, Issue/Revoke Badge
  auth.py                        the key the badge sessions (JWTs) are signed with
  permissions.py                 who sees the apps-screen tile
  demo.py                        demo data for frappe-demo and the screenshots
  fixtures/                      the Timeclock Kiosk role and the Job Card List View Settings
  patches/                       rebuild_workdays_for_night_shifts and its tests
  timeclock/                     the Timeclock module
    shifts.py                    how punches pair into shifts, and the Workday sync
    api.py                       the Employee Checkin and Workday hooks, and submit_checkin
    custom/                      custom fields and the TimeclockJobCard extension
    doctype/                     Workday, Timeclock Settings, Attendance Device ID
    page/workday_management/     the older Workday Management desk page
    report/                      Workday Management, Workday Payroll, Payroll, Work Day Hours, Punch List
    web_form/employee_timelog/   the Employee Clock-in/out web form (/employee-timeclock)
  www/timeclock/                 the badge kiosk's page and API (/timeclock); src/ is its React app
  www/job_timeclock/             the job time tracker's page and API (/job_timeclock); src/ is its React app
  www/shared/                    what the kiosks share: mounting, session, toolbar, scanner, offline sync,
                                 and kiosk-sw.js, their service worker
  www/job_timeclock_vue/         the old Vue tracker's page, kept while the new one is tried out
  public/js/job_timeclock/       the old Vue tracker's source
  public/js/*.js                 desk scripts (Employee, Job Card, the Bulk Add dialog) and the web form's time picker
  public/dist/                   build output, generated and not committed
marketplace/                     the marketplace listing and the screenshot spec
nix/local.nix                    app-specific dev shell scripts (generate-types)
```

## Tests

The Python tests are Frappe integration tests next to the code they cover:

| File                                                             | Covers                                                                                                                       |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `test_kiosk.py`                                                  | The kiosk role check, badge tokens and RFID tags, Issue and Revoke Badge, and the endpoints they guard                       |
| `timeclock/test_shifts.py`                                       | The shift pairing rule and what it feeds: the Workday sync, the Workday form, the kiosks' next direction, Timeclock Settings |
| `timeclock/test_api.py`                                          | The clock-in form's `submit_checkin` chain and the Employee Checkin hook that keeps the Workday in sync                      |
| `timeclock/doctype/workday/test_workday.py`                      | The Workday hooks and `bulk_add_punches`                                                                                     |
| `timeclock/report/workday_management/test_workday_management.py` | The report's rows and its punch edits: add, move, delete, rebuild                                                            |
| `timeclock/report/payroll_report/test_payroll_report.py`         | The Payroll, Work Day Hours and Workday Payroll reports                                                                      |
| `timeclock/custom/test_job_card.py`                              | The `TimeclockJobCard` extension                                                                                             |
| `www/timeclock/test_timeclock.py`                                | The badge kiosk and the signing key                                                                                          |
| `www/job_timeclock/test_sync_timer_events.py`                    | Offline timer events and the snapshot                                                                                        |
| `www/job_timeclock/test_job_timeclock.py`                        | The job time tracker's API                                                                                                   |
| `patches/test_rebuild_workdays_for_night_shifts.py`              | The night-shift rebuild patch                                                                                                |
| `tests/test_demo.py`                                             | The demo hook and the apps-screen permission                                                                                 |

Frappe only runs tests on a site that allows them. Use a development or test site, never production:

```bash
bench --site <TEST_SITE> set-config allow_tests true
bench --site <TEST_SITE> run-tests --app employee_timeclock
```

`frappe-test --reuse-site` runs them with coverage of the app alone. The floor is `fail_under` in `pyproject.toml` (80), and coverage leaves out the tests, the patches and the legacy tracker.

There are no JavaScript unit tests. `yarn typecheck`, `yarn lint` and `yarn format:check` are the front-end gates.

## Continuous integration and releases

`.github/workflows/ci.yml` is managed by frappe-nix and runs the shared quality gates on every pull request, every push to `main` and once a day, as checks named `ci / lint`, `ci / typecheck`, `ci / test` and `ci / marketplace`. `pr-policy.yml` checks a pull request's base, title and commits; `nightly.yml` runs the integration suites each night; `deps.yml` relocks after a dependency bump; and `release.yml` runs release-please, which writes `CHANGELOG.md` and moves the `version-16` branch forward on a release. The [app standards documentation](https://docs.avunu.net/frappe-nix/docs/app-standards/) describes each.

`.pre-commit-config.yaml` is managed by frappe-nix too. It runs ruff and ssort on Python, oxlint, oxfmt and stylelint on the front end, workflow and shell linting, the conventional-commit check and Frappe's own checks (copyright headers, patches, doctype types, customizations).

The `Docs` workflow (`.github/workflows/docs.yml`) checks these pages when `docs/` changes. See [Working on these docs](#working-on-these-docs).

## The rename shim

The app was called `timeclock` before it was renamed to `employee_timeclock`. The block between `frappe-nix:rename-shim-begin` and `frappe-nix:rename-shim-end` in `hooks.py` maps the old dotted paths of the whitelisted methods to the new ones, for cached pages and bookmarks that still use them. Keep it for at least one minor release after the rename.

## Working on these docs

The documentation is Markdown in `docs/`. It is published with the other Avunu projects at [docs.avunu.net/employee-timeclock/docs/](https://docs.avunu.net/employee-timeclock/docs/) by [Avunu/site-docs](https://github.com/Avunu/site-docs), which picks up the latest release of this repository. Write the files so that they read well on GitHub too: front matter, GitHub alerts and relative links. The screenshots in `docs/screenshots/` are generated by `frappe-shots`; do not edit them by hand.

To check a change as the pull request check does, clone Avunu/site-docs beside this repository and, from its folder, run:

```bash
npm ci --ignore-scripts && npm run build
node build/cli.js check --only employee-timeclock --source employee-timeclock=../employee_timeclock
```

Use `build --lenient` instead of `check` to write a preview of the site into `dist/`.
