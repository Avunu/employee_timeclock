// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useEffect, useState } from "react";

/** The time now, updated every second while `running`, for showing how long a timer has run. */
export function useTick(running = true): number {
	const [now, setNow] = useState(() => Date.now());

	useEffect(() => {
		if (!running) return undefined;
		setNow(Date.now());
		const interval = window.setInterval(() => setNow(Date.now()), 1000);
		return () => window.clearInterval(interval);
	}, [running]);

	return now;
}
