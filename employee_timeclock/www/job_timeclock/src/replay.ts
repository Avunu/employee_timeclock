// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import type { TimerEvent } from "./offlineData";
import type { ActiveTimer, MachineTimer } from "./types";

export interface TimerState {
	activeTimer: ActiveTimer | null;
	machineTimers: MachineTimer[];
}

const sameTimer = (timer: MachineTimer, workOrder?: string, operation?: string): boolean =>
	timer.work_order === workOrder && timer.operation === operation;

/**
 * What the screen shows: the last state the server gave, with the events still waiting on the
 * tablet applied on top, the way the server will apply them at sync. `who` is the employee at the
 * tablet: other employees' events change only the machine timers, which everyone shares.
 */
export function replay(state: TimerState, events: TimerEvent[], who: string): TimerState {
	let { activeTimer, machineTimers } = state;
	for (const event of events) {
		const { action, work_order: workOrder = "", operation = "" } = event;
		if (action === "stop_machine") {
			machineTimers = machineTimers.filter((timer) => !sameTimer(timer, workOrder, operation));
		} else if (action === "start" && event.machine_group !== undefined) {
			// Starting a machine timer closes whatever ran on that operation, on any work order.
			machineTimers = [
				...machineTimers.filter((timer) => timer.operation !== operation),
				{
					work_order: workOrder,
					operation,
					from_time: event.time,
					employee_group: event.machine_group,
					is_corrective: Boolean(event.is_corrective),
				},
			];
		} else if (event.who === who) {
			// A start closes the employee's previous timer, as the server does.
			activeTimer =
				action === "start"
					? {
							work_order: workOrder,
							operation,
							from_time: event.time,
							is_corrective: Boolean(event.is_corrective),
						}
					: null;
		}
	}
	return { activeTimer, machineTimers };
}
