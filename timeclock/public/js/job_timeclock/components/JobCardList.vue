<template>
  <Column
    title="Job Cards"
    description="Select a job card to start the timer"
    class="w-1/2"
  >
    <!-- Overall Work Order Progress -->
    <div v-if="totalPlannedMins > 0" class="mb-4">
      <Progress :value="progressPercent" size="lg" :hint="true">
        <template #hint>
          <span class="text-sm font-medium" :class="progressHintClass">
            {{ formatMins(totalLoggedMins) }} /
            {{ formatMins(totalPlannedMins) }}
          </span>
        </template>
      </Progress>
    </div>

    <div id="JobCards">
      <JobCardWidget
        name="job_card_widget"
        v-for="op in operations"
        :key="op.name"
        :operation="op"
        :activeTimer="activeTimer"
        :workOrder="workOrder"
        @start-task="$emit('start-task', $event)"
        @stop-task="$emit('stop-task', $event)"
        @start-rework="$emit('start-rework', $event)"
        @stop-rework="$emit('stop-rework', $event)"
      />
    </div>
  </Column>
</template>

<script lang="ts">
import { defineComponent, computed } from "vue";
import type { PropType } from "vue";

import { Progress } from "frappe-ui";
import Column from "./Column.vue";
import JobCardWidget from "./JobCardWidget.vue";
import type { Operation, ActiveTimer } from "../types/JobCard";

export default defineComponent({
  name: "JobCards",
  components: {
    JobCardWidget,
    Column,
    Progress,
  },
  props: {
    operations: {
      type: Array as PropType<Operation[]>,
      default: () => [],
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

  computed: {
    totalPlannedMins(): number {
      return this.operations.reduce(
        (sum, op) => sum + (op.planned_time_mins || 0),
        0,
      );
    },
    totalLoggedMins(): number {
      return this.operations.reduce(
        (sum, op) =>
          sum +
          (op.actual_time_mins || 0) +
          (op.corrective_total_time_mins || 0),
        0,
      );
    },
    progressPercent(): number {
      if (this.totalPlannedMins <= 0) return 0;
      return Math.min(
        Math.round((this.totalLoggedMins / this.totalPlannedMins) * 100),
        100,
      );
    },
    progressHintClass(): string {
      if (this.totalLoggedMins > this.totalPlannedMins) return "text-red-600";
      if (this.progressPercent >= 80) return "text-orange-600";
      return "text-ink-gray-5";
    },
  },

  methods: {
    formatMins(mins: number): string {
      if (mins <= 0) return "0m";
      const h = Math.floor(mins / 60);
      const m = Math.round(mins % 60);
      if (h > 0 && m > 0) return `${h}h ${m}m`;
      if (h > 0) return `${h}h`;
      return `${m}m`;
    },
  },
});
</script>
