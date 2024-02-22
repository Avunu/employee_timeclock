<template>
    <Card class="font-sans text-black text-lg lg:text-4xl">
        {{ jobCard.operation }}
        <!-- <Button @click="toggleTimer(jobCard.status)" :label="jobCard.status !== 'Completed' ? 'Start' : 'Stop'"></Button> -->
        <!-- <Button @click="toggleTimer(jobCard.status)" :state="jobCard.status === 'Completed' ? 'True' : 'False'"></Button> -->
        <TimerWidget class="timer" :jobCard="jobCard" :employee_id="employee_id"/>
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
        employee_id: String,
    },
    methods: {
        
    },
});

</script>
  
<style scoped>
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