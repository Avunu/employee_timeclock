// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import type { PropsWithChildren } from "react";
import { type FrappeConfig, FrappeContext, FrappeProvider } from "frappe-react-sdk";

/** What mount.tsx wraps a page in, with no socket, and a fresh cache so tests don't share answers. */
export function Frappe({ children, socket }: PropsWithChildren<{ socket?: unknown }>) {
	return (
		<FrappeProvider
			enableSocket={false}
			swrConfig={{ provider: () => new Map(), dedupingInterval: 0, focusThrottleInterval: 0 }}
		>
			<FrappeContext.Consumer>
				{(frappe) => (
					<FrappeContext.Provider value={{ ...frappe, socket } as FrappeConfig}>
						{children}
					</FrappeContext.Provider>
				)}
			</FrappeContext.Consumer>
		</FrappeProvider>
	);
}
