// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { Theme } from "@carbon/react";
import { FrappeProvider } from "frappe-react-sdk";
import { registerServiceWorker } from "./serviceWorker";
import { SessionProvider } from "./session";
import { ToastProvider } from "./Toasts";

interface MountOptions {
	/** Connect to Frappe's socket.io server, for a page that listens for realtime events
	 * (useFrappeEventListener). Off by default: a socket nobody listens to is reconnect noise. */
	realtime?: boolean;
}

/** Renders a kiosk page's React app into index.html's `#app`, inside the providers every kiosk
 * page shares. */
export function mountKiosk(app: ReactNode, { realtime = false }: MountOptions = {}): void {
	const container = document.getElementById("app");
	if (!container) return;

	const boot = window.kiosk_boot;
	const site = boot?.sitename;
	const socketPort = boot?.socketio_port?.toString();

	createRoot(container).render(
		<FrappeProvider
			{...(site === undefined ? {} : { siteName: site, customHeaders: { "X-Frappe-Site-Name": site } })}
			enableSocket={realtime}
			{...(socketPort === undefined ? {} : { socketPort })}
		>
			<Theme theme="g10">
				<SessionProvider>
					<ToastProvider>{app}</ToastProvider>
				</SessionProvider>
			</Theme>
		</FrappeProvider>,
	);

	registerServiceWorker();
}
