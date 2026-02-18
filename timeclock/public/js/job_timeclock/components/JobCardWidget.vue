<template>
  <div :data-operation="operation.operation">
    <Card :title="operation.operation" class="font-sans text-black text-lg lg:text-4xl mt-2 mb-2" :class="{
      'ring-2 ring-green-500 !bg-green-50': active_user && !reworkStarted,
      'ring-2 ring-orange-500 !bg-orange-50': active_user && reworkStarted,
    }">
      <template #actions>
        <div class="flex gap-2 items-start">
          <Button theme="green" variant="outline" size="2xl" label="Start Timer" @click="startTask"
            v-if="!taskStarted && !operation.is_submitted" />
          <Button theme="gray" variant="ghost" size="2xl" label="Submitted" :disabled="true" class="italic"
            v-if="!taskStarted && operation.is_submitted" />
          <Button theme="green" variant="outline" size="2xl" label="Stop Timer" @click="stopTask" v-if="taskStarted" />
          <Button theme="gray" variant="solid" size="2xl" label="Start Rework"
            class="!bg-orange-500 !text-white hover:!bg-orange-600" @click="startRework" v-if="!reworkStarted" />
          <Button theme="gray" variant="outline" size="2xl" label="Stop Rework"
            class="!text-orange-600 !border-orange-500 hover:!bg-orange-100" @click="stopRework" v-if="reworkStarted" />
        </div>
      </template>

      <div class="flex flex-col gap-2 text-sm" v-if="hasTimeData">
        <!-- Regular Time Row -->
        <div class="flex justify-between items-center" v-if="
          taskStarted ||
          operation.actual_time_mins > 0 ||
          operation.employee_time_mins > 0
        ">
          <div>
            <div class="text-gray-500 w-full" v-if="operation.workstation">
              {{ operation.workstation }}
            </div>
            <div class="text-gray-500 w-full" v-if="operation.actual_time_mins > 0">
              {{ formatMins(operation.actual_time_mins) }} logged
            </div>
          </div>
          <div class="text-right">
            <span class="text-gray-700 font-mono text-sm" v-if="taskStarted">
              {{ elapsedTime }}
            </span>
            <span class="text-gray-400 text-sm ml-2" v-if="operation.employee_time_mins > 0">
              Your total: {{ formatMins(operation.employee_time_mins) }}
            </span>
          </div>
        </div>
        <!-- Corrective Time Row -->
        <div class="flex justify-between items-center" v-if="
          reworkStarted ||
          operation.corrective_total_time_mins > 0 ||
          operation.corrective_employee_time_mins > 0
        ">
          <div class="text-orange-500" v-if="operation.corrective_total_time_mins > 0">
            {{ formatMins(operation.corrective_total_time_mins) }} rework
          </div>
          <div v-else />
          <div class="text-right">
            <span class="text-orange-600 font-mono font-bold" v-if="reworkStarted">
              {{ reworkElapsedTime }}
            </span>
            <span class="text-orange-400 text-xs ml-2" v-if="operation.corrective_employee_time_mins > 0">
              Your total:
              {{ formatMins(operation.corrective_employee_time_mins) }}
            </span>
          </div>
        </div>
      </div>
    </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import type { PropType } from "vue";
import { Card } from "frappe-ui";
import Button from "./Button.vue";
import type { Operation, ActiveTimer } from "../types/JobCard";

export default defineComponent({
  name: "JobCardWidget",
  components: {
    Card,
    Button,
  },
  props: {
    operation: {
      type: Object as PropType<Operation>,
      default: () => ({}),
    },
    activeTimer: {
      type: Object as PropType<ActiveTimer | null>,
      default: null,
    },
    workOrder: {
      type: String,
      required: true,
    },
  },
  emits: ["start-task", "stop-task", "start-rework", "stop-rework"],

  data(): {
    elapsedTime: string;
    reworkElapsedTime: string;
    interval: ReturnType<typeof setInterval> | null;
  } {
    return {
      elapsedTime: "00:00:00",
      reworkElapsedTime: "00:00:00",
      interval: null,
    };
  },

  computed: {
    isActiveForThis(): boolean {
      return (
        this.activeTimer?.work_order === this.workOrder &&
        this.activeTimer?.operation === this.operation.operation
      );
    },
    taskStarted(): boolean {
      return this.isActiveForThis && !this.activeTimer!.is_corrective;
    },
    reworkStarted(): boolean {
      return this.isActiveForThis && !!this.activeTimer!.is_corrective;
    },
    active_user(): boolean {
      return this.isActiveForThis;
    },
    hasTimeData(): boolean {
      return (
        this.isActiveForThis ||
        this.operation.actual_time_mins > 0 ||
        this.operation.corrective_total_time_mins > 0 ||
        this.operation.employee_time_mins > 0 ||
        this.operation.corrective_employee_time_mins > 0
      );
    },
  },

  methods: {
    startTask() {
      this.$emit("start-task", this.operation.operation);
    },

    stopTask() {
      this.$emit("stop-task", this.operation.operation);
    },

    startRework() {
      this.$emit("start-rework", this.operation.operation);
    },

    stopRework() {
      this.$emit("stop-rework", this.operation.operation);
    },

    formatElapsedTime(startTime: Date): string {
      const now = new Date();
      const timeDiff = now.getTime() - startTime.getTime();

      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    },

    updateElapsedDisplay(): void {
      if (!this.isActiveForThis || !this.activeTimer?.from_time) return;
      const start = new Date(this.activeTimer.from_time);
      const elapsed = this.formatElapsedTime(start);
      if (this.activeTimer.is_corrective) {
        this.reworkElapsedTime = elapsed;
      } else {
        this.elapsedTime = elapsed;
      }
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
      () => this.isActiveForThis,
      (active) => {
        if (this.interval) {
          clearInterval(this.interval);
          this.interval = null;
        }
        if (active) {
          this.updateElapsedDisplay();
          this.interval = setInterval(() => this.updateElapsedDisplay(), 1000);
        } else {
          this.elapsedTime = "00:00:00";
          this.reworkElapsedTime = "00:00:00";
        }
      },
      { immediate: true },
    );
  },

  unmounted() {
    if (this.interval !== null) clearInterval(this.interval);
  },
});
</script>
