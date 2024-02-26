<template>
    <Card class="flex flex-row font-sans text-black text-lg lg:text-4xl">
        <div class="w-2/5">{{ jobCard.operation }}</div>
        <TimerWidget class="w-3/5" :jobCard="jobCard" :employee_id="employee_id"/>
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
  
<!-- <style scoped>
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
</style> -->