# Development

Requires Node 24+ and yarn. `nix develop` (or direnv) gives you both, plus the git hooks and a dev bench with ERPNext and HRMS.

| Command                             | What it does                                                                                                                                              |
| ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `yarn build`                        | Builds the job time tracker with Vite, then registers it in the bench's `sites/assets/assets.json` (`scripts/vite-register.mjs`; skipped outside a bench) |
| `yarn build:job_timeclock`          | Builds only the job time tracker (`/job_timeclock`), as `job_timeclock.bundle.*`                                                                          |
| `yarn dev:job_timeclock`            | Rebuilds the job time tracker on change; reload the page to pick it up                                                                                    |
| `yarn typecheck`                    | Type-checks the scripts, the desk JavaScript, the Vue SPA (`tsconfig.json`) and the React badge kiosk (`tsconfig.react.json`)                             |
| `yarn test`                         | Runs the badge kiosk's tests (Vitest, `vitest.config.ts`) and fails unless they cover every line and branch of it                                         |
| `yarn lint` / `yarn format`         | Runs oxlint and oxfmt                                                                                                                                     |
| `generate-types`                    | Regenerates `public/js/job_timeclock/types.ts` from the Pydantic models in `www/job_timeclock/models.py`                                                  |
| `frappe-test --reuse-site`          | Runs the Python tests on the dev site, with coverage                                                                                                      |
| `python tools/build_kiosk_icons.py` | Redraws the badge kiosk's app icons into `public/images/kiosk/` (needs `inkscape`; the PNGs are committed)                                                |
| `frappe-shots`                      | Rebuilds the demo site (`employee_timeclock/demo.py`) and retakes the screenshots in `docs/screenshots/`                                                  |

The desk JavaScript (`public/js/*.js` and the `*.bundle.js` files) and the badge kiosk (`public/js/timeclock.bundle.ts`, `public/scss/kiosk.bundle.scss`) are built by `bench build` with esbuild, as in any Frappe app. `bench build` also runs `yarn build`, so the job time tracker is built with it. Run `bench build` from the bench you serve the site from: inside the app folder, `bench` is the app's own dev bench.

## Where things live

- `employee_timeclock/kiosk.py`: the Timeclock Kiosk role check, badge resolution (badge tokens and RFID tags) and the Issue/Revoke Badge methods.
- `employee_timeclock/auth.py`: the key the kiosks' badge JWTs are signed with (the site's `encryption_key`).
- `employee_timeclock/timeclock/api.py`: the Employee Checkin and Workday sync hooks, and the web form's `submit_checkin`.
- `employee_timeclock/timeclock/doctype/workday/`: the Workday DocType, its list view's Bulk Add and `bulk_add_punches`.
- `employee_timeclock/timeclock/report/workday_management/`: the Workday Management report and its punch-editing methods.
- `employee_timeclock/timeclock/web_form/employee_timelog/`: the Employee Clock-in/out web form (`/employee-timeclock`).
- `employee_timeclock/www/timeclock/`: the badge kiosk (`/timeclock`), a React + Carbon app in `src/` whose `punch` endpoint is in `__init__.py`.
- `employee_timeclock/public/js/kiosk/`: what a kiosk page shares (mounting, the toolbar, the session timer, toasts, backend calls, the badge scanner), and `public/js/kiosk-sw.js`, its service worker.
- `employee_timeclock/kiosk_pwa.py`: makes each kiosk page an installable app: its manifest, icons (`public/images/kiosk/`, drawn by `tools/build_kiosk_icons.py`) and service worker, served at `/<page>/manifest.webmanifest` and `/<page>/sw.js`. Browsers only install it, and only run the worker, on HTTPS or `localhost`.
- `employee_timeclock/www/job_timeclock/` and `public/js/job_timeclock/`: the job time tracker (`/job_timeclock`). `models.py` holds the API's Pydantic response models.
- `employee_timeclock/www/job_timeclock_legacy/`: the old job time tracker, kept until a follow-up removes it. It is excluded from linting, type checks and coverage.
- `employee_timeclock/timeclock/custom/`: the custom fields on Employee, Employee Checkin, Job Card, Job Card Time Log and Operation, and the `TimeclockJobCard` class extension.
- `employee_timeclock/public/dist/`: the build output. It is generated and not committed.
- `marketplace/`: the marketplace listing and the screenshot spec.

## The rename shim

The app was called `timeclock` before it was renamed to `employee_timeclock`. The block between `frappe-nix:rename-shim-begin` and `frappe-nix:rename-shim-end` in `hooks.py` maps the old dotted paths of the whitelisted methods to the new ones, for cached bundles and bookmarks that still use them. Keep it for at least one minor release after the rename.
