// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

// import css
import "./timeclock.css";

// import vue
import { createApp } from "vue";
import type { App } from "vue";

// create vue app
import TimeClock from "./TimeClock.vue";

// Import toastification for notifications
import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";


const app: App = createApp(TimeClock);
app.use(Toast);
app.mount("#app");
