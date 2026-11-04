// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { ClickableTile, Tag } from "@carbon/react";
import type { ActiveTimer, WorkOrder } from "../types";
import { EstimateBar } from "./JobCards";

type TagType = "gray" | "blue" | "green" | "red";

const STATUS_TAGS: Partial<Record<WorkOrder["status"], TagType>> = {
	"In Process": "blue",
	Completed: "green",
	Stopped: "red",
};

interface WorkOrderCardProps {
	workOrder: WorkOrder;
	selected: boolean;
	/** The employee's running timer is on this work order. */
	active: boolean;
	corrective: boolean;
	onSelect: () => void;
}

export function WorkOrderCard({ workOrder, selected, active, corrective, onSelect }: WorkOrderCardProps) {
	const state = active
		? corrective
			? " jt-card-rework"
			: " jt-card-active"
		: selected
			? " jt-card-selected"
			: "";
	return (
		<div data-work-order={workOrder.name}>
			<ClickableTile className={`jt-card${state}`} onClick={onSelect}>
				<div className="jt-card-head">
					<p className="jt-card-title">{workOrder.production_item}</p>
					<Tag type={STATUS_TAGS[workOrder.status] ?? "gray"}>{workOrder.status}</Tag>
				</div>
				<div className="jt-card-foot">
					<p className="jt-muted">{workOrder.name}</p>
				</div>
				{workOrder.planned_time_mins > 0 && (
					<EstimateBar loggedMins={workOrder.logged_time_mins} plannedMins={workOrder.planned_time_mins} />
				)}
			</ClickableTile>
		</div>
	);
}

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
