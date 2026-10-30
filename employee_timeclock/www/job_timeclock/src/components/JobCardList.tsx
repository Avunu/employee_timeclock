// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useState } from "react";
import { Toggle } from "@carbon/react";
import { formatMins } from "../format";
import type { ActiveTimer, MachineTimer, Operation, WorkOrder } from "../types";
import { JobCard, type JobCardActions } from "./JobCard";
import { EstimateBar } from "./EstimateBar";

interface JobCardListProps extends JobCardActions {
	workOrder: WorkOrder;
	operations: Operation[];
	workstations: string[];
	activeTimer: ActiveTimer | null;
	machineTimers: MachineTimer[];
	isPinned: (workOrder: string, operation: string) => boolean;
	canPin: boolean;
	/** A job gone to from elsewhere, shown whichever station it is at. */
	revealed: string | null;
}

/** A work order's job cards and its overall progress; by default just this tablet's stations'. */
export function JobCardList({
	workOrder,
	operations,
	workstations,
	activeTimer,
	machineTimers,
	isPinned,
	canPin,
	revealed,
	...actions
}: JobCardListProps) {
	const [myStation, setMyStation] = useState(true);
	const shown =
		myStation && workstations.length > 0
			? operations.filter(
					(operation) => workstations.includes(operation.workstation) || operation.operation === revealed,
				)
			: operations;
	const planned = operations.reduce((sum, operation) => sum + operation.planned_time_mins, 0);
	const logged = operations.reduce(
		(sum, operation) => sum + operation.actual_time_mins + operation.corrective_total_time_mins,
		0,
	);
	const over = logged > planned;

	return (
		<section className="jt-column jt-column-half">
			<div className="jt-row">
				<h2 className="jt-column-title">Job Cards</h2>
				{workstations.length > 0 && (
					<Toggle
						id="jt-my-station"
						size="sm"
						labelText="My Station"
						hideLabel
						toggled={myStation}
						onToggle={setMyStation}
					/>
				)}
			</div>
			<p className="jt-muted">Select a job card to start the timer</p>
			{planned > 0 && (
				<div className="jt-estimate">
					<p className={over ? "jt-text-overrun" : undefined}>
						{formatMins(logged)} logged of {formatMins(planned)} estimated
						{over && ` · +${formatMins(logged - planned)} overrun`}
					</p>
					<EstimateBar loggedMins={logged} plannedMins={planned} />
				</div>
			)}
			<div id="JobCards">
				{shown.map((operation) => (
					<JobCard
						key={operation.name}
						workOrder={workOrder.name}
						productName={workOrder.production_item}
						operation={operation}
						activeTimer={activeTimer}
						machineTimers={machineTimers}
						pinned={isPinned(workOrder.name, operation.operation)}
						canPin={canPin}
						{...actions}
					/>
				))}
			</div>
		</section>
	);
}
