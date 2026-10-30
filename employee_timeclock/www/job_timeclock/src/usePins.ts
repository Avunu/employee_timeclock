// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useState } from "react";
import { readStored, writeStored } from "./stored";

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
