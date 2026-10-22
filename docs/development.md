# Development

Requires Node 24+ and yarn. `nix develop` (or direnv) gives you both, plus the git hooks and a dev bench with ERPNext and HRMS.

| Command                     | What it does                                                                                                                                           |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `yarn build`                | Builds both kiosk SPAs with Vite, then registers them in the bench's `sites/assets/assets.json` (`scripts/vite-register.mjs`; skipped outside a bench) |
| `yarn build:timeclock`      | Builds only the badge kiosk (`/timeclock`), as `timeclock_kiosk.bundle.*`                                                                              |
| `yarn build:job_timeclock`  | Builds only the job time tracker (`/job_timeclock`), as `job_timeclock.bundle.*`                                                                       |
| `yarn dev:<spa>`            | Rebuilds one SPA on change; reload the kiosk page to pick it up                                                                                        |
| `yarn typecheck`            | Type-checks the scripts, the desk JavaScript and the SPAs                                                                                              |
| `yarn lint` / `yarn format` | Runs oxlint and oxfmt                                                                                                                                  |
| `generate-types`            | Regenerates `public/js/job_timeclock/types.ts` from the Pydantic models in `www/job_timeclock/models.py`                                               |
| `frappe-test --reuse-site`  | Runs the Python tests on the dev site, with coverage                                                                                                   |
| `frappe-shots`              | Rebuilds the demo site (`employee_timeclock/demo.py`) and retakes the screenshots in `docs/screenshots/`                                               |

The desk JavaScript (`public/js/*.js` and the `*.bundle.js` files) is built by `bench build` with esbuild, as in any Frappe app. `bench build` also runs `yarn build`, so the two SPAs are built with it.

## Where things live

- `employee_timeclock/kiosk.py`: the Timeclock Kiosk role check, badge resolution (badge tokens and RFID tags) and the Issue/Revoke Badge methods.
- `employee_timeclock/auth.py`: the key the kiosks' badge JWTs are signed with (the site's `encryption_key`).
- `employee_timeclock/timeclock/api.py`: the Employee Checkin and Workday sync hooks, and the web form's `submit_checkin`.
- `employee_timeclock/timeclock/doctype/workday/`: the Workday DocType, its list view's Bulk Add and `bulk_add_punches`.
- `employee_timeclock/timeclock/report/workday_management/`: the Workday Management report and its punch-editing methods.
- `employee_timeclock/timeclock/web_form/employee_timelog/`: the Employee Clock-in/out web form (`/employee-timeclock`).
- `employee_timeclock/www/timeclock/` and `public/js/timeclock/`: the badge kiosk (`/timeclock`).
- `employee_timeclock/www/job_timeclock/` and `public/js/job_timeclock/`: the job time tracker (`/job_timeclock`). `models.py` holds the API's Pydantic response models.
- `employee_timeclock/www/job_timeclock_legacy/`: the old job time tracker, kept until a follow-up removes it. It is excluded from linting, type checks and coverage.
- `employee_timeclock/timeclock/custom/`: the custom fields on Employee, Employee Checkin, Job Card, Job Card Time Log and Operation, and the `TimeclockJobCard` class extension.
- `employee_timeclock/public/dist/`: the build output. It is generated and not committed.
- `marketplace/`: the marketplace listing and the screenshot spec.

## The rename shim

The app was called `timeclock` before it was renamed to `employee_timeclock`. The block between `frappe-nix:rename-shim-begin` and `frappe-nix:rename-shim-end` in `hooks.py` maps the old dotted paths of the whitelisted methods to the new ones, for cached bundles and bookmarks that still use them. Keep it for at least one minor release after the rename.
