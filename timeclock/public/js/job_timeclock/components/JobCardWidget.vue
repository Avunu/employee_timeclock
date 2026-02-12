<template>
  <Card
    :title="operation.operation"
    :subtitle="operation.workstation || undefined"
    class="font-sans text-black text-lg lg:text-4xl mt-2 mb-2"
    :class="{ '!bg-green-100': active_user }"
  >
    <div class="flex flex-row items-center">
      <div class="w-2/5">
        <div
          class="text-sm text-gray-500"
          v-if="
            operation.actual_time_mins > 0 ||
            operation.corrective_total_time_mins > 0
          "
        >
          <span v-if="operation.actual_time_mins > 0"
            >{{ formatMins(operation.actual_time_mins) }} logged</span
          >
          <span
            v-if="
              operation.actual_time_mins > 0 &&
              operation.corrective_total_time_mins > 0
            "
          >
            &middot;
          </span>
          <span
            v-if="operation.corrective_total_time_mins > 0"
            class="text-orange-500"
            >{{ formatMins(operation.corrective_total_time_mins) }} rework</span
          >
        </div>
      </div>
      <TimerWidget
        class="w-3/5"
        :operation="operation"
        :activeTimer="activeTimer"
        :employee_id="employee_id"
        :workOrder="workOrder"
        @emit_timer="emit_timer"
        @update:activeTimer="$emit('update:activeTimer', $event)"
        @time_logged="$emit('time_logged')"
      />
    </div>
  </Card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import { Card } from "frappe-ui";
import type { Operation, ActiveTimer } from "../types/JobCard";
import TimerWidget from "./TimerWidget.vue";

export default defineComponent({
  name: "JobCardWidget",
  components: {
    Card,
    TimerWidget,
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
    employee_id: {
      type: String,
      required: true,
    },
    workOrder: {
      type: String,
      required: true,
    },
  },
  emits: ["update:activeTimer", "time_logged"],
  data(): {
    active_user: boolean;
  } {
    return {
      active_user: false,
    };
  },

  methods: {
    emit_timer(timer_started: boolean): void {
      this.active_user = timer_started;
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
