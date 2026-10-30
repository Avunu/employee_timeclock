// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { Button, ClickableTile } from "@carbon/react";
import { StopFilled } from "@carbon/react/icons";
import { elapsedSince } from "../format";
import type { MachineTimer, WorkOrder } from "../types";
import { useTick } from "../useTick";

interface MachineTimerBarProps {
	timers: MachineTimer[];
	workOrders: WorkOrder[];
	onOpen: (timer: MachineTimer) => void;
	onStop: (timer: MachineTimer) => void;
}

/** Every machine timer running for the employee's groups, along the bottom of the screen. */
export function MachineTimerBar({ timers, workOrders, onOpen, onStop }: MachineTimerBarProps) {
	const now = useTick(timers.length > 0);
	if (timers.length === 0) return null;
	return (
		<footer className="jt-machines">
			{timers.map((timer) => (
				<div key={`${timer.work_order}:${timer.operation}`} className="jt-machine">
					<ClickableTile
						className={timer.is_corrective ? "jt-card jt-card-rework" : "jt-card jt-card-machine"}
						onClick={() => onOpen(timer)}
					>
						<strong>
							{timer.operation}
							{timer.is_corrective && " (Rework)"}
						</strong>{" "}
						<span className="jt-elapsed">
							{timer.from_time ? elapsedSince(timer.from_time, now) : "00:00:00"}
						</span>
						<p className="jt-muted">
							{workOrders.find((workOrder) => workOrder.name === timer.work_order)?.production_item}
						</p>
					</ClickableTile>
					<Button
						kind="ghost"
						size="2xl"
						hasIconOnly
						renderIcon={StopFilled}
						iconDescription="Stop Machine Timer"
						onClick={() => onStop(timer)}
					/>
				</div>
			))}
		</footer>
	);
}
