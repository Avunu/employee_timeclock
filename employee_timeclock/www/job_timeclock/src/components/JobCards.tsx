// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { Button, ProgressBar, Tile, Toggle } from "@carbon/react";
import { Pin, PinFilled } from "@carbon/react/icons";
import { elapsedSince, formatMins, useTick } from "../format";
import type { ActiveTimer, MachineTimer, Operation, WorkOrder } from "../types";
import { useState } from "react";

interface EstimateBarProps {
	loggedMins: number;
	plannedMins: number;
}

/** Time logged against an estimate, in red once over it. */
export function EstimateBar({ loggedMins, plannedMins }: EstimateBarProps) {
	return (
		<ProgressBar
			size="small"
			hideLabel
			label="Time logged against the estimate"
			max={plannedMins}
			value={Math.min(loggedMins, plannedMins)}
			{...(loggedMins > plannedMins && { status: "error" as const })}
		/>
	);
}

export interface JobCardActions {
	onStart: (workOrder: string, operation: Operation, isCorrective: boolean) => void;
	onStop: (workOrder: string, operation: Operation, isCorrective: boolean) => void;
	onTogglePin: (workOrder: string, operation: string) => void;
}

interface JobCardProps extends JobCardActions {
	workOrder: string;
	productName: string;
	operation: Operation;
	activeTimer: ActiveTimer | null;
	machineTimers: MachineTimer[];
	pinned: boolean;
	/** Whether this employee can pin at all: an unconfirmed badge can't. */
	canPin: boolean;
	/** This is the job just gone to. */
	found?: boolean;
	/** Makes the whole card a way to go to this job. */
	onOpen?: () => void;
}

/** The timer on this card, machine or labor, if one is running. */
function runningTimer(
	workOrder: string,
	operation: Operation,
	activeTimer: ActiveTimer | null,
	machineTimers: MachineTimer[],
): { from_time?: string | null; is_corrective?: boolean } | undefined {
	if (operation.is_machine_time) {
		return machineTimers.find(
			(timer) => timer.work_order === workOrder && timer.operation === operation.operation,
		);
	}
	const mine = activeTimer?.work_order === workOrder && activeTimer.operation === operation.operation;
	return mine ? activeTimer : undefined;
}

/** One operation of a work order: its timers, its estimate, and the time logged against it. */
export function JobCard({
	workOrder,
	productName,
	operation,
	activeTimer,
	machineTimers,
	pinned,
	canPin,
	found = false,
	onOpen,
	onStart,
	onStop,
	onTogglePin,
}: JobCardProps) {
	const running = runningTimer(workOrder, operation, activeTimer, machineTimers);
	const now = useTick(running !== undefined);
	const taskStarted = running !== undefined && !running.is_corrective;
	const reworkStarted = running !== undefined && Boolean(running.is_corrective);
	const elapsed = running?.from_time ? elapsedSince(running.from_time, now) : "00:00:00";
	const kind = operation.is_machine_time ? "machine" : "labor";
	const logged = operation.actual_time_mins + operation.corrective_total_time_mins;
	const planned = operation.planned_time_mins;
	const state = reworkStarted ? " jt-card-rework" : taskStarted ? ` jt-card-${kind}` : "";
	const showRegular = taskStarted || operation.actual_time_mins > 0 || operation.employee_time_mins > 0;
	const showRework =
		reworkStarted || operation.corrective_total_time_mins > 0 || operation.corrective_employee_time_mins > 0;

	return (
		<div data-operation={operation.operation}>
			<Tile className={`jt-card${state}${found ? " jt-card-found" : ""}`}>
				<div className="jt-card-head">
					<p className="jt-muted">{productName}</p>
					{canPin && (
						<Button
							kind="ghost"
							size="lg"
							className="jt-card-pin"
							hasIconOnly
							renderIcon={pinned ? PinFilled : Pin}
							iconDescription={pinned ? "Unpin" : "Pin"}
							onClick={() => onTogglePin(workOrder, operation.operation)}
						/>
					)}
				</div>
				<div className="jt-card-head">
					<h3 className={`jt-card-title jt-text-${kind}`}>
						{onOpen ? (
							<button type="button" className="jt-card-open" onClick={onOpen}>
								{operation.operation}
							</button>
						) : (
							operation.operation
						)}
					</h3>
					<div className="jt-actions">
						{taskStarted && (
							<Button
								size="lg"
								className="jt-action"
								kind="secondary"
								onClick={() => onStop(workOrder, operation, false)}
							>
								Stop Timer
							</Button>
						)}
						{!taskStarted && !operation.is_submitted && (
							<Button size="lg" className="jt-action" onClick={() => onStart(workOrder, operation, false)}>
								Start Timer
							</Button>
						)}
						{!taskStarted && operation.is_submitted && (
							<Button size="lg" className="jt-action" kind="ghost" disabled>
								Submitted
							</Button>
						)}
						{reworkStarted ? (
							<Button
								size="lg"
								className="jt-action"
								kind="danger--tertiary"
								onClick={() => onStop(workOrder, operation, true)}
							>
								Stop Rework
							</Button>
						) : (
							<Button
								size="lg"
								className="jt-action"
								kind="tertiary"
								onClick={() => onStart(workOrder, operation, true)}
							>
								Start Rework
							</Button>
						)}
					</div>
				</div>
				{planned > 0 && (
					<div className="jt-estimate">
						<div className="jt-row">
							<span>Estimated Time: {formatMins(planned)}</span>
							{logged > planned && (
								<span className="jt-text-overrun">+{formatMins(logged - planned)} overrun</span>
							)}
						</div>
						<EstimateBar loggedMins={logged} plannedMins={planned} />
					</div>
				)}
				{showRegular && (
					<div className="jt-row">
						<span className={`jt-text-${kind}`}>
							{operation.actual_time_mins > 0 && `${formatMins(operation.actual_time_mins)} logged`}
						</span>
						<span>
							{taskStarted && <span className="jt-elapsed">{elapsed}</span>}
							{operation.employee_time_mins > 0 && ` Your total: ${formatMins(operation.employee_time_mins)}`}
						</span>
					</div>
				)}
				{showRework && (
					<div className="jt-row jt-text-rework">
						<span>
							{operation.corrective_total_time_mins > 0 &&
								`${formatMins(operation.corrective_total_time_mins)} rework`}
						</span>
						<span>
							{reworkStarted && <span className="jt-elapsed">{elapsed}</span>}
							{operation.corrective_employee_time_mins > 0 &&
								` Your total: ${formatMins(operation.corrective_employee_time_mins)}`}
						</span>
					</div>
				)}
			</Tile>
		</div>
	);
}

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
						found={operation.operation === revealed}
						canPin={canPin}
						{...actions}
					/>
				))}
			</div>
		</section>
	);
}
