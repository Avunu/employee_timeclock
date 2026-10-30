// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import type { ActiveTimer, WorkOrder } from "../types";
import { WorkOrderCard } from "./WorkOrderCard";

interface WorkOrderListProps {
	workOrders: WorkOrder[];
	selected: WorkOrder | null;
	activeTimer: ActiveTimer | null;
	/** Something shares the screen with the list. */
	narrow: boolean;
	onSelect: (workOrder: WorkOrder | null) => void;
}

/** The open work orders. Tapping the selected one again closes it. */
export function WorkOrderList({ workOrders, selected, activeTimer, narrow, onSelect }: WorkOrderListProps) {
	return (
		<section className={narrow ? "jt-column jt-column-half" : "jt-column"}>
			<h2 className="jt-column-title">Work Orders</h2>
			<p className="jt-muted">Select a work order to view job cards</p>
			{workOrders.map((workOrder) => (
				<WorkOrderCard
					key={workOrder.name}
					workOrder={workOrder}
					selected={selected?.name === workOrder.name}
					active={activeTimer?.work_order === workOrder.name}
					corrective={activeTimer?.work_order === workOrder.name && activeTimer.is_corrective}
					onSelect={() => onSelect(selected?.name === workOrder.name ? null : workOrder)}
				/>
			))}
		</section>
	);
}
