// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useTick } from "../useTick";

interface SessionStatusProps {
	/** The employee's name, or null for a badge the server hasn't confirmed. */
	name: string | null;
	/** When the sign-in runs out, in ms; 0 if it doesn't. */
	expiry: number;
}

export function SessionStatus({ name, expiry }: SessionStatusProps) {
	const now = useTick(expiry > 0);
	const seconds = Math.max(0, Math.floor((expiry - now) / 1000));
	return (
		<div className="jt-session">
			<strong>{name ?? "Badge not confirmed"}</strong>
			{expiry > 0 && (
				<p className="jt-muted">
					Timeout in {Math.floor(seconds / 60)}m {seconds % 60}s
				</p>
			)}
		</div>
	);
}
