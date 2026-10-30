// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

// A stand-in for the tracker's backend, with the state a test can read and change.

import { respond, stubFetch } from "../../../../public/js/kiosk/test/server";
import { METHOD } from "../offline";
import type { ActiveTimer, MachineTimer, OfflineSnapshot, Operation, WorkOrder } from "../types";

export const SERVER_TIME = "2026-10-23 14:05:00";
export const BADGE = "RFID1234";

/** A token for Maria Lopez, running out in `minutes` from Friday 23 October 2026, 14:00. */
export function tokenFor(minutes = 30): string {
	const exp = Math.floor(new Date(2026, 9, 23, 14, minutes).getTime() / 1000);
	const payload = btoa(JSON.stringify({ exp, employee_id: "HR-EMP-1", employee_name: "Maria Lopez" }));
	return `header.${payload}.signature`;
}

export const workOrder = (name: string, overrides: Partial<WorkOrder> = {}): WorkOrder => ({
	name,
	production_item: `Item of ${name}`,
	status: "In Process",
	planned_time_mins: 0,
	logged_time_mins: 0,
	...overrides,
});

export const operation = (name: string, overrides: Partial<Operation> = {}): Operation => ({
	name: `row-${name}`,
	operation: name,
	workstation: "Bench",
	planned_time_mins: 0,
	actual_time_mins: 0,
	employee_time_mins: 0,
	corrective_total_time_mins: 0,
	corrective_employee_time_mins: 0,
	is_submitted: false,
	is_machine_time: false,
	...overrides,
});

export interface TrackerServer {
	reachable: boolean;
	/** A session employee, for a page opened by an employee's own login. */
	sessionEmployee: { employee_id: string; employee_name: string } | null;
	badges: string[];
	workOrders: WorkOrder[];
	operations: Record<string, Operation[]>;
	activeTimer: ActiveTimer | null;
	machineTimers: MachineTimer[];
	groups: string[];
	workstations: string[];
	/** What a timer method answers: a failure's error, or success. */
	timerError: string | null;
	/** Answer with an HTTP error instead, by method (without its module). */
	statusFor: Record<string, number>;
	/** Answer with nothing but the status, as the server may for what it has none of. */
	sparse: boolean;
	/** Answer `{status: "error"}`, by method: a token the server no longer takes. */
	deadFor: string[];
	/** Method name to the args of each call. */
	calls: Record<string, Record<string, unknown>[]>;
}

export function trackerServer(overrides: Partial<TrackerServer> = {}): TrackerServer {
	const server: TrackerServer = {
		reachable: true,
		sessionEmployee: null,
		badges: [BADGE],
		workOrders: [workOrder("WO-1"), workOrder("WO-2")],
		operations: { "WO-1": [operation("Weld")], "WO-2": [operation("Paint")] },
		activeTimer: null,
		machineTimers: [],
		groups: [],
		workstations: ["Bench", "Booth"],
		timerError: null,
		statusFor: {},
		sparse: false,
		deadFor: [],
		calls: {},
		...overrides,
	};

	stubFetch(async (path, args) => {
		if (!server.reachable) throw new TypeError("Failed to fetch");
		const method = path.replace(`${METHOD}.`, "");
		(server.calls[method] ??= []).push(args);
		const status = server.statusFor[method];
		if (status) return respond(status, {});
		if (server.deadFor.includes(method)) return respond(200, { message: { status: "error" } });
		const answer = (message: unknown) => respond(200, { message });
		const timerAnswer = () =>
			answer(
				server.timerError
					? { status: "failed", error: server.timerError }
					: { status: "success", server_time: SERVER_TIME },
			);
		const token = tokenFor();
		if (server.sparse && method !== "sync_timer_events" && method !== "get_offline_snapshot") {
			if (method === "authenticate_employee" && server.badges.includes(String(args["rfid"]))) {
				return answer({ status: "success", token });
			}
			if (method === "get_operations") return answer({ status: "success" });
			if (method === "get_user_session_employee") {
				return answer({ user_id: "me@example.com", employee_id: "HR-EMP-3" });
			}
			return answer({ status: "success" });
		}

		switch (method) {
			case "get_user_session_employee":
				return answer(server.sessionEmployee ?? { user_id: "kiosk@example.com" });
			case "authenticate_employee":
				return answer(
					server.badges.includes(String(args["rfid"]))
						? { status: "success", token }
						: { status: "error", message: "Badge not recognised." },
				);
			case "get_operations":
				return answer({
					status: "success",
					// An employee's own login has no token to refresh.
					token: server.sessionEmployee ? null : token,
					operations: server.operations[String(args["work_order"])] ?? [],
				});
			case "get_active_timer":
				return answer({ status: "success", active_timer: server.activeTimer });
			case "get_machine_timers":
				return answer({
					status: "success",
					machine_timers: server.machineTimers.filter((timer) =>
						server.groups.includes(timer.employee_group),
					),
					employee_groups: server.groups,
				});
			case "get_device_info":
				return answer({ status: "success", ip: "10.0.0.7", mac: "aa:bb" });
			case "get_offline_snapshot": {
				const snapshot: OfflineSnapshot = {
					status: "success",
					server_time: SERVER_TIME,
					work_orders: server.workOrders,
					operations: server.operations,
					machine_timers: server.machineTimers,
					workstations: server.workstations,
				};
				return answer(snapshot);
			}
			case "sync_timer_events": {
				const events = args["events"] as { id: string }[];
				return answer({
					results: events.map(({ id }) => ({ id, status: "recorded" })),
					server_time: SERVER_TIME,
				});
			}
			case "stop_machine_timer":
				if (!server.timerError) {
					server.machineTimers = server.machineTimers.filter(
						(timer) => timer.operation !== args["operation"],
					);
				}
				return timerAnswer();
			default:
				return timerAnswer();
		}
	});

	return server;
}
