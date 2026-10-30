// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useEffect, useMemo } from "react";
import { rememberServerTime, serverNow } from "../../shared/clock";
import { useToasts } from "../../shared/Toasts";
import type { BackendResult } from "../../shared/useBackendCall";
import { rememberEmployee, type TimerEvent } from "./offline";
import { replay } from "./offline";
import type { Employee, TrackerRequest, TrackerSession } from "./useEmployee";
import type {
	ActiveTimer,
	GetActiveTimerResponse,
	GetMachineTimersResponse,
	OfflineSnapshot,
	Operation,
	StartTimerResponse,
	StopMachineTimerResponse,
	StopTimerResponse,
} from "./types";
import { useTrackerData } from "./useEmployee";

interface TimerAnswer {
	status: string;
	error?: string | null;
	server_time?: string | null;
}

interface TimerOptions {
	employee: Employee | null;
	session: TrackerSession;
	request: TrackerRequest;
	touch: () => void;
	live: boolean;
	waiting: number;
	events: TimerEvent[];
	keep: (event: TimerEvent) => Promise<void>;
	snapshot: OfflineSnapshot | undefined;
	/** After a timer stopped, which changes the totals on screen. */
	onStopped: () => void;
}

/**
 * The running timers, and starting and stopping them. Every action has its own id and a time on
 * the server's clock. It goes to the server when it can, and otherwise waits on the tablet under
 * that same id, so a call whose answer was lost is still recorded once. While anything is waiting
 * new actions wait behind it, so they can't overtake each other. What the screen shows is the last
 * server state with what is waiting replayed on top (replay, in offline.ts).
 */
export function useTimers({
	employee,
	session,
	request,
	touch,
	live,
	waiting,
	events,
	keep,
	snapshot,
	onStopped,
}: TimerOptions) {
	const showToast = useToasts();
	const who = employee?.key ?? "";
	const badge = employee?.badge;

	const active = useTrackerData<GetActiveTimerResponse>(
		session,
		"get_active_timer",
		employee && `active:${who}`,
	);
	const machines = useTrackerData<GetMachineTimersResponse>(
		session,
		"get_machine_timers",
		employee && `machines:${who}`,
	);
	const setActiveTimer = active.mutate;
	const refreshMachines = machines.mutate;

	const activeTimer = active.data
		? (active.data.message.active_timer ?? null)
		: (employee?.lastTimer ?? null);
	const groups = machines.data?.message.employee_groups ?? employee?.groups ?? [];
	const known = machines.data?.message.machine_timers;
	const machineTimers = useMemo(
		() => known ?? snapshot?.machine_timers.filter((timer) => groups.includes(timer.employee_group)) ?? [],
		[known, snapshot, groups],
	);

	// Remember them for signing in offline.
	const id = employee?.id;
	const name = employee?.name;
	const answered = active.data && machines.data;
	useEffect(() => {
		if (who && id && name && answered) {
			void rememberEmployee({
				id: who,
				employee_id: id,
				employee_name: name,
				employee_groups: groups,
				active_timer: activeTimer,
			});
		}
	}, [who, id, name, answered, groups, activeTimer]);

	const send = useCallback(
		async <T extends TimerAnswer>(
			event: TimerEvent,
			call: () => Promise<BackendResult<T>>,
			failure: string,
			succeeded: () => void,
		) => {
			touch();
			const answer = live && waiting === 0 ? await call() : ({ ok: false, offline: true } as const);
			if (answer.ok) {
				if (answer.data.status === "success") {
					if (answer.data.server_time) rememberServerTime(answer.data.server_time);
					succeeded();
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

	const showActive = useCallback(
		(timer: ActiveTimer | null) =>
			void setActiveTimer({ message: { status: "success", active_timer: timer } }, { revalidate: false }),
		[setActiveTimer],
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
			const failure = `${label} failed to start.`;
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
						failure,
					),
				failure,
				() => {
					if (machine) void refreshMachines();
					else {
						showActive({
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
		[base, send, request, refreshMachines, showActive, showToast],
	);

	const stopMachine = useCallback(
		async (workOrder: string, operation: string) => {
			const event: TimerEvent = { ...base("stop_machine"), work_order: workOrder, operation };
			const failure = `${operation} machine timer failed to stop.`;
			return send<StopMachineTimerResponse>(
				event,
				() =>
					request(
						"stop_machine_timer",
						{ work_order: workOrder, operation, end_time: event.time, event_id: event.id },
						failure,
					),
				failure,
				() => {
					void refreshMachines();
					onStopped();
				},
			);
		},
		[base, send, request, refreshMachines, onStopped],
	);

	const stopLabor = useCallback(
		async (label: string) => {
			const event = base("stop");
			const failure = `${label} failed to stop.`;
			return send<StopTimerResponse>(
				event,
				() => request("stop_timer", { end_time: event.time, event_id: event.id }, failure),
				failure,
				() => {
					showActive(null);
					onStopped();
				},
			);
		},
		[base, send, request, showActive, onStopped],
	);

	const stop = useCallback(
		async (
			workOrder: string,
			operation: Pick<Operation, "operation" | "is_machine_time">,
			isCorrective: boolean,
		) => {
			const label = operation.operation;
			const done = operation.is_machine_time ? await stopMachine(workOrder, label) : await stopLabor(label);
			if (done && isCorrective) showToast({ kind: "success", title: `Rework completed for ${label}.` });
		},
		[stopMachine, stopLabor, showToast],
	);

	const refresh = useCallback(() => {
		void active.mutate();
		void refreshMachines();
	}, [active, refreshMachines]);

	const shown = useMemo(
		() => replay({ activeTimer, machineTimers }, events, who),
		[activeTimer, machineTimers, events, who],
	);

	return { ...shown, groups, start, stop, stopMachine, refresh };
}
