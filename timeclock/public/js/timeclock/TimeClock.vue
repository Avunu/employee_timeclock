<template>
  <div class="static h-screen flex z-0">
    <header class="z-10 block rounded-lg bg-gray-300 fixed w-screen">
      <div
        class="z-100 mx-auto px-4 py-6 lg:px-8 flex h-center items-center justify-between"
      >
        <!-- Job Timeclock Header -->
        <button
          class="flex justify-center text-4xl font-bold tracking-tight text-white-300"
          @click="refresh_page"
        >
          {{ header }}
        </button>
      </div>
    </header>

    <main
      class="z-0 flex w-full overflow-hidden my-16 pt-16"
      v-if="activeSession"
    >
      <!-- When session is active -->

      <transition name="job_card_list"> </transition>
    </main>

    <!-- <main v-else: class="bg-white fixed w-auto top-100 z-50 h-24"> -->
    <main v-else: class="w-full h-screen">
      <!-- When session is inactive -->
      <AuthorizationMessage />
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, watch } from "vue";
import { useStorage } from "@vueuse/core";
import { jwtDecode } from "jwt-decode";
import onScan from "onscan.js";
import { frappeCall } from "../FrappeCall";

// import sub components
import AuthorizationMessage from "./components/AuthorizationMessage.vue";
import { Employee } from "./types/Employee.js";

//  Toastification is a simple system to make toast notifications.
import { useToast } from "vue-toastification";

const toast = useToast();

