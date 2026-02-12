<template>
  <Column
    title="Job Cards"
    description="Select a job card to start the timer"
    class="w-1/2"
  >
    <div id="JobCards">
      <JobCardWidget
        name="job_card_widget"
        v-for="jobCard in jobCards"
        :key="jobCard.operation"
        :jobCard="jobCard"
        :activeLog="activeLog"
        :employee_id="employee_id"
        :workOrder="workOrder"
        @update:activeLog="$emit('update:activeLog', $event)"
      />
    </div>
  </Column>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";

import Column from "./Column.vue";
import JobCardWidget from "./JobCardWidget.vue";
import type { JobCard, ActiveLog } from "../types/JobCard";

export default defineComponent({
  name: "JobCards",
  components: {
    JobCardWidget,
    Column,
  },
  props: {
    jobCards: {
      type: Array as PropType<JobCard[]>,
      default: () => [],
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
});
</script>
