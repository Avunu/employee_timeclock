<template>
    <Card class="card_title">
        {{ jobCard.operation }}
        <!-- <Button @click="toggleTimer(jobCard.status)" :label="jobCard.status !== 'Completed' ? 'Start' : 'Stop'"></Button> -->
        <!-- <Button @click="toggleTimer(jobCard.status)" :state="jobCard.status === 'Completed' ? 'True' : 'False'"></Button> -->
        <TimerWidget class="timer" @send_start_time="start_time" @send_end_time="end_time" :jobCard="jobCard"/>
    </Card>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue';
// import { Button } from 'frappe-ui';
import Button from './Button.vue'
import Card from './Card.vue';
import { JobCard } from '../types/JobCard';
import TimerWidget from './TimerWidget.vue';

export default defineComponent({
    name: 'JobCardWidget',
    components: {
        Button,
        Card,
        TimerWidget,
    },
    props: {
        jobCard: {
            type: Object as PropType<JobCard>,
            default: () => {},
        },
    },
    methods: {

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
    },
});

</script>
  
<style>
.card_title{
    font-family: 'Poppins', sans-serif;
    color: black;
    text-decoration: none;
    font-size: 15px;
}

.timer{
    font-family: 'Poppins', sans-serif;
    color: black;
    text-decoration: none;
    font-size: 12px;
    font-weight: lighter;
}
</style>