<template>
  <Card
    class="flex flex-row font-sans text-black text-lg lg:text-4xl"
    :class="{ 'bg-green-100': active_user, 'bg-white': active_user === false }"
  >
    <div class="w-2/5">
      <div>{{ operation.operation }}</div>
      <div class="text-xs text-gray-400 mt-0.5" v-if="operation.workstation">
        {{ operation.workstation }}
      </div>
      <div class="text-sm text-gray-500 mt-1" v-if="operation.actual_time_mins > 0 || operation.corrective_total_time_mins > 0">
        <span v-if="operation.actual_time_mins > 0">{{ formatMins(operation.actual_time_mins) }} logged</span>
        <span v-if="operation.actual_time_mins > 0 && operation.corrective_total_time_mins > 0"> · </span>
        <span v-if="operation.corrective_total_time_mins > 0" class="text-orange-500">{{ formatMins(operation.corrective_total_time_mins) }} rework</span>
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
  </Card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import Card from "./Card.vue";
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
