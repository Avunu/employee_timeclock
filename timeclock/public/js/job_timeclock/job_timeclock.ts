// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

// import css
import "./job_timeclock.css";

// import vue
import { createApp } from "vue";
import type { App } from "vue";

// create vue app
import ProjectTracker from "./JobTimeclock.vue";

// Import frappe
import { FrappeUI } from "frappe-ui";

const app: App = createApp(ProjectTracker);
app.use(FrappeUI);
app.mount("#app");
