<template>
    <Column title="Job Cards" description="Select a job card to start the timer" class="w-1/2">
        <div id="JobCards">
            <JobCardWidget name="job_card_widget" @send_start_time="start_time" @send_end_time="end_time" v-for="jobCard in jobCards" :key="jobCard.sequence_id" :jobCard="jobCard"/>
        </div>
    </Column>
</template>
  
<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';

import Column from './Column.vue';
import JobCardWidget from './JobCardWidget.vue';
import { JobCard } from '../types/JobCard';

export default defineComponent({
    name: 'JobCards',
    components: {
        JobCardWidget,
        Column, 
    },
    props: {
        jobCards: {
            type: Array as PropType<JobCard[]>,
            default: () => [],
        },
    
    },
    data(): {
        jobCard: JobCard[],
    } {
        return {
            jobCard: [], 
        };
    },
    methods:{
        // listen(status: string){
        //     // console.log('I heard')
        //     this.$emit('toggleTimer',status)
        // },
        start_time(start_time_frappe: String, name:String){
            // console.log(startTime)
            // console.log(name)
            this.$emit('send_start_time', start_time_frappe, name);
        },
        end_time(end_time_frappe:String, name:String){
            // console.log(endTime)
            // console.log(name)
            this.$emit('send_end_time', end_time_frappe, name);
        }
    }
});

</script>