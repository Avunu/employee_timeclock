// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { Tag } from "@carbon/react";

interface KioskStatusProps {
	online: boolean;
	waiting: number;
	/** What is waiting, one and many. */
	noun?: readonly [string, string];
}

/** For the toolbar: whether the kiosk is offline, and how many things are waiting to be sent. */
export function KioskStatus({ online, waiting, noun = ["punch", "punches"] }: KioskStatusProps) {
	return (
		<div className="tc-status" role="status" aria-live="polite">
			{!online && <Tag type="red">Offline</Tag>}
			{waiting > 0 && (
				<Tag type="cool-gray">{waiting === 1 ? `1 ${noun[0]} waiting` : `${waiting} ${noun[1]} waiting`}</Tag>
			)}
		</div>
	);
}
