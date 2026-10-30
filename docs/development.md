# Development

Requires Node 24+ and yarn. `nix develop` (or direnv) gives you both, plus the git hooks and a dev bench with ERPNext and HRMS.

| Command                             | What it does                                                                                                                                                 |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `yarn build`                        | Builds the old Vue job tracker with Vite, then registers it in the bench's `sites/assets/assets.json` (`scripts/vite-register.mjs`; skipped outside a bench) |
| `yarn build:job_timeclock`          | Builds only the old Vue tracker (`/job_timeclock_vue`), as `job_timeclock_vue.bundle.*`                                                                      |
| `yarn dev:job_timeclock`            | Rebuilds the job time tracker on change; reload the page to pick it up                                                                                       |
| `yarn typecheck`                    | Type-checks the scripts, the desk JavaScript, the Vue SPA (`tsconfig.json`) and the React badge kiosk (`tsconfig.react.json`)                                |
| `yarn test`                         | Runs the kiosks' tests (Vitest, `vitest.config.ts`) and fails unless they cover every line and branch of them                                                |
| `yarn lint` / `yarn format`         | Runs oxlint and oxfmt                                                                                                                                        |
| `generate-types`                    | Regenerates `www/job_timeclock/src/types.ts` from the Pydantic models in `www/job_timeclock/models.py`                                                       |
| `frappe-test --reuse-site`          | Runs the Python tests on the dev site, with coverage                                                                                                         |
| `python tools/build_kiosk_icons.py` | Redraws the kiosks' app icons into `public/images/kiosk/` (needs `inkscape`; the PNGs are committed)                                                         |
| `frappe-shots`                      | Rebuilds the demo site (`employee_timeclock/demo.py`) and retakes the screenshots in `docs/screenshots/`                                                     |

The desk JavaScript (`public/js/*.js` and the `*.bundle.js` files) and the kiosks (`public/js/timeclock.bundle.ts`, `public/js/job-timeclock.bundle.ts`, `public/scss/kiosk.bundle.scss`) are built by `bench build` with esbuild, as in any Frappe app. `bench build` also runs `yarn build`, so the old Vue tracker is built with it. Run `bench build` from the bench you serve the site from: inside the app folder, `bench` is the app's own dev bench.

## Where things live

- `employee_timeclock/kiosk.py`: the Timeclock Kiosk role check, badge resolution (badge tokens and RFID tags) and the Issue/Revoke Badge methods.
- `employee_timeclock/auth.py`: the key the kiosks' badge JWTs are signed with (the site's `encryption_key`).
- `employee_timeclock/timeclock/api.py`: the Employee Checkin and Workday sync hooks, and the web form's `submit_checkin`.
- `employee_timeclock/timeclock/doctype/workday/`: the Workday DocType, its list view's Bulk Add and `bulk_add_punches`.
- `employee_timeclock/timeclock/report/workday_management/`: the Workday Management report and its punch-editing methods.
- `employee_timeclock/timeclock/web_form/employee_timelog/`: the Employee Clock-in/out web form (`/employee-timeclock`).
- `employee_timeclock/www/timeclock/`: the badge kiosk (`/timeclock`), a React + Carbon app in `src/` whose `punch` endpoint is in `__init__.py`. `public/js/timeclock.bundle.ts` is only its esbuild entry. The offline punch queue is in `src/`: `usePunchSync.ts` keeps punches in IndexedDB and sends them to `sync_punches`.
- `employee_timeclock/public/js/kiosk/`: what the kiosk pages share (mounting inside `frappe-react-sdk`'s `FrappeProvider`, the toolbar, the session timer, toasts, backend calls through the SDK, the badge scanner, the offline queue's sync loop, and `clock.ts`, the server's clock), and `public/js/kiosk-sw.js`, their service worker, which keeps the app's page so it opens offline.
- Every punch from the new kiosk carries its own id (`kiosk_punch_id` on Employee Checkin), so a retry or a synced offline punch is recorded once. `/timeclock?probe=nfc` is a temporary page showing what the tablet's NFC reads from a badge.
- `employee_timeclock/kiosk_pwa.py`: makes each kiosk page an installable app: its manifest, icons (`public/images/kiosk/`, drawn by `tools/build_kiosk_icons.py`) and service worker, served at `/<page>/manifest.webmanifest` and `/<page>/sw.js`. Browsers only install it, and only run the worker, on HTTPS or `localhost`.
- `employee_timeclock/www/job_timeclock/`: the job time tracker (`/job_timeclock`), a React + Carbon app in `src/`, with its backend in `job_timeclock.py` and `models.py`. `public/js/job-timeclock.bundle.ts` is only its esbuild entry. `src/types.ts` is generated from `models.py` by `generate-types`.
- The tracker reads through `useFrappeGetCall` (`useTrackerData` in `src/useEmployee.ts`), so SWR refetches it when the page comes back into view, and listens for machine timers with `useFrappeEventListener`. Reads go by POST and with a fixed cache key, because the badge token changes with each answer and shouldn't be in a URL.
- Offline, the tracker keeps a snapshot of the work (`get_offline_snapshot`) and queues timer events in IndexedDB (`src/offline.ts`). `replay` shows them on top of the last server state, and `useTimerSync` sends them to `sync_timer_events`. Each event has its own id (`kiosk_start_id` and `kiosk_stop_id` on Job Card Time Log), so it is recorded once. A synced event only closes logs that had started by its time, and a start nothing stopped ends where the next log begins. Rejected events go to the Error Log. Tablets can't see each other's offline timers until they sync, and events over a week old are rejected.
- `employee_timeclock/www/job_timeclock_vue/` and `public/js/job_timeclock/`: the old Vue tracker (`/job_timeclock_vue`), kept beside the new one while it is tried out. It is built by Vite, and is the only reason the app still has Vite, Vue, Tailwind and frappe-ui.
- `employee_timeclock/timeclock/custom/`: the custom fields on Employee, Employee Checkin, Job Card, Job Card Time Log and Operation, and the `TimeclockJobCard` class extension.
- `employee_timeclock/public/dist/`: the build output. It is generated and not committed.
- `marketplace/`: the marketplace listing and the screenshot spec.

## The rename shim

The app was called `timeclock` before it was renamed to `employee_timeclock`. The block between `frappe-nix:rename-shim-begin` and `frappe-nix:rename-shim-end` in `hooks.py` maps the old dotted paths of the whitelisted methods to the new ones, for cached bundles and bookmarks that still use them. Keep it for at least one minor release after the rename.
