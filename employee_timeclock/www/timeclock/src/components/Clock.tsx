// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useEffect, useState } from "react";

/** The tablet's time and date, large enough to read from the line. */
export function Clock() {
	const [now, setNow] = useState(() => new Date());

	useEffect(() => {
		const interval = window.setInterval(() => setNow(new Date()), 1000);
		return () => window.clearInterval(interval);
	}, []);

	return (
		<div className="tc-clock">
			<div className="tc-clock-time">
				{now.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
			</div>
			<div className="tc-clock-date">
				{now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" })}
			</div>
		</div>
	);
}
