<template>
  <Card
    class="flex flex-row font-sans text-black text-lg lg:text-4xl"
    :class="{ 'bg-green-100': active_user, 'bg-white': active_user === false }"
  >
    <div class="w-2/5">
      <div>{{ jobCard.operation }}</div>
      <div class="text-sm text-gray-500 mt-1" v-if="allRegularMins > 0 || allReworkMins > 0">
        <span v-if="allRegularMins > 0">{{ formatMins(allRegularMins) }} logged</span>
        <span v-if="allRegularMins > 0 && allReworkMins > 0"> · </span>
        <span v-if="allReworkMins > 0" class="text-orange-500">{{ formatMins(allReworkMins) }} rework</span>
      </div>
    </div>
    <TimerWidget
      class="w-3/5"
      :jobCard="jobCard"
      :activeLog="activeLog"
      :employee_id="employee_id"
      :workOrder="workOrder"
      :employeeRegularMins="employeeRegularMins"
      :employeeReworkMins="employeeReworkMins"
      @emit_timer="emit_timer"
      @update:activeLog="$emit('update:activeLog', $event)"
      @time_logged="fetchTimeTotals"
    />
  </Card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import Card from "./Card.vue";
import type { JobCard, ActiveLog } from "../types/JobCard";
import type { GetJobCardTimeTotalsResponse } from "../types/api";
import TimerWidget from "./TimerWidget.vue";
import { frappeCall } from "../../FrappeCall";

export default defineComponent({
  name: "JobCardWidget",
  components: {
    Card,
    TimerWidget,
  },
  props: {
    jobCard: {
      type: Object as PropType<JobCard>,
      default: () => ({}),
    },
    activeLog: {
      type: Object as PropType<ActiveLog | null>,
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
  emits: ["update:activeLog"],
  data(): {
    active_user: boolean;
    allRegularMins: number;
    allReworkMins: number;
    employeeRegularMins: number;
    employeeReworkMins: number;
  } {
    return {
      active_user: false,
      allRegularMins: this.jobCard?.all_regular_mins ?? 0,
      allReworkMins: this.jobCard?.all_rework_mins ?? 0,
      employeeRegularMins: this.jobCard?.employee_regular_mins ?? 0,
      employeeReworkMins: this.jobCard?.employee_rework_mins ?? 0,
    };
  },

  methods: {
    emit_timer(timer_started: boolean): void {
      this.active_user = timer_started;
    },

    async fetchTimeTotals(): Promise<void> {
      if (!this.jobCard?.operation || !this.workOrder || !this.employee_id) return;
      try {
        const response = await frappeCall<GetJobCardTimeTotalsResponse>(
          "timeclock.www.job_timeclock.get_job_card_time_totals",
          {
            employee_id: this.employee_id,
            work_order: this.workOrder,
            operation: this.jobCard.operation,
          },
        );
        if (response.status === "success") {
          this.allRegularMins = response.all_regular_mins;
          this.allReworkMins = response.all_rework_mins;
          this.employeeRegularMins = response.employee_regular_mins;
          this.employeeReworkMins = response.employee_rework_mins;
        }
      } catch (e) {
        console.error("Failed to fetch time totals:", e);
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
});
</script>
