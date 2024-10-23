// import css
import "./timeclock.css";

// import vue
import { createApp } from "vue";

// create vue app
import TimeClock from "./TimeClock.vue";

// Import toastification for notifications
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css';

//  Import frappe
import { FrappeUI } from "frappe-ui";

let app = createApp(TimeClock);
app.use(Toast);
app.use(FrappeUI);
app.mount("#app");

