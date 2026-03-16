// import css
import "./job_time_tracker.css";

// import vue
import { createApp } from "vue";
import type { App } from "vue";

// create vue app
import JobTimeTracker from "./JobTimeTracker.vue";

// Import frappe
import { FrappeUI } from "frappe-ui";

const app: App = createApp(JobTimeTracker);
app.use(FrappeUI);
app.mount("#app");

