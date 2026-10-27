// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { Tag } from "@carbon/react";

interface KioskStatusProps {
	online: boolean;
	waiting: number;
}

/** For the toolbar: whether the kiosk is offline, and how many punches are waiting to be sent. */
export function KioskStatus({ online, waiting }: KioskStatusProps) {
	return (
		<div className="tc-status" role="status" aria-live="polite">
			{!online && <Tag type="red">Offline</Tag>}
			{waiting > 0 && (
				<Tag type="cool-gray">{waiting === 1 ? "1 punch waiting" : `${waiting} punches waiting`}</Tag>
			)}
		</div>
	);
}
