// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { Employee, TrackerRequest } from "./useEmployee";
import type {
	GetOperationsResponse,
	GetWorkOrdersResponse,
	OfflineSnapshot,
	Operation,
	WorkOrder,
} from "./types";

const NO_OPERATIONS: Operation[] = [];

/** What an employee may see of a work order's operations: machine ones are their group's only. */
function visibleTo(operations: Operation[], groups: string[]): Operation[] {
	return operations.filter(
		(operation) => !operation.is_machine_time || groups.includes(operation.employee_group ?? ""),
	);
}

interface WorkOptions {
	employee: Employee | null;
	/** The Employee Groups whose machine operations this employee sees. */
	groups: string[];
	request: TrackerRequest;
	canCall: () => boolean;
	online: boolean;
	snapshot: OfflineSnapshot | undefined;
	workstations: string[];
}

/** The work orders, the selected one, and each one's operations: live, or as last seen offline. */
export function useWork({ employee, groups, request, canCall, online, snapshot, workstations }: WorkOptions) {
	const [liveOrders, setLiveOrders] = useState<WorkOrder[] | null>(null);
	const [selected, setSelected] = useState<WorkOrder | null>(null);
	const [cache, setCache] = useState<Record<string, Operation[]>>({});
	const live = online && canCall();
	const offlineSource = useRef({ snapshot, groups });
	useEffect(() => {
		offlineSource.current = { snapshot, groups };
	}, [snapshot, groups]);

	const workOrders = useMemo(
		() => (live && liveOrders ? liveOrders : (snapshot?.work_orders ?? liveOrders ?? [])),
		[live, liveOrders, snapshot],
	);

	const refreshOrders = useCallback(async () => {
		const answer = await request<GetWorkOrdersResponse>(
			"get_work_orders",
			{},
			"The work orders couldn't be loaded.",
		);
		if (answer.ok) setLiveOrders(answer.data.work_orders ?? []);
	}, [request]);

	const loadOperations = useCallback(
		async (workOrder: string) => {
			const answer = canCall()
				? await request<GetOperationsResponse>(
						"get_operations",
						{ work_order: workOrder, workstations: JSON.stringify(workstations) },
						"The job cards couldn't be loaded.",
					)
				: ({ ok: false, offline: true } as const);
			if (answer.ok) {
				setCache((known) => ({ ...known, [workOrder]: answer.data.operations ?? [] }));
			} else if (answer.offline) {
				const source = offlineSource.current;
				const kept = source.snapshot?.operations[workOrder];
				if (kept) {
					setCache((known) => ({ ...known, [workOrder]: visibleTo(kept, source.groups) }));
				}
			}
		},
		[canCall, request, workstations],
	);

	const select = useCallback(
		async (workOrder: WorkOrder | null) => {
			setSelected(workOrder);
			if (workOrder) await loadOperations(workOrder.name);
		},
		[loadOperations],
	);

	/** Select a work order by name, if it is still open. */
	const selectByName = useCallback(
		async (name: string) => {
			const found = workOrders.find((workOrder) => workOrder.name === name);
			if (found) await select(found);
		},
		[workOrders, select],
	);

	const reset = useCallback(() => {
		setLiveOrders(null);
		setSelected(null);
		setCache({});
	}, []);

	const employeeKey = employee?.key;
	useEffect(() => {
		if (!employeeKey) reset();
	}, [employeeKey, reset]);

	return {
		workOrders,
		selected,
		operations: (selected && cache[selected.name]) ?? NO_OPERATIONS,
		cache,
		select,
		selectByName,
		loadOperations,
		refreshOrders,
	};
}
