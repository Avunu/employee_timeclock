<template>
    <Card class="flex flex-row font-sans text-black text-lg lg:text-4xl"
        :class="{ 'bg-green-100': active_user, 'bg-white': active_user === false }">
        <div class="w-2/5">{{ jobCard.operation }}</div>
        <TimerWidget class="w-3/5" :jobCard="jobCard" :employee_id="employee_id" @emit_timer="emit_timer"
            @emit_logged_out_card="emit_logged_out_card" />
    </Card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { PropType } from 'vue';
import Button from './Button.vue';
import Card from './Card.vue';
import type { JobCard } from '../types/JobCard';
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
            default: () => ({}),
        },
        employee_id: {
            type: String,
            required: true,
        },
    },
    data(): {
        active_user: boolean,
    } {
        return {
            active_user: false,
        }
    },

    methods: {
        emit_timer(timer_started: boolean): void {
            if (timer_started === true) {
                this.active_user = true;
            } else {
                this.active_user = false;
            }
        },
        emit_logged_out_card(logged_cards: any): void {
            // console.log('logged out card to job card widget')
            this.$emit('emit_logged_out_card', logged_cards);
        }
    },
    mounted(): void {

    },
});

</script>