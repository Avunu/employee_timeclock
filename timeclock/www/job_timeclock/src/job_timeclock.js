// import css
import "./job_timeclock.css";

// import vue
import { createApp } from "vue";

// create vue app
import JobTimeClock from "./JobTimeClock.vue";

let app = createApp(JobTimeClock);
app.mount("#app");
