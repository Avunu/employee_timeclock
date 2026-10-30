// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useEffect, useState } from "react";
import { type Employee, type TrackerSession, useTrackerData } from "./useEmployee";
import type { GetOperationsResponse, OfflineSnapshot, Operation, WorkOrder } from "./types";

/** A value kept in localStorage as JSON, or `fallback` if there is none, or it can't be read. */
export function readStored<T>(key: string, fallback: T): T {
	try {
		const kept = window.localStorage.getItem(key);
		// What this page wrote itself.
		// oxlint-disable-next-line typescript/no-unsafe-type-assertion
		return kept === null ? fallback : (JSON.parse(kept) as T);
	} catch {
		return fallback;
	}
}

export function writeStored(key: string, value: unknown): void {
	window.localStorage.setItem(key, JSON.stringify(value));
}

const NO_ORDERS: WorkOrder[] = [];
const NO_OPERATIONS: Operation[] = [];

/** What an employee may see of a work order's operations: machine ones are their group's only. */
export function visibleTo(operations: Operation[], groups: string[]): Operation[] {
	return operations.filter(
		(operation) => !operation.is_machine_time || groups.includes(operation.employee_group ?? ""),
	);
}

interface WorkOptions {
	employee: Employee | null;
	session: TrackerSession;
	snapshot: OfflineSnapshot | undefined;
	workstations: string[];
}

/** The work orders and the selected one's operations: with the employee's own totals when the
 * server can be asked, or as last seen. */
export function useWork({ employee, session, snapshot, workstations }: WorkOptions) {
	const [selected, setSelected] = useState<WorkOrder | null>(null);
	const workOrders = snapshot?.work_orders ?? NO_ORDERS;

	const { data, mutate } = useTrackerData<GetOperationsResponse>(
		session,
		"get_operations",
		employee && selected ? `operations:${employee.key}:${selected.name}` : null,
		{ work_order: selected?.name, workstations: JSON.stringify(workstations) },
	);

	/** Select a work order by name, if it is still open. */
	const selectByName = useCallback(
		(name: string) => {
			const found = workOrders.find((workOrder) => workOrder.name === name);
			if (found) setSelected(found);
		},
		[workOrders],
	);

	const signedIn = employee !== null;
	useEffect(() => {
		if (!signedIn) setSelected(null);
	}, [signedIn]);

	const refreshOperations = useCallback(() => void mutate(), [mutate]);

	return {
		workOrders,
		selected,
		operations:
			data?.message.operations ?? (selected && snapshot?.operations[selected.name]) ?? NO_OPERATIONS,
		select: setSelected,
		selectByName,
		refreshOperations,
	};
}

const PINS = "pinnedCards";
const SEPARATOR = "::";

export interface Pin {
	workOrder: string;
	operation: string;
}

const pinKey = (workOrder: string, operation: string): string => `${workOrder}${SEPARATOR}${operation}`;

function readPin(key: string): Pin | null {
	const at = key.indexOf(SEPARATOR);
	if (at === -1) return null;
	return { workOrder: key.slice(0, at), operation: key.slice(at + SEPARATOR.length) };
}

/** The job cards each employee pinned, kept on the tablet. An unconfirmed badge has none. */
export function usePins(employeeId: string | null | undefined) {
	const [all, setAll] = useState(() => readStored<Record<string, string[]>>(PINS, {}));
	const keys = employeeId ? (all[employeeId] ?? []) : [];

	const toggle = useCallback(
		(workOrder: string, operation: string) => {
			if (!employeeId) return;
			const key = pinKey(workOrder, operation);
			setAll((pins) => {
				const mine = pins[employeeId] ?? [];
				const next = {
					...pins,
					[employeeId]: mine.includes(key) ? mine.filter((pin) => pin !== key) : [...mine, key],
				};
				writeStored(PINS, next);
				return next;
			});
		},
		[employeeId],
	);

	return {
		pins: keys.map(readPin).filter((pin) => pin !== null),
		isPinned: (workOrder: string, operation: string) => keys.includes(pinKey(workOrder, operation)),
		toggle,
	};
}

const WORKSTATIONS = "workstations";

/** The workstations this tablet stands at, kept on the tablet. */
export function useWorkstations() {
	const [chosen, setChosen] = useState(() => readStored<string[]>(WORKSTATIONS, []));

	const toggle = useCallback((workstation: string, checked: boolean) => {
		setChosen((stations) => {
			const others = stations.filter((station) => station !== workstation);
			const next = checked ? [...others, workstation] : others;
			writeStored(WORKSTATIONS, next);
			return next;
		});
	}, []);

	return { chosen, toggle };
}
