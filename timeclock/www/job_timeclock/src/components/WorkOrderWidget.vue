<template>
    <Card @click="$emit('click', workOrder)" :class="{ 'bg-blue-100': isSelected }">
        <div class="flex flex-col">
            <h3 class="font-semibold text-xl-gray-500">{{ workOrder.production_item }}</h3>
            <span>{{ workOrder.name }}</span>
        </div>
        <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
            {{ workOrder.status }}
        </span>
    </Card>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { WorkOrder } from '../types/WorkOrder';

import Card from './Card.vue';

export default defineComponent({
    name: 'WorkOrderWidget',
    components: {
        Card
    },
    props: {
        workOrder: {
            type: Object as PropType<WorkOrder>,
            required: true,
        },
        isSelected: {
            type: Boolean,
            default: false,
        },
    },
    mounted() {
        // console.log(this.workOrder)
    },
    
});
</script>