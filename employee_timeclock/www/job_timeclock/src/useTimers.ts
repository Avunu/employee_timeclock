// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { rememberServerTime, serverNow } from "../../../public/js/kiosk/clock";
import { useToasts } from "../../../public/js/kiosk/Toasts";
import type { BackendResult } from "../../../public/js/kiosk/useBackendCall";
import { connectSocket } from "./socket";
import { rememberEmployee, type TimerEvent } from "./offlineData";
import { replay } from "./replay";
import type { Employee, TrackerRequest } from "./useEmployee";
import type {
	ActiveTimer,
	GetActiveTimerResponse,
	GetMachineTimersResponse,
	MachineTimer,
	OfflineSnapshot,
	Operation,
	StartTimerResponse,
	StopMachineTimerResponse,
	StopTimerResponse,
} from "./types";

const sameTimer = (a: MachineTimer, b: MachineTimer): boolean =>
	a.work_order === b.work_order && a.operation === b.operation;

interface TimerUpdate {
	action?: string;
	timer?: MachineTimer;
}

interface TimerOptions {
	employee: Employee | null;
	request: TrackerRequest;
	canCall: () => boolean;
	touch: () => void;
	online: boolean;
	waiting: number;
	events: TimerEvent[];
	keep: (event: TimerEvent) => Promise<void>;
	snapshot: OfflineSnapshot | undefined;
	/** After a timer stopped on a work order, whose totals have changed. */
	onStopped: (workOrder: string) => void;
}

/**
 * The running timers, and starting and stopping them. Every action has its own id and a time on
 * the server's clock. It goes to the server when it can, and otherwise waits on the tablet under
 * that same id, so a call whose answer was lost is still recorded once. While anything is waiting
 * new actions wait behind it, so they can't overtake each other. What the screen shows is the last
 * server state with what is waiting replayed on top (replay.ts).
 */
