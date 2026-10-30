// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useEffect, useState } from "react";
import type { Employee, TrackerSession } from "./useEmployee";
import type { GetOperationsResponse, OfflineSnapshot, Operation, WorkOrder } from "./types";
import { useTrackerData } from "./useTrackerData";

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
