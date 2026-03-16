<template>
  <div class="flex flex-col h-screen">
    <header class="rounded-lg bg-gray-300 w-full shrink-0">
      <div
        class="z-100 mx-auto px-4 py-6 lg:px-8 flex h-center items-center justify-between"
      >
        <!-- Job Timeclock Header -->
        <button
          class="text-4xl font-bold tracking-tight text-gray-900"
          @click="refresh_page"
        >
          {{ header }}
        </button>

        <!-- Clock out -->
        <!--<button class="bg-teal-300 hover:bg-teal-400 text-white font-normal lg:text-3xl py-4 px-8 rounded ring-2 ring-offset-1 ring-gray-100" -->
        <!-- v-if="activeSession" @click="log_out_employee(token)">Clock Out</button>-->

        <!-- Active Timer Indicator -->
        <div
          v-if="activeSession && activeTimer"
          class="flex items-center gap-2"
        >
          <div
            class="flex items-center gap-3 rounded-lg px-4 py-2 ring-2 cursor-pointer"
            :class="
              activeTimer.is_corrective
                ? 'ring-orange-500 bg-orange-50 hover:bg-orange-100'
                : 'ring-green-500 bg-green-50 hover:bg-green-100'
            "
            @click="navigateToActiveTimer"
          >
            <span
              class="font-semibold text-lg lg:text-2xl truncate"
              :class="
                activeTimer.is_corrective ? 'text-orange-700' : 'text-green-700'
              "
            >
              {{ activeTimer.operation }}
            </span>
            <span
              class="font-mono text-xl lg:text-2xl font-bold"
              :class="
                activeTimer.is_corrective ? 'text-orange-800' : 'text-green-800'
              "
            >
              {{ headerElapsedTime }}
            </span>
            <span
              v-if="activeTimer.is_corrective"
              class="text-orange-600 text-sm font-semibold"
            >
              REWORK
            </span>
          </div>
          <!-- Quick Stop Button -->
          <button
            class="p-3 rounded-lg transition-colors"
            :class="
              activeTimer.is_corrective
                ? 'bg-orange-100 hover:bg-orange-200 text-orange-700'
                : 'bg-green-100 hover:bg-green-200 text-green-700'
            "
            :title="activeTimer.is_corrective ? 'Stop Rework' : 'Stop Timer'"
            @click="
              activeTimer.is_corrective
                ? handleStopRework(activeTimer.operation)
                : handleStopTask(activeTimer.operation)
            "
          >
            <div class="w-7 h-7 rounded-sm bg-current" />
          </button>
        </div>

        <SessionTimer
          :employeeName="employeeName"
          :tokenExpiration="tokenExpiration"
          v-if="activeSession"
        />
        <!-- Sign Out Icon Button -->
        <button
          v-if="activeSession"
          @click="switchEmployee"
          class="p-3 rounded-lg hover:bg-gray-200 transition-colors"
          title="Sign Out"
        >
          <IconLogOut class="w-8 h-8 text-gray-700" />
        </button>
        <!-- Settings Icon Button -->
        <button
          v-if="activeSession"
          @click="isSidebarOpen = true"
          class="p-3 rounded-lg hover:bg-gray-200 transition-colors"
          title="Settings"
        >
          <IconSettings class="w-8 h-8 text-gray-700" />
        </button>
      </div>
    </header>

    <!-- Settings Sidebar -->
    <transition name="sidebar">
      <div
        v-if="isSidebarOpen && activeSession"
        class="fixed inset-0 z-50 flex justify-end"
        @click.self="isSidebarOpen = false"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black bg-opacity-50"
          @click="isSidebarOpen = false"
        ></div>

        <!-- Sidebar Content -->
        <div class="relative w-80 h-full bg-white shadow-2xl flex flex-col">
          <!-- Sidebar Header -->
          <div class="flex items-center justify-between p-6 border-b">
            <h2 class="text-2xl font-bold text-gray-900">Settings</h2>
            <button
              @click="isSidebarOpen = false"
              class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg
                class="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          <!-- Sidebar Body -->
          <div class="flex-1 overflow-y-auto p-6">
            <div class="space-y-6">
              <div>
                <h3 class="text-lg font-semibold text-gray-700 mb-3">
                  Workstations
                </h3>
                <div v-if="availableWorkstations.length" class="space-y-2">
                  <div
                    v-for="ws in availableWorkstations"
                    :key="ws"
                    class="w-full"
                  >
                    <Checkbox
                      :label="ws"
                      :modelValue="workstations.includes(ws)"
                      @update:modelValue="toggleWorkstation(ws, $event)"
                    />
                  </div>
                </div>
                <p v-else class="text-sm text-gray-500">Loading…</p>
              </div>
            </div>
          </div>

          <!-- Sidebar Footer: Device Info -->
          <div
            class="border-t p-4 bg-gray-50 text-xs text-gray-500 space-y-1 font-mono"
          >
            <div class="flex justify-between">
              <span class="font-semibold text-gray-600">IP</span>
              <span>{{ deviceIp || "—" }}</span>
            </div>
            <div class="flex justify-between">
              <span class="font-semibold text-gray-600">MAC</span>
              <span>{{ deviceMac || "—" }}</span>
            </div>
          </div>
        </div>
      </div>
    </transition>

    <main
      class="flex flex-1 w-full overflow-hidden min-h-0"
      v-if="activeSession"
    >
      <!-- When session is active -->
      <!-- Work Orders Section -->
      <WorkOrderList
        class="z-0"
        :workOrders="workOrders"
        :selectedWorkOrder="selectedWorkOrder"
        :activeWorkOrder="activeTimer?.work_order ?? null"
        :activeTimerIsCorrective="activeTimer?.is_corrective ?? false"
        @select="selectWorkOrder"
      />
      <!-- Job Cards Section -->
      <transition name="job_card_list">
        <JobCardList
          class="z-0"
          name="job_cards_comp"
          :operations="operations"
          :activeTimer="activeTimer"
          :workstations="workstations"
          v-if="selectedWorkOrder"
          :workOrder="selectedWorkOrder!.name"
          @start-task="handleStartTask"
          @stop-task="handleStopTask"
          @start-rework="handleStartRework"
          @stop-rework="handleStopRework"
        />
      </transition>
    </main>

    <!-- <main v-else: class="bg-white fixed w-auto top-100 z-50 h-24"> -->
    <main v-else: class="flex-1 w-full">
      <!-- When session is inactive -->
      <AuthorizationMessage />
    </main>

    <Toasts />
  </div>
