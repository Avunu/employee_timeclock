<template>
    <Column title="Job Cards" description="Select a job card to start the timer" class="w-1/2">
        <div id="JobCards">
            <JobCardWidget v-for="jobCard in jobCards" :key="jobCard.name" :jobCard="jobCard" />
        </div>
    </Column>
</template>
  
<script lang="ts">
import { defineComponent, PropType } from 'vue';

import Column from './Column.vue';
import JobCardWidget from './JobCardWidget.vue';
import { JobCard } from '../types/JobCard';

export default defineComponent({
    name: 'JobCards',
    components: {
        JobCardWidget,
        Column
    },
    props: {
        jobCards: {
            type: Array as PropType<JobCard[]>,
            default: () => [],
        },
    },
});

</script>
  