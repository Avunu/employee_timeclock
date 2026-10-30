// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { describe, expect, it } from "vitest";
import type { TimerEvent } from "./offlineData";
import { replay } from "./replay";
import type { ActiveTimer, MachineTimer } from "./types";

const ME = "me";
const TIME = "2026-10-23 10:00:00";

const event = (action: TimerEvent["action"], overrides: Partial<TimerEvent> = {}): TimerEvent => ({
	id: "e",
	action,
	time: TIME,
	order: 1,
	who: ME,
	work_order: "WO-1",
	operation: "Weld",
	...overrides,
});

const running: ActiveTimer = {
	work_order: "WO-9",
	operation: "Paint",
	from_time: "2026-10-23 09:00:00",
	is_corrective: false,
};

const machine: MachineTimer = {
	work_order: "WO-1",
	operation: "Laser",
	from_time: "2026-10-23 09:00:00",
	employee_group: "Cutters",
	is_corrective: false,
};

describe("replay", () => {
	it("leaves the state alone with nothing queued", () => {
		const state = { activeTimer: running, machineTimers: [machine] };

		expect(replay(state, [], ME)).toEqual(state);
	});

	it("starts a timer, closing the employee's previous one", () => {
		const { activeTimer } = replay({ activeTimer: running, machineTimers: [] }, [event("start")], ME);

		expect(activeTimer).toEqual({
			work_order: "WO-1",
			operation: "Weld",
			from_time: TIME,
			is_corrective: false,
		});
	});

	it("keeps a rework timer's kind", () => {
		const { activeTimer } = replay(
			{ activeTimer: null, machineTimers: [] },
			[event("start", { is_corrective: true })],
			ME,
		);

		expect(activeTimer?.is_corrective).toBe(true);
	});

	it("stops the employee's timer", () => {
		const { activeTimer } = replay({ activeTimer: running, machineTimers: [] }, [event("stop")], ME);

		expect(activeTimer).toBeNull();
	});

	it("ignores another employee's labor events", () => {
		const others = [event("start", { who: "them" }), event("stop", { who: "them" })];

		expect(replay({ activeTimer: running, machineTimers: [] }, others, ME).activeTimer).toEqual(running);
	});

	it("applies events in the order they are given", () => {
		const { activeTimer } = replay(
			{ activeTimer: null, machineTimers: [] },
			[event("start"), event("stop")],
			ME,
		);

		expect(activeTimer).toBeNull();
	});

	it("starts a machine timer, replacing that operation on any work order", () => {
		const { machineTimers, activeTimer } = replay(
			{ activeTimer: running, machineTimers: [machine] },
			[event("start", { work_order: "WO-2", operation: "Laser", machine_group: "Cutters" })],
			ME,
		);

		expect(machineTimers).toEqual([
			{
				work_order: "WO-2",
				operation: "Laser",
				from_time: TIME,
				employee_group: "Cutters",
				is_corrective: false,
			},
		]);
		expect(activeTimer).toEqual(running);
	});

	it("shows a machine timer whoever queued it", () => {
		const { machineTimers } = replay(
			{ activeTimer: null, machineTimers: [] },
			[event("start", { operation: "Laser", machine_group: "Cutters", who: "them" })],
			ME,
		);

		expect(machineTimers).toHaveLength(1);
	});

	it("stops the one machine timer named", () => {
		const other = { ...machine, operation: "Press" };
		const { machineTimers } = replay(
			{ activeTimer: null, machineTimers: [machine, other] },
			[event("stop_machine", { operation: "Laser" })],
			ME,
		);

		expect(machineTimers).toEqual([other]);
	});

	it("takes an event with no work order or operation", () => {
		const { machineTimers } = replay(
			{ activeTimer: null, machineTimers: [machine] },
			[{ id: "e", action: "stop_machine", time: TIME, order: 1, who: ME }],
			ME,
		);

		expect(machineTimers).toEqual([machine]);
	});
});
