// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useState } from "react";
import { readStored, writeStored } from "./stored";

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
