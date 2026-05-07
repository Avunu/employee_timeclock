// import css
import "./project_tracker.css";

// import vue
import { createApp } from "vue";
import type { App } from "vue";

// create vue app
import ProjectTracker from "./ProjectTracker.vue";

// Import frappe
import { FrappeUI } from "frappe-ui";

const app: App = createApp(ProjectTracker);
app.use(FrappeUI);
app.mount("#app");
