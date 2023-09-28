<template>
    <Column :class="{ 'w-full': !selectedWorkOrder, 'w-1/2': selectedWorkOrder }" title="Work Orders"
        description="Select a work order to view job cards">
        <div id="WorkOrders">
            <WorkOrderWidget v-for="workOrder in workOrders" :key="workOrder.name" :workOrder="workOrder"
                :isSelected="selectedWorkOrder && selectedWorkOrder.name === workOrder.name"
                @click="selectWorkOrder(workOrder)" />
        </div>
    </Column>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import WorkOrderWidget from './WorkOrderWidget.vue';
import { WorkOrder } from '../types/WorkOrder';
import Column from './Column.vue';

export default defineComponent({
    name: 'WorkOrderList',
    components: {
        WorkOrderWidget,
        Column
    },
    props: {
        workOrders: {
            type: Array as PropType<WorkOrder[]>,
            default: () => [],
        },
        selectedWorkOrder: Object as PropType<WorkOrder>,
    },
    methods: {
        selectWorkOrder(workOrder: WorkOrder) {
            if (this.selectedWorkOrder && this.selectedWorkOrder.name === workOrder.name) {
                // Deselect the current work order if clicked again
                this.$emit('select', null);
            } else {
                // Otherwise, select the new work order
                this.$emit('select', workOrder);
            }
        }
    }
});
</script>
