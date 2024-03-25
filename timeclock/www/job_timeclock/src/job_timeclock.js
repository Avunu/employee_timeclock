// import css
import "./job_timeclock.css";

// import vue
import { createApp } from "vue";

// create vue app
import JobTimeClock from "./JobTimeClock.vue";

// Import toastification for notifications
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

let app = createApp(JobTimeClock);
app.use(Toast);
app.mount("#app");

