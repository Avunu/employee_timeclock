// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { ProgressBar } from "@carbon/react";

interface EstimateBarProps {
	loggedMins: number;
	plannedMins: number;
}

/** Time logged against an estimate, in red once over it. */
export function EstimateBar({ loggedMins, plannedMins }: EstimateBarProps) {
	return (
		<ProgressBar
			size="small"
			hideLabel
			label="Time logged against the estimate"
			max={plannedMins}
			value={Math.min(loggedMins, plannedMins)}
			{...(loggedMins > plannedMins && { status: "error" as const })}
		/>
	);
}
