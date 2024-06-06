<template>
    <Column title="Job Cards" description="Select a job card to start the timer" class="w-1/2">
        <div id="JobCards">
            <JobCardWidget name="job_card_widget" v-for="jobCard in jobCards" :key="jobCard.name" :jobCard="jobCard" :employee_id="employee_id" @emit_logged_out_card="emit_logged_out_card"/>
        </div>
    </Column>
</template>
  
<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue';

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
        employee_id: String,
    },
    data(): {
        jobCard: JobCard[],
    } {
        return {
            jobCard: [], 
        };
    },
    methods:{
        emit_logged_out_card(logged_cards){

            // console.log('Before: ', this.jobCards);
            // console.log('Logged Out Card', logged_cards);
            for (let i = 0; i < this.jobCards.length; i++){
                if (this.jobCards[i].name === logged_cards.card_logged_out[0].parent){   
                    this.jobCards[i].is_active = false
                    // console.log('Card Logged out in JobCardList.vue', this.jobCards[i])
                } else if(this.jobCards[i].name === logged_cards.card_logged_in.name){
                    this.jobCards[i].is_active = true
                }
            }
            // console.log('After: ', this.jobCards);
    },
    },

    mounted(){
        // watch(() => this.jobCard.is_active, (newStatus) => {
        //     // If you don't do this, it will refresh every time you switch work orders.
        //     console.log('watching.')
        //     if (newStatus !== this.jobCard.is_active) {
        //       console.log('watch: jobcard.is_active', this.jobCard.is_active)  
        //     } 
        // }, { immediate: true },
        // )
    }
});

</script>