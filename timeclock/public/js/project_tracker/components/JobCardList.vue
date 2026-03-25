<template>
  <Column
    title="Job Cards"
    description="Select a job card to start the timer"
    class="w-1/2"
  >
    <template #actions>
      <Switch
        v-if="workstations.length > 0"
        v-model="filterByWorkstation"
        label="My Station"
        size="sm"
      />
    </template>

    <!-- Overall Work Order Progress -->
    <div v-if="totalPlannedMins > 0" class="mb-4 space-y-1.5">
      <!-- Time summary -->
      <p class="text-lg font-medium" :class="progressHintClass">
        {{ formatMins(totalLoggedMins) }} logged of
        {{ formatMins(totalPlannedMins) }} estimated
        <span v-if="isOverrun">
          · +{{ formatMins(totalLoggedMins - totalPlannedMins) }} overrun
        </span>
      </p>
      <!-- Custom progress bar: green normally, green+red split on overrun -->
      <div class="h-2 w-full rounded-full bg-gray-200 overflow-hidden flex">
        <div
          class="h-full bg-green-500 transition-all duration-300"
          :class="{ 'rounded-full': !isOverrun, 'rounded-l-full': isOverrun }"
          :style="{ width: progressPercent + '%' }"
        />
        <div
          v-if="isOverrun"
          class="h-full rounded-r-full bg-red-500 transition-all duration-300"
          :style="{ width: overrunPercent + '%' }"
        />
      </div>
    </div>

    <div id="JobCards">
      <JobCardWidget
        name="job_card_widget"
        v-for="op in filteredOperations"
        :key="op.name"
        :operation="op"
        :activeTimer="activeTimer"
        :machineTimers="machineTimers"
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

import { Switch } from "frappe-ui";
import Column from "./Column.vue";
import JobCardWidget from "./JobCardWidget.vue";
import type { Operation, ActiveTimer, MachineTimer } from "../types";

export default defineComponent({
  name: "JobCards",
  components: {
    JobCardWidget,
    Column,
    Switch,
  },
  props: {
    operations: {
      type: Array as PropType<Operation[]>,
      default: () => [],
    },
    workstations: {
      type: Array as PropType<string[]>,
      default: () => [],
    },
    activeTimer: {
      type: Object as PropType<ActiveTimer | null>,
      default: null,
    },
    machineTimers: {
      type: Array as PropType<MachineTimer[]>,
      default: () => [],
    },
    workOrder: {
      type: String,
      required: true,
    },
  },
  emits: ["start-task", "stop-task", "start-rework", "stop-rework"],

  data(): { filterByWorkstation: boolean } {
    return {
      filterByWorkstation: true,
    };
  },

  computed: {
    filteredOperations(): Operation[] {
      if (!this.filterByWorkstation || this.workstations.length === 0) {
        return this.operations;
      }
      return this.operations.filter((op) =>
        this.workstations.includes(op.workstation),
      );
    },
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
      if (this.totalLoggedMins <= this.totalPlannedMins) {
        return Math.round((this.totalLoggedMins / this.totalPlannedMins) * 100);
      }
      // On overrun: green shows planned as proportion of total logged
      return Math.round((this.totalPlannedMins / this.totalLoggedMins) * 100);
    },
    overrunPercent(): number {
      if (!this.isOverrun) return 0;
      return 100 - this.progressPercent;
    },
    isOverrun(): boolean {
      return this.totalLoggedMins > this.totalPlannedMins;
    },
    progressHintClass(): string {
      if (this.isOverrun) return "text-red-600";
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
