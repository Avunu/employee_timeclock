<template>
  <Column
    title="Job Cards"
    description="Select a job card to start the timer"
    class="w-1/2"
  >
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
import { defineComponent } from "vue";
import type { PropType } from "vue";

import Column from "./Column.vue";
import JobCardWidget from "./JobCardWidget.vue";
import type { Operation, ActiveTimer } from "../types/JobCard";

export default defineComponent({
  name: "JobCards",
  components: {
    JobCardWidget,
    Column,
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
});
</script>
