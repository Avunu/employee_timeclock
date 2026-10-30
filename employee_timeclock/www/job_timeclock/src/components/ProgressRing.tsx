// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

const RADIUS = 18;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

interface ProgressRingProps {
	loggedMins: number;
	plannedMins: number;
}

/** A work order's time at a glance: an arc of its estimate, or a solid red ring once over it. */
export function ProgressRing({ loggedMins, plannedMins }: ProgressRingProps) {
	const overrun = loggedMins > plannedMins;
	const share = overrun ? 1 : loggedMins / plannedMins;
	return (
		<svg
			className="jt-ring"
			viewBox="0 0 48 48"
			role="img"
			aria-label={`${Math.round(share * 100)}% of the estimate`}
		>
			<circle className="jt-ring-track" cx="24" cy="24" r={RADIUS} />
			<circle
				className={overrun ? "jt-ring-arc jt-ring-arc-overrun" : "jt-ring-arc"}
				cx="24"
				cy="24"
				r={RADIUS}
				strokeDasharray={`${share * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
				transform="rotate(-90 24 24)"
			/>
		</svg>
	);
}
