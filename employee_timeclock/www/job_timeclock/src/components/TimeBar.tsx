// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import type { Progress } from "../format";

interface TimeBarProps {
	progress: Progress;
	/** The bar's colour for time within the estimate. */
	kind: "labor" | "machine";
}

/** Time logged against an estimate. Over the estimate, the bar splits: planned, then overrun in red. */
export function TimeBar({ progress, kind }: TimeBarProps) {
	return (
		<div className="jt-bar" role="img" aria-label={`${progress.percent}% of the estimate`}>
			<div className={`jt-bar-fill jt-bar-fill-${kind}`} style={{ width: `${progress.percent}%` }} />
			{progress.isOverrun && (
				<div className="jt-bar-fill jt-bar-fill-overrun" style={{ width: `${progress.overrun}%` }} />
			)}
		</div>
	);
}
