<template>
    <Card>
        {{ jobCard.operation }}
        <Button @click="toggleTimer(jobCard.status)"
            :label="jobCard.status === 'started' ? 'Stop' : 'Start'"></Button>
    </Card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Button } from 'frappe-ui';

import Card from './Card.vue';
import { JobCard } from '../types/JobCard';

export default defineComponent({
    name: 'JobCardWidget',
    components: {
        Button,
        Card
    },
    props: {
        jobCard: {
            type: Object as PropType<JobCard>,
            default: () => {},
        },
    },
    methods: {
        toggleTimer(status: string) {
            this.$emit('toggleTimer', status);
        }
    },
});

</script>
  