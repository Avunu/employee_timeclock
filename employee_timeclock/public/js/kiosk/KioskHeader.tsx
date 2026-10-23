// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import type { ReactNode } from "react";
import { Header, HeaderGlobalAction, HeaderGlobalBar, HeaderName, Theme } from "@carbon/react";
import { type CarbonIconType, Renew } from "@carbon/react/icons";
import { reloadPage } from "./navigate";

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
