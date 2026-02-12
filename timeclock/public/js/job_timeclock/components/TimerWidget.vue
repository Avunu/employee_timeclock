<template>
  <div>
    <div class="flex gap-4 justify-end">
      <!-- Regular Timer Section -->
      <div
        class="flex flex-col items-center border border-gray-300 rounded-lg p-3 bg-gray-50"
      >
        <button
          class="bg-green-400 text-white font-normal text-lg lg:text-xl focus:bg-green-200 rounded-md px-4 py-3 lg:px-6 lg:py-4"
          @click="startTask"
          v-if="taskStarted === false && !operation.is_submitted"
        >
          Start Timer
        </button>
        <span
          class="text-gray-400 font-normal text-lg lg:text-xl px-4 py-3 lg:px-6 lg:py-4 italic"
          v-if="!taskStarted && operation.is_submitted"
        >
          Submitted
        </span>
        <button
          class="bg-red-400 text-white font-normal text-lg lg:text-xl focus:bg-red-200 rounded-md px-4 py-3 lg:px-6 lg:py-4"
          @click="stopTask"
          v-if="taskStarted"
        >
          Stop Timer
        </button>
        <p class="text-gray-700 text-md font-family-sans mt-2">
          {{ elapsedTime }}
        </p>
        <p
          class="text-gray-400 text-xs mt-1"
          v-if="operation.employee_time_mins > 0"
        >
          Your total: {{ formatMins(operation.employee_time_mins) }}
        </p>
      </div>
      <!-- Rework Timer Section -->
      <div
        class="flex flex-col items-center border border-orange-300 rounded-lg p-3 bg-orange-50"
      >
        <button
          class="bg-orange-500 text-white font-normal text-lg lg:text-xl focus:bg-orange-300 rounded-md px-4 py-3 lg:px-6 lg:py-4"
          @click="startRework"
          v-if="reworkStarted === false"
        >
          Start Rework
        </button>
        <button
          class="bg-orange-700 text-white font-normal text-lg lg:text-xl focus:bg-orange-400 rounded-md px-4 py-3 lg:px-6 lg:py-4"
          @click="stopRework"
          v-if="reworkStarted"
        >
          Stop Rework
        </button>
        <p class="text-orange-600 text-md font-family-sans font-bold mt-2">
          {{ reworkElapsedTime }}
        </p>
        <p
          class="text-orange-400 text-xs mt-1"
          v-if="operation.corrective_employee_time_mins > 0"
        >
          Your total: {{ formatMins(operation.corrective_employee_time_mins) }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import type { PropType } from "vue";
import type { Operation, ActiveTimer } from "../types/JobCard";
import type { FrappeDateTimeString } from "../types/FrappeDateTime";
import { dateToFrappeDateTimeString } from "../types/FrappeDateTime";
import { frappeCall } from "../../FrappeCall";
import { useToast } from "vue-toastification";
import type { StartTimerResponse, StopTimerResponse } from "../types/api";
const toast = useToast();

export default defineComponent({
  name: "TimerWidget",

  data(): {
    elapsedTime: string;
    interval: ReturnType<typeof setInterval> | null;
    reworkElapsedTime: string;
    reworkInterval: ReturnType<typeof setInterval> | null;
    reworkStarted: boolean;
    reworkStartTime: Date;
    startTime: Date;
    taskStarted: boolean;
    timerStarted: boolean;
  } {
    return {
      elapsedTime: "00:00:00",
      interval: null,
      reworkElapsedTime: "00:00:00",
      reworkInterval: null,
      reworkStarted: false,
      reworkStartTime: new Date(),
      startTime: new Date(),
      taskStarted: false,
      timerStarted: false,
    };
  },

  props: {
    operation: {
      type: Object as PropType<Operation>,
      required: true,
    },
    activeTimer: {
      type: Object as PropType<ActiveTimer | null>,
      default: null,
    },
    employee_id: {
      type: String,
      required: true,
    },
    workOrder: {
      type: String,
      required: true,
    },
  },

  emits: ["emit_timer", "update:activeTimer", "time_logged"],

  methods: {
    getTimeInString(date: Date): FrappeDateTimeString {
      return dateToFrappeDateTimeString(date, 5);
    },

    async startTask() {
      // Stop rework timer if it's running (mutually exclusive)
      if (this.reworkStarted) {
        await this.stopRework();
      }

      this.startTime = new Date();
      const startTimeFrappe = this.getTimeInString(this.startTime);

      const response = await frappeCall<StartTimerResponse>(
        "timeclock.www.job_timeclock.start_timer",
        {
          employee_id: this.employee_id,
          work_order: this.workOrder,
          operation: this.operation.operation,
          start_time: startTimeFrappe,
          is_corrective: false,
        },
      );

      if (response.status === "success") {
        this.taskStarted = true;
        this.start_timer(this.startTime);
        this.timerStarted = true;
        this.$emit("emit_timer", this.timerStarted);
        this.$emit("update:activeTimer", {
          work_order: this.workOrder,
          operation: this.operation.operation,
          from_time: startTimeFrappe,
          is_corrective: false,
        } as ActiveTimer);
      } else {
        toast.error(`${this.operation.operation} failed to start.`);
        console.error("start_timer failed:", response.error);
      }
    },

    formatElapsedTime(startTime: Date): string {
      const now = new Date();
      const timeDiff = now.getTime() - startTime.getTime();

      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    },

    start_timer(time: Date): void {
      this.interval = setInterval(() => {
        this.elapsedTime = this.formatElapsedTime(time);
      }, 1000);
    },

    async stopTask() {
      const endTime = new Date();
      const endTimeFrappe = this.getTimeInString(endTime);

      const response = await frappeCall<StopTimerResponse>(
        "timeclock.www.job_timeclock.stop_timer",
        {
          employee_id: this.employee_id,
          work_order: this.workOrder,
          operation: this.operation.operation,
          end_time: endTimeFrappe,
          is_corrective: false,
        },
      );

      if (response.status === "success") {
        if (this.interval !== null) {
          clearInterval(this.interval);
          this.interval = null;
        }
        this.taskStarted = false;
        this.timerStarted = false;
        this.$emit("emit_timer", this.timerStarted);
        this.$emit("update:activeTimer", null);
        this.$emit("time_logged");
      } else {
        toast.error(`${this.operation.operation} failed to stop.`);
        console.error("stop_timer failed:", response.error);
      }
    },

    async startRework() {
      // Stop regular timer if it's running (mutually exclusive)
      if (this.taskStarted) {
        await this.stopTask();
      }

      this.reworkStartTime = new Date();
      const reworkStartTimeFrappe = this.getTimeInString(this.reworkStartTime);

      const response = await frappeCall<StartTimerResponse>(
        "timeclock.www.job_timeclock.start_timer",
        {
          employee_id: this.employee_id,
          work_order: this.workOrder,
          operation: this.operation.operation,
          start_time: reworkStartTimeFrappe,
          is_corrective: true,
        },
      );

      if (response.status === "success") {
        this.reworkStarted = true;
        this.start_rework_timer(this.reworkStartTime);
        this.$emit("update:activeTimer", {
          work_order: this.workOrder,
          operation: this.operation.operation,
          from_time: reworkStartTimeFrappe,
          is_corrective: true,
        } as ActiveTimer);
        toast.success(`Rework started for ${this.operation.operation}.`);
      } else {
        toast.error(`${this.operation.operation} rework failed to start.`);
        console.error("start_timer (corrective) failed:", response.error);
      }
    },

    start_rework_timer(time: Date): void {
      this.reworkInterval = setInterval(() => {
        this.reworkElapsedTime = this.formatElapsedTime(time);
      }, 1000);
    },

    async stopRework() {
      const endTime = new Date();
      const endTimeFrappe = this.getTimeInString(endTime);

      const response = await frappeCall<StopTimerResponse>(
        "timeclock.www.job_timeclock.stop_timer",
        {
          employee_id: this.employee_id,
          work_order: this.workOrder,
          operation: this.operation.operation,
          end_time: endTimeFrappe,
          is_corrective: true,
        },
      );

      if (response.status === "success") {
        if (this.reworkInterval !== null) {
          clearInterval(this.reworkInterval);
          this.reworkInterval = null;
        }
        this.reworkStarted = false;
        this.$emit("update:activeTimer", null);
        toast.success(`Rework completed for ${this.operation.operation}.`);
        this.$emit("time_logged");
      } else {
        toast.error(`${this.operation.operation} rework failed to stop.`);
        console.error("stop_timer (corrective) failed:", response.error);
      }
    },

    initialize_ongoing_timer(): void {
      const isCorrective = this.activeTimer?.is_corrective ?? false;
      const time_from = this.activeTimer?.from_time;
      if (!time_from) return;

      if (isCorrective) {
        this.reworkStarted = true;
        this.reworkStartTime = new Date(time_from);
        this.start_rework_timer(this.reworkStartTime);
      } else {
        this.taskStarted = true;
        this.startTime = new Date(time_from);
        this.start_timer(this.startTime);
      }

      this.timerStarted = true;
      this.$emit("emit_timer", this.timerStarted);
    },

    formatMins(mins: number): string {
      if (mins <= 0) return "0m";
      const h = Math.floor(mins / 60);
      const m = Math.round(mins % 60);
      if (h > 0 && m > 0) return `${h}h ${m}m`;
      if (h > 0) return `${h}h`;
      return `${m}m`;
    },
  },

  mounted() {
    watch(
      () => this.activeTimer,
      (newTimer) => {
        const isActiveForThis =
          newTimer?.work_order === this.workOrder &&
          newTimer?.operation === this.operation.operation;
        if (!isActiveForThis) {
          // Another operation became active or all timers stopped — reset
          this.taskStarted = false;
          if (this.interval !== null) {
            clearInterval(this.interval);
            this.interval = null;
          }
          this.timerStarted = false;
          this.$emit("emit_timer", this.timerStarted);
          this.reworkStarted = false;
          if (this.reworkInterval !== null) {
            clearInterval(this.reworkInterval);
            this.reworkInterval = null;
          }
        }
      },
      { immediate: true },
    );
  },

  beforeMount() {
    const isActive =
      this.activeTimer?.work_order === this.workOrder &&
      this.activeTimer?.operation === this.operation.operation;
    if (isActive) {
      this.initialize_ongoing_timer();
    } else {
      this.taskStarted = false;
    }
  },

  unmounted() {
    if (this.interval !== null) clearInterval(this.interval);
    if (this.reworkInterval !== null) clearInterval(this.reworkInterval);
  },
});
</script>

<!-- <style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Poppins', sans-serif;
}

.container {
  max-width: 500px;
  margin: 30px auto;
  overflow: auto;
  min-height: 300px;
  border: 1px solid steelblue;
  padding: 30px;
  border-radius: 5px;
}

.btn {
  display: inline-block;
  background: rgb(108, 241, 159);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
}

.stop {
  display: inline-block;
  background: #ff8181;
  color: #ffffff;
  border: none;
  padding: 12px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
}

.complete {
  display: inline-block;
  background: #494949;
  color: #ffffff;
  border: none;
  padding: 12px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
}

.btn:focus {
  outline: none;
  display: inline-block;
  background: rgb(197, 255, 219);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
}

.btn:active {
  transform: scale(0.98);
  background: rgb(197, 255, 219);
}

.btn-block {
  display: block;
  width: 100%;
} -->
<!-- </style> -->
