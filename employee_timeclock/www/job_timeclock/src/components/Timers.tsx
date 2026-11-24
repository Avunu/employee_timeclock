// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { elapsedSince, useTick } from "../format";
import { Button, ClickableTile, HeaderGlobalAction } from "@carbon/react";
import { StopFilled } from "@carbon/react/icons";
import type { ActiveTimer as Timer, MachineTimer, WorkOrder } from "../types";

interface SessionStatusProps {
	/** The employee's name, or null for a badge the server hasn't confirmed. */
	name: string | null;
	/** When the sign-in runs out, in ms; 0 if it doesn't. */
	expiry: number;
}

/** For the toolbar: who is signed in, and for how much longer. */
export function SessionStatus({ name, expiry }: SessionStatusProps) {
	const now = useTick(expiry > 0);
	const seconds = Math.max(0, Math.floor((expiry - now) / 1000));
	return (
		<div className="jt-session">
			<strong>{name ?? "Badge not confirmed"}</strong>
			{expiry > 0 && (
				<span>
					Timeout in {Math.floor(seconds / 60)}m {seconds % 60}s
				</span>
			)}
		</div>
	);
}

interface ActiveTimerProps {
	timer: Timer;
	onOpen: () => void;
	onStop: () => void;
}

/** For the toolbar: the employee's running timer, in sight wherever they are in the tracker.
 * Tapping it goes to the job. */
export function ActiveTimer({ timer, onOpen, onStop }: ActiveTimerProps) {
	const now = useTick();
	return (
		<>
			<button
				type="button"
				className={timer.is_corrective ? "jt-running jt-running-rework" : "jt-running"}
				onClick={onOpen}
			>
				<span className="jt-running-name">{timer.operation}</span>
				<span className="jt-elapsed">{elapsedSince(timer.from_time, now)}</span>
				{timer.is_corrective && <span>REWORK</span>}
			</button>
			<HeaderGlobalAction aria-label={timer.is_corrective ? "Stop Rework" : "Stop Timer"} onClick={onStop}>
				<StopFilled size={20} />
			</HeaderGlobalAction>
		</>
	);
}

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
