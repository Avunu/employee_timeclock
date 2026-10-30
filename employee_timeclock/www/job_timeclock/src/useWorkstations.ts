// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useCallback, useEffect, useState } from "react";
import { readStored, writeStored } from "./stored";
import type { TrackerRequest } from "./useEmployee";
import type { GetDeviceInfoResponse, GetWorkstationsResponse, OfflineSnapshot } from "./types";

const WORKSTATIONS = "workstations";

/** The workstations this tablet stands at, kept on the tablet, and the ones there are to choose. */
export function useWorkstations(request: TrackerRequest, snapshot: OfflineSnapshot | undefined) {
	const [chosen, setChosen] = useState(() => readStored<string[]>(WORKSTATIONS, []));
	const [live, setLive] = useState<string[] | null>(null);
	const [device, setDevice] = useState({ ip: "", mac: "" });

	useEffect(() => {
		let current = true;
		void request<GetWorkstationsResponse>(
			"get_workstations",
			{},
			"The workstations couldn't be loaded.",
		).then((answer) => {
			if (current && answer.ok) setLive(answer.data.workstations);
		});
		return () => {
			current = false;
		};
	}, [request]);

	const toggle = useCallback((workstation: string, checked: boolean) => {
		setChosen((stations) => {
			const others = stations.filter((station) => station !== workstation);
			const next = checked ? [...others, workstation] : others;
			writeStored(WORKSTATIONS, next);
			return next;
		});
	}, []);

	const loadDevice = useCallback(async () => {
		const answer = await request<GetDeviceInfoResponse>(
			"get_device_info",
			{},
			"The device's address couldn't be loaded.",
		);
		if (answer.ok) setDevice({ ip: answer.data.ip, mac: answer.data.mac });
	}, [request]);

	return {
		chosen,
		available: live ?? snapshot?.workstations ?? [],
		toggle,
		device,
		loadDevice,
	};
}
