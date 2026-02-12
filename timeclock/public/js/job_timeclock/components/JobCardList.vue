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
        :employee_id="employee_id"
        :workOrder="workOrder"
        @update:activeTimer="$emit('update:activeTimer', $event)"
        @time_logged="$emit('time_logged')"
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
});
</script>