export default defineComponent({
  name: "JobTimeClock",
  components: {
    AuthorizationMessage,
  },
  data(): {
    employeeId: string;
    employeeName: string;
    header: string;
    token: string | null;
    tokenExpiration: number;
    employeeLoggedIn: Boolean;
    employees: Employee[];
  } {
    return {
      employeeId: "",
      employeeName: "",
      header: "Clock In",
      token: useStorage<string | null>("token", null)!,
      tokenExpiration: 0,
    };
  },

  methods: {
    async authenticateEmployee(sCode: string) {
      this.token = null;
      this.tokenExpiration = 0;
      this.employeeId = "";
      this.employeeName = "";

      const response = await FrappeCall(
        "timeclock.www.job_timeclock.authenticate_employee",
        { rfid: sCode },
      );

      if (response?.status === "success") {
        this.token = response.token;
        if (response.last_checkin === "OUT") {
          this.log_employee_in(this.token);
        } else if (response.last_checkin === "IN") {
          this.log_employee_out(this.token);
        } else {
          console.log("Else");
          this.log_employee_in(this.token);
        }
      } else {
        console.log("Sorry! You are not authenticated.");
        // console.log(response.message)
        this.token = null;
        this.tokenExpiration = 0;
      }
    },

    // This is triggered by a watch command. Anytime Token changes, this function is run.
    async decodeToken() {
      const tokenData: any = jwtDecode(this.token);
      this.tokenExpiration = tokenData.exp * 1000;
      this.employeeId = tokenData.employee_id;
      this.employeeName = tokenData.employee_name;
      // console.log("Hurrah! You are authenticated as ", tokenData.employee_name);

      // Every time Token is refreshed, timer restarts.
      // const currentTime = Date.now();
      // const timeout = (this.tokenExpiration - currentTime);
      // this.resetTimer(timeout);
    },

    startTimer(timeout: number) {
      const timeoutId = setTimeout(this.endTimer, timeout);
    },

    endTimer() {
      this.token = null;
      this.tokenExpiration = 0;
      this.employeeId = "";
      this.employeeName = "";
    },

    resetTimer(timeout: number) {
      clearTimeout(this.timeoutId);
      this.startTimer(timeout);
    },

    async log_employee_in(token: string) {
      // Calculate current time to log in.
      this.date = new Date();
      const year = this.date.getUTCFullYear();
      const month = this.date.getUTCMonth() + 1; // Months are zero-based
      const day = this.date.getUTCDate();
      const hour = this.date.getUTCHours();
      const minute = this.date.getUTCMinutes();
      const second = this.date.getUTCSeconds();
      const pad = (num: number) => (num < 10 ? "0" + num : num);
      const current_time = `${year}-${pad(month)}-${pad(day)} ${pad(hour - 5)}:${pad(minute)}`;
      // console.log(current_time);

      // Log Call
      const response = await FrappeCall(
        "timeclock.www.job_timeclock.log_in_employee",
        { token: token, time: current_time },
      );

      if (response?.status === "success") {
        console.log("You are now logged in.");
        toast.success(`${this.employeeName} has punched in.`);
        this.token = null;
        this.tokenExpiration = 0;
        this.employeeId = "";
        this.employeeName = "";
      } else {
        console.log("did not work. You are still logged out:");
        toast.error(`${this.employeeName} was unsuccessfully logged in.`);
        this.token = null;
        this.tokenExpiration = 0;
        this.employeeId = "";
        this.employeeName = "";
        // console.log(response.log)
      }
    },

    async log_employee_out(token) {
      // Calculate current time to log in.
      const date = new Date();
      const year = date.getUTCFullYear();
      const month = date.getUTCMonth() + 1; // Months are zero-based
      const day = date.getUTCDate();
      const hour = date.getUTCHours();
      const minute = date.getUTCMinutes();
      const second = date.getUTCSeconds();
      const pad = (num: number) => (num < 10 ? "0" + num : num);
      const current_time = `${year}-${pad(month)}-${pad(day)} ${pad(hour - 5)}:${pad(minute)}`;
      // console.log(current_time);

      // Log Call
      const response = await FrappeCall(
        "timeclock.www.job_timeclock.log_out_employee",
        { token: token, time: current_time },
      );

      if (response?.status === "success") {
        toast.success(`${this.employeeName} has punched out.`);
        console.log("You are now logged out.", response.log);
        this.token = null;
        this.tokenExpiration = 0;
        this.employeeId = "";
        this.employeeName = "";
      } else {
        toast.error(`${this.employeeName} was not properly signed out.`);
        console.log("Did not work. You are still logged in:", response.log);
        this.token = null;
        this.tokenExpiration = 0;
        this.employeeId = "";
        this.employeeName = "";
      }
    },

    get_token_from_employee(employee: Employee) {
      // console.log(employee)
      this.authenticateEmployee(employee.sCode);
    },

    // For 'Job Timeclock' refresh button on click.
    refresh_page() {
      window.location.reload();
      console.log("Page reloaded.");
    },
  },

  mounted() {
    // This is to be used with scan.
    console.log("timeclock initialized.");
    const scanner = onScan.attachTo(document, {
      onScan: this.authenticateEmployee,
      ignoreIfFocusOn: ".frappe-input",
    });

    this.scanner = scanner;
    // this.scanner.simulate(document, '1234512345');

    watch(
      () => this.token,
      (newToken) => {
        // If you don't do this, it will refresh every time you switch work orders.
        // console.log('watching.')
        if (newToken !== this.token) {
          this.decodeToken();
        } else if (newToken) {
          this.decodeToken();
        } else {
          // console.log('Token is the same.')
        }
      },
      { immediate: true },
    );
  },
});
</script>

<style scoped>
.job_card_list-enter-active,
.job_card_list-leave-active {
  transition: opacity 1s ease-out;
}

.job_card_list-enter-from,
.job_card_list-leave-to {
  opacity: 0;
}

.Vue-Toastification__toast--default.custom_default {
  background-color: rgb(15, 255, 35);
}

/* Applied to the toast body when using regular strings as content */
.Vue-Toastification__toast-body.custom-class-1 {
  font-size: 30px;
}

/* Applied to a wrapper div when using a custom component as content */
.Vue-Toastification__toast-component-body.custom-class-2 {
  width: 100%;
}
</style>
