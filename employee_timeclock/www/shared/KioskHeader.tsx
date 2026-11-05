// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderName, Tag, Theme } from "@carbon/react";
import type { ReactNode } from "react";
import { Renew, type CarbonIconType } from "@carbon/react/icons";
import { reloadPage } from "./navigate";

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

interface UtilityAction {
	label: string;
	icon: CarbonIconType;
	onClick: () => void;
}

/**
 * The utility actions every kiosk page shows at the far end of its toolbar,
 * after the page's own actions. No "back to the desk": a kiosk signs in as a
 * Website User, which has no desk.
 */
const UTILITY_ACTIONS: UtilityAction[] = [{ label: "Reload page", icon: Renew, onClick: reloadPage }];

interface KioskHeaderProps {
	/** The page's name. */
	name: string;
	/** The page's own toolbar actions. */
	children?: ReactNode;
}

/**
 * The toolbar every kiosk page shares: Carbon's UI Shell header, on the dark
 * g100 theme, while the page below stays on the light theme set by mountKiosk.
 * Fixed at 3rem tall, so a page leaves 3rem of room at the top.
 */
export function KioskHeader({ name, children }: KioskHeaderProps) {
	return (
		<Theme theme="g100">
			<Header aria-label={name}>
				<HeaderName href="#" prefix="">
					{name}
				</HeaderName>
				<HeaderGlobalBar>
					{children}
					{UTILITY_ACTIONS.map(({ label, icon: Icon, onClick }) => (
						<HeaderGlobalAction
							key={label}
							aria-label={label}
							onClick={onClick}
							// The utility actions end the bar, and a tooltip centered under
							// an icon at the edge would hang off the screen.
							tooltipAlignment="end"
						>
							<Icon size={20} />
						</HeaderGlobalAction>
					))}
				</HeaderGlobalBar>
			</Header>
		</Theme>
	);
}