</template>

<script lang="ts">
import { defineComponent, provide, watch, computed } from "vue";
import { useStorage } from "@vueuse/core";
import { jwtDecode } from "jwt-decode";
import onScan from "onscan.js";
import { api } from "./client";

// Extend Window interface for TypeScript
declare global {
  interface Window {
    onScanAttached?: boolean;
    onScan?: typeof onScan;
  }
}

// import sub components
import AuthorizationMessage from "./components/AuthorizationMessage.vue";
import SessionTimer from "./components/SessionTimer.vue";
import WorkOrderList from "./components/WorkOrderList.vue";
import JobCardList from "./components/JobCardList.vue";
import Button from "./components/Button.vue";
import { Checkbox, toast, Toast, Sidebar } from "frappe-ui";
import IconSettings from "~icons/lucide/settings";
import IconLogOut from "~icons/lucide/log-out";

import { dateToFrappeDateTimeString } from "./utils";
import type { Employee, WorkOrder, Operation, ActiveTimer } from "./types";

export default defineComponent({
  name: "JobTimeTracker",
  components: {
    AuthorizationMessage,
    Button,
    JobCardList,
    SessionTimer,
    Toast,
    WorkOrderList,
    Checkbox,
    Sidebar,
    IconSettings,
    IconLogOut,
  },
  data(): {
    activeTimer: ActiveTimer | null;
    activeSession: boolean;
    employeeId: string;
    employeeLoggedIn: boolean;
    employeeName: string;
    header: string;
    headerElapsedTime: string;
    headerTimerInterval: ReturnType<typeof setInterval> | null;
    isSidebarOpen: boolean;
    operations: Operation[];
    selectedWorkOrder: WorkOrder | null;
    showAuthMessage: boolean;
    timeoutId: number | undefined;
    token: string | null;
    tokenExpiration: number;
    workOrders: WorkOrder[];
    workstations: string[];
    availableWorkstations: string[];
    deviceIp: string;
    deviceMac: string;
  } {
    return {
      activeTimer: null,
      activeSession: false,
      employeeId: "",
      employeeLoggedIn: false,
      employeeName: "",
      header: "Project Tracker",
      headerElapsedTime: "00:00:00",
      headerTimerInterval: null,
      isSidebarOpen: false,
      operations: [],
      selectedWorkOrder: null,
      showAuthMessage: false,
      timeoutId: undefined,
      token: useStorage<string | null>("token", null).value,
      tokenExpiration: 0,
      workOrders: [],
      workstations: useStorage<string[]>("workstations", []).value,
      availableWorkstations: [],
      deviceIp: "",
      deviceMac: "",
    };
  },

  computed: {},

  // computed: {
  //     sorted_jobCards(){
  //         const cards = this.jobCards
  //         cards.sort((a) =>{
  //             const valueA = a["operation"];
  //             const valueB = b[this.sortValue];
  //             if (valueA < valueB) return -1;
  //             if (valueA > valueB) return 1;
  //             return 0;
  //         });
  //     }
  // },

  methods: {
    async check_for_erp_log_in() {
      const erpLogInStatus = await api.userSessionEmployee();
      if (erpLogInStatus.user_id !== "Guest" && erpLogInStatus.employee_id) {
        // Session auth — activate directly without NFC/token
        this.employeeId = erpLogInStatus.employee_id;
        this.employeeName = erpLogInStatus.employee_name ?? "";
        this.activeSession = true;
        this.token = null;
        this.getWorkOrders();
        this.getActiveTimer();
        this.fetchWorkstations();
        console.log("Session authenticated as", erpLogInStatus.employee_name);
      } else {
        console.log("No session employee — waiting for NFC scan");
      }
    },

    async authenticateEmployee(sCode: string) {
      this.token = null;
      this.tokenExpiration = 0;
      this.activeTimer = null;
      this.operations = [];
      this.selectedWorkOrder = null;
      this.workOrders = [];
      this.employeeId = "";
      this.employeeName = "";

      const response = await api.authenticateEmployee(sCode);

      if (response.status === "success" && response.token) {
        this.token = response.token;
        this.activeSession = true;
        this.getWorkOrders();
        this.getActiveTimer();
        this.fetchWorkstations();
      } else {
        console.log("Sorry! You are not authenticated.");
        console.log(response.message);
        this.activeSession = false;
        this.setSessionFalse;
        this.token = null;
        this.tokenExpiration = 0;
        this.operations = [];
        this.selectedWorkOrder = null;
        this.workOrders = [];
        this.employeeId = "";
        this.employeeName = "";
      }
    },

    async decodeToken() {
      const tokenData: any = jwtDecode(String(this.token));
      this.tokenExpiration = tokenData.exp * 1000;
      this.employeeId = tokenData.employee_id;
      this.employeeName = tokenData.employee_name;
      console.log("Hurrah! You are authenticated as ", tokenData.employee_name);

      // Every time Token is refreshed, timer restarts.
      const currentTime = Date.now();
      const timeout = this.tokenExpiration - currentTime;
      this.resetTimer(timeout);
    },

    async getWorkOrders() {
      const response = await api.getWorkOrders(this.token);

      if (response.status === "success" && response.work_orders) {
        if (response.token) this.token = response.token;
        this.workOrders = response.work_orders;
      } else {
        this.workOrders = [];
        this.activeSession = false;
      }
    },

    selectWorkOrder(workOrder: WorkOrder | null) {
      // debug
      console.debug("Selecting work order:", workOrder);
      this.selectedWorkOrder = workOrder;
      if (workOrder) {
        this.getOperations(workOrder.name);
      }
    },

    async navigateToActiveTimer() {
      if (!this.activeTimer) return;

      // Find the work order matching the active timer
      const targetWO = this.workOrders.find(
        (wo) => wo.name === this.activeTimer!.work_order,
      );
      if (!targetWO) return;

      // Select the work order (loads operations)
      this.selectedWorkOrder = targetWO;
      await this.getOperations(targetWO.name);

      // Wait for DOM to update, then scroll to the work order and job card
      this.$nextTick(() => {
        // Scroll work order into view
        const woEl = document.querySelector(
          `[data-work-order="${this.activeTimer!.work_order}"]`,
        );
        if (woEl) {
          woEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }

        // Scroll job card into view
        const jcEl = document.querySelector(
          `[data-operation="${this.activeTimer!.operation}"]`,
        );
        if (jcEl) {
          jcEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      });
    },

    async getOperations(workOrderName: string) {
      const response = await api.getOperations(
        workOrderName,
        JSON.stringify(this.workstations),
        this.token,
      );
      if (response.status === "success" && response.operations) {
        if (response.token) this.token = response.token;
        this.operations = response.operations;
      } else {
        this.operations = [];
        this.activeSession = false;
      }
    },

    async getActiveTimer() {
      const response = await api.getActiveTimer(this.token);
      if (response.status === "success") {
        if (response.token) this.token = response.token;
        this.activeTimer = response.active_timer ?? null;
      }
    },

    async handleStartTask(operationName: string) {
      // If rework is running on the same operation, stop it first
      if (
        this.activeTimer?.is_corrective &&
        this.activeTimer?.operation === operationName &&
        this.activeTimer?.work_order === this.selectedWorkOrder?.name
      ) {
        await this.handleStopRework(operationName);
      }

      const startTime = new Date();
      const startTimeFrappe = dateToFrappeDateTimeString(startTime, 5);

      const response = await api.startTimer(
        this.selectedWorkOrder!.name,
        operationName,
        startTimeFrappe,
        false,
        this.token,
      );

      if (response.status === "success") {
        this.activeTimer = {
          work_order: this.selectedWorkOrder!.name,
          operation: operationName,
          from_time: startTimeFrappe,
          is_corrective: false,
        };
      } else {
        toast.error(`${operationName} failed to start.`);
        console.error("start_timer failed:", response.error);
      }
    },

    async handleStopTask(operationName: string) {
      const endTime = new Date();
      const endTimeFrappe = dateToFrappeDateTimeString(endTime, 5);

      const response = await api.stopTimer(endTimeFrappe, this.token);

      if (response.status === "success") {
        this.activeTimer = null;
        if (this.selectedWorkOrder) {
          await this.getOperations(this.selectedWorkOrder.name);
        }
      } else {
        toast.error(`${operationName} failed to stop.`);
        console.error("stop_timer failed:", response.error);
      }
    },

    async handleStartRework(operationName: string) {
      // If regular timer is running on the same operation, stop it first
      if (
        this.activeTimer &&
        !this.activeTimer.is_corrective &&
        this.activeTimer.operation === operationName &&
        this.activeTimer.work_order === this.selectedWorkOrder?.name
      ) {
        await this.handleStopTask(operationName);
      }

      const startTime = new Date();
      const startTimeFrappe = dateToFrappeDateTimeString(startTime, 5);

      const response = await api.startTimer(
        this.selectedWorkOrder!.name,
        operationName,
        startTimeFrappe,
        true,
        this.token,
      );

      if (response.status === "success") {
        this.activeTimer = {
          work_order: this.selectedWorkOrder!.name,
          operation: operationName,
          from_time: startTimeFrappe,
          is_corrective: true,
        };
        toast.success(`Rework started for ${operationName}.`);
      } else {
        toast.error(`${operationName} rework failed to start.`);
        console.error("start_timer (corrective) failed:", response.error);
      }
    },

    async handleStopRework(operationName: string) {
      const endTime = new Date();
      const endTimeFrappe = dateToFrappeDateTimeString(endTime, 5);

      const response = await api.stopTimer(endTimeFrappe, this.token);

      if (response.status === "success") {
        this.activeTimer = null;
        toast.success(`Rework completed for ${operationName}.`);
        if (this.selectedWorkOrder) {
          await this.getOperations(this.selectedWorkOrder.name);
        }
      } else {
        toast.error(`${operationName} rework failed to stop.`);
        console.error("stop_timer (corrective) failed:", response.error);
      }
    },

    // These functions are to turn off the session once it is done.
    setSessionFalse() {
      this.activeSession = false;
      console.log("Logged out of Job Time Clock Session");
    },

    startTimer(timeout: number) {
      this.timeoutId = window.setTimeout(this.endTimer, timeout);
    },

    endTimer() {
      this.setSessionFalse;
      this.activeSession = false;
      this.activeTimer = null;
      this.token = null;
      this.tokenExpiration = 0;
      this.operations = [];
      this.selectedWorkOrder = null;
      this.workOrders = [];
      this.employeeId = "";
      this.employeeName = "";
    },

    resetTimer(timeout: number) {
      clearTimeout(this.timeoutId);
      this.startTimer(timeout);
    },

    async log_employee_in() {
      const current_time = dateToFrappeDateTimeString(new Date());

      const response = await api.logInEmployee(current_time, this.token);

      if (response.status === "success") {
        console.log("You are now logged in.");
      } else {
        console.log("Clock-in failed:", response.message);
      }
    },

    switchEmployee() {
      toast.success(`${this.employeeName} switched user.`);

      this.activeSession = false;
      this.activeTimer = null;
      this.token = null;
      this.tokenExpiration = 0;
      this.operations = [];
      this.selectedWorkOrder = null;
      this.workOrders = [];
      this.employeeId = "";
      this.employeeName = "";

      this.employeeLoggedIn = false;
    },

    async log_out_employee() {
      const current_time = dateToFrappeDateTimeString(new Date());

      const response = await api.logOutEmployee(current_time, this.token);

      if (response.status === "success") {
        toast.success(`${this.employeeName} has punched out.`);
        console.log("You are now logged out.", response.log);
        this.activeSession = false;
        this.token = null;
        this.tokenExpiration = 0;
        this.operations = [];
        this.selectedWorkOrder = null;
        this.workOrders = [];
        this.employeeId = "";
        this.employeeName = "";
      } else {
        toast.error(`${this.employeeName} was not properly signed out.`);
        console.log("Clock-out failed:", response.message);
      }
    },

    get_token_from_employee(employee: Employee) {
      // console.log(employee)
      this.authenticateEmployee(employee.sCode);
    },

    // To receive send_login Emit from StartScreen.vue
    receive_login(sCode: string) {
      console.log("Receive login succeeded: ", sCode);
      this.authenticateEmployee(sCode);
    },

    // For 'Job Timeclock' refresh button on click.
    refresh_page() {
      window.location.reload();
      console.log("Page reloaded.");
    },

    toggleWorkstation(ws: string, checked: boolean): void {
      if (checked) {
        if (!this.workstations.includes(ws)) {
          this.workstations = [...this.workstations, ws];
        }
      } else {
        this.workstations = this.workstations.filter((w) => w !== ws);
      }
      useStorage<string[]>("workstations", []).value = this.workstations;
    },

    async fetchWorkstations(): Promise<void> {
      try {
        const response = await api.getWorkstations();
        if (response.status === "success" && response.workstations) {
          this.availableWorkstations = response.workstations;
        }
      } catch (error) {
        console.error("Failed to fetch workstations:", error);
      }
    },

    async getDeviceInfo(): Promise<void> {
      try {
        const response = await api.getDeviceInfo();
        if (response.status === "success") {
          this.deviceIp = response.ip;
          this.deviceMac = response.mac;
        }
      } catch (error) {
        console.error("Failed to fetch device info:", error);
      }
    },
  },

  mounted() {
    // check_for_erp_log_in will activate the session if there is an ERP
    // user with a linked Employee.  If the user also has a stale token in
    // localStorage the session-auth path takes priority (token is cleared).
    this.check_for_erp_log_in().then(() => {
      // Only restore from token if session auth did not already activate
      if (!this.activeSession && this.token) {
        this.activeSession = true;
        this.getWorkOrders();
        this.getActiveTimer();
        this.fetchWorkstations();
      }
    });

    // Attach onScan to document for barcode scanning
    // attachTo returns void, so we just call it and track attachment state
    onScan.attachTo(document, {
      onScan: this.authenticateEmployee,
    });

    // Track that onScan is attached (useful for cleanup)
    window.onScanAttached = true;
    // Attach onScan to window for global access (useful for debugging)
    window.onScan = onScan;

    watch(
      () => this.token,
      (newToken, oldToken) => {
        if (!newToken) return;
        // Always update the expiration/timer so the session clock reflects refreshed tokens
        const tokenData: any = jwtDecode(String(newToken));
        this.tokenExpiration = tokenData.exp * 1000;
        this.resetTimer(this.tokenExpiration - Date.now());
        // Only do a full decode (set employee info + log) on fresh login
        if (!oldToken) {
          this.decodeToken();
        }
      },
      { immediate: true },
    );

    // Keep the header elapsed timer in sync with activeTimer
    watch(
      () => this.activeTimer,
      (timer) => {
        if (this.headerTimerInterval) {
          clearInterval(this.headerTimerInterval);
          this.headerTimerInterval = null;
        }
        if (timer?.from_time) {
          const tick = () => {
            const start = new Date(timer.from_time).getTime();
            const diff = Math.floor((Date.now() - start) / 1000);
            const h = String(Math.floor(diff / 3600)).padStart(2, "0");
            const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
            const s = String(diff % 60).padStart(2, "0");
            this.headerElapsedTime = `${h}:${m}:${s}`;
          };
          tick();
          this.headerTimerInterval = setInterval(tick, 1000);
        } else {
          this.headerElapsedTime = "00:00:00";
        }
      },
      { immediate: true },
    );
  },

  beforeUnmount() {
    // Clean up header timer interval
    if (this.headerTimerInterval) {
      clearInterval(this.headerTimerInterval);
      this.headerTimerInterval = null;
    }
    // Clean up onScan listener when component is destroyed
    if (window.onScanAttached) {
      onScan.detachFrom(document);
      window.onScanAttached = false;
    }
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

.sidebar-enter-active,
.sidebar-leave-active {
  transition: opacity 0.3s ease;
}

.sidebar-enter-active > div:last-child,
.sidebar-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.sidebar-enter-from,
.sidebar-leave-to {
  opacity: 0;
}

.sidebar-enter-from > div:last-child,
.sidebar-leave-to > div:last-child {
  transform: translateX(100%);
}
</style>
