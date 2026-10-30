// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { ClickableTile, Tag } from "@carbon/react";
import type { WorkOrder } from "../types";
import { ProgressRing } from "./ProgressRing";

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
					{workOrder.planned_time_mins > 0 && (
						<ProgressRing loggedMins={workOrder.logged_time_mins} plannedMins={workOrder.planned_time_mins} />
					)}
				</div>
			</ClickableTile>
		</div>
	);
}
