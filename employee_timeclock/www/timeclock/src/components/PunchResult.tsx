// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { Tag, Tile } from "@carbon/react";
import type { KioskPunch } from "../types";

/** The punch just recorded: whose it was, IN or OUT, and their hours so far this week. */
export function PunchResult({ punch }: { punch: KioskPunch }) {
	const clockedIn = punch.log_type === "IN";
	return (
		<Tile className="tc-result" role="status">
			<Tag type={clockedIn ? "green" : "red"} size="lg">
				{clockedIn ? "Clocked in" : "Clocked out"}
			</Tag>
			<div className="tc-result-name">{punch.employee_name}</div>
			<div className="tc-result-hours">{punch.weekly_hours} hours this week</div>
		</Tile>
	);
}

/** A punch the tablet kept because it couldn't reach the server: it goes with the next sync. */
export function SavedPunch() {
	return (
		<Tile className="tc-result" role="status">
			<Tag type="cool-gray" size="lg">
				Punch saved
			</Tag>
			<div className="tc-result-hours">It will be sent when the tablet is back online.</div>
		</Tile>
	);
}
