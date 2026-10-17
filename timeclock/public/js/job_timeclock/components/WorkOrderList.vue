<template>
	<Column
		:class="{ 'w-full': !selectedWorkOrder, 'w-1/2': selectedWorkOrder }"
		title="Work Orders"
		description="Select a work order to view job cards"
	>
		<div>
			<WorkOrderWidget
				v-for="workOrder in workOrders"
				:key="workOrder.name"
				:workOrder="workOrder"
				:isSelected="!!(selectedWorkOrder && selectedWorkOrder.name === workOrder.name)"
				:isActive="activeWorkOrder === workOrder.name"
				:isCorrective="activeWorkOrder === workOrder.name && activeTimerIsCorrective"
				@click="selectWorkOrder(workOrder)"
			/>
		</div>
	</Column>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import WorkOrderWidget from "./WorkOrderWidget.vue";
import type { WorkOrder } from "../types";
import Column from "./Column.vue";

export default defineComponent({
	name: "WorkOrderList",
	components: {
		WorkOrderWidget,
		Column,
	},
	props: {
		workOrders: {
			type: Array as PropType<WorkOrder[]>,
			default: () => [],
		},
		selectedWorkOrder: {
			type: Object as PropType<WorkOrder | null>,
			default: null,
		},
		activeWorkOrder: {
			type: String as PropType<string | null>,
			default: null,
		},
		activeTimerIsCorrective: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		selectWorkOrder(workOrder: WorkOrder): void {
			if (this.selectedWorkOrder && this.selectedWorkOrder.name === workOrder.name) {
				// Deselect the current work order if clicked again
				this.$emit("select", null);
			} else {
				// Otherwise, select the new work order
				this.$emit("select", workOrder);
			}
		},
	},
});
</script>