export function useTimers({
	employee,
	request,
	canCall,
	touch,
	online,
	waiting,
	events,
	keep,
	snapshot,
	onStopped,
}: TimerOptions) {
	const showToast = useToasts();
	const [activeTimer, setActiveTimer] = useState<ActiveTimer | null>(null);
	const [machineTimers, setMachineTimers] = useState<MachineTimer[]>([]);
	const [groups, setGroups] = useState<string[]>([]);
	const key = employee?.key;
	const who = key ?? "";
	const id = employee?.id;
	const name = employee?.name;
	const badge = employee?.badge;
	const live = online && canCall();
	const groupsRef = useRef(groups);
	useEffect(() => {
		groupsRef.current = groups;
	}, [groups]);

	const refresh = useCallback(async () => {
		const [active, machine] = await Promise.all([
			request<GetActiveTimerResponse>("get_active_timer", {}, "The running timer couldn't be loaded."),
			request<GetMachineTimersResponse>("get_machine_timers", {}, "The machine timers couldn't be loaded."),
		]);
		if (active.ok) setActiveTimer(active.data.active_timer ?? null);
		if (machine.ok) {
			setMachineTimers(machine.data.machine_timers ?? []);
			setGroups(machine.data.employee_groups ?? []);
		}
		if (key && id && name && active.ok && machine.ok) {
			await rememberEmployee({
				id: key,
				employee_id: id,
				employee_name: name,
				employee_groups: machine.data.employee_groups ?? [],
				active_timer: active.data.active_timer ?? null,
			});
		}
	}, [request, key, id, name]);

	// Whoever signed in: from the server if it can be reached, or as this tablet last saw them.
	useEffect(() => {
		if (!employee) {
			setActiveTimer(null);
			setMachineTimers([]);
			setGroups([]);
		} else if (live) {
			void refresh();
		} else if (employee.lastTimer !== undefined) {
			// Signed in offline. Losing the connection mid-session keeps what is already here.
			setActiveTimer(employee.lastTimer);
			setGroups(employee.groups);
		}
	}, [employee, live, refresh]);

	useEffect(() => {
		if (!key || live || !snapshot) return;
		setMachineTimers(snapshot.machine_timers.filter((timer) => groups.includes(timer.employee_group)));
	}, [key, live, snapshot, groups]);

	// Machine timers belong to whole groups, so other tablets' changes arrive by realtime event.
	useEffect(() => {
		if (!key || !online) return undefined;
		const socket = connectSocket();
		socket.on("machine_timer_update", (update: TimerUpdate | null) => {
			const timer = update?.timer;
			if (!timer) return;
			if (update.action === "start") {
				if (!groupsRef.current.includes(timer.employee_group)) return;
				setMachineTimers((timers) => [
					// The operation may have moved here from another work order.
					...timers.filter((other) => other.operation !== timer.operation),
					timer,
				]);
			} else if (update.action === "stop") {
				setMachineTimers((timers) => timers.filter((other) => !sameTimer(other, timer)));
				onStopped(timer.work_order);
			}
		});
		// Events sent while the socket was down are gone.
		socket.on("connect", () => void refresh());
		return () => {
			socket.disconnect();
		};
	}, [key, online, onStopped, refresh]);

	const send = useCallback(
		async <T extends { status: string; error?: string | null; server_time?: string | null }>(
			event: TimerEvent,
			call: () => Promise<BackendResult<T>>,
			failure: string,
			succeeded: (answer: T) => void,
		) => {
			touch();
			const answer = live && waiting === 0 ? await call() : ({ ok: false, offline: true } as const);
			if (answer.ok) {
				if (answer.data.status === "success") {
					if (answer.data.server_time) rememberServerTime(answer.data.server_time);
					succeeded(answer.data);
				} else {
					showToast({ kind: "error", title: failure });
				}
				return true;
			}
			if (answer.offline) await keep(event);
			return answer.offline;
		},
		[live, waiting, keep, showToast, touch],
	);

	const base = useCallback(
		(action: TimerEvent["action"]): TimerEvent => ({
			id: crypto.randomUUID(),
			action,
			time: serverNow(),
			order: Date.now(),
			who,
			...(badge !== undefined && { badge }),
		}),
		[who, badge],
	);

	const start = useCallback(
		async (workOrder: string, operation: Operation, isCorrective: boolean) => {
			const label = operation.operation;
			const machine = operation.is_machine_time;
			const event: TimerEvent = {
				...base("start"),
				work_order: workOrder,
				operation: label,
				is_corrective: isCorrective,
				...(machine && { machine_group: operation.employee_group ?? "" }),
			};
			const done = await send<StartTimerResponse>(
				event,
				() =>
					request(
						"start_timer",
						{
							work_order: workOrder,
							operation: label,
							start_time: event.time,
							is_corrective: isCorrective,
							event_id: event.id,
						},
						`${label} failed to start.`,
					),
				`${label} failed to start.`,
				() => {
					if (machine) void refresh();
					else {
						setActiveTimer({
							work_order: workOrder,
							operation: label,
							from_time: event.time,
							is_corrective: isCorrective,
						});
					}
				},
			);
			if (done && isCorrective) showToast({ kind: "success", title: `Rework started for ${label}.` });
		},
		[base, send, request, refresh, showToast],
	);

	const stopMachine = useCallback(
		async (workOrder: string, operation: string) => {
			const event: TimerEvent = {
				...base("stop_machine"),
				work_order: workOrder,
				operation,
			};
			return send<StopMachineTimerResponse>(
				event,
				() =>
					request(
						"stop_machine_timer",
						{
							work_order: workOrder,
							operation,
							end_time: event.time,
							event_id: event.id,
						},
						`${operation} machine timer failed to stop.`,
					),
				`${operation} machine timer failed to stop.`,
				() => {
					setMachineTimers((timers) =>
						timers.filter((timer) => timer.work_order !== workOrder || timer.operation !== operation),
					);
					onStopped(workOrder);
				},
			);
		},
		[base, send, request, onStopped],
	);

	const stop = useCallback(
		async (
			workOrder: string,
			operation: Pick<Operation, "operation" | "is_machine_time">,
			isCorrective: boolean,
		) => {
			const label = operation.operation;
			const done = operation.is_machine_time
				? await stopMachine(workOrder, label)
				: await (async () => {
						const event = base("stop");
						return send<StopTimerResponse>(
							event,
							() =>
								request(
									"stop_timer",
									{ end_time: event.time, event_id: event.id },
									`${label} failed to stop.`,
								),
							`${label} failed to stop.`,
							() => {
								setActiveTimer(null);
								onStopped(workOrder);
							},
						);
					})();
			if (done && isCorrective) showToast({ kind: "success", title: `Rework completed for ${label}.` });
		},
		[base, send, request, onStopped, stopMachine, showToast],
	);

	const shown = useMemo(
		() => replay({ activeTimer, machineTimers }, events, who),
		[activeTimer, machineTimers, events, who],
	);

	return { ...shown, groups, start, stop, stopMachine, refresh };
}
