// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import type { ReactNode } from "react";
import { createRoot } from "react-dom/client";
import { Theme } from "@carbon/react";
import { registerServiceWorker } from "./serviceWorker";
import { SessionProvider } from "./session";
import { ToastProvider } from "./Toasts";

/** Renders a kiosk page's React app into index.html's `#app`, inside the
 * providers every kiosk page shares. No realtime socket: a kiosk only sends
 * punches, and an open socket nobody listens to is pure reconnect noise. */
export function mountKiosk(app: ReactNode): void {
	const container = document.getElementById("app");
	if (!container) return;

	createRoot(container).render(
		<Theme theme="g10">
			<SessionProvider>
				<ToastProvider>{app}</ToastProvider>
			</SessionProvider>
		</Theme>,
	);

	registerServiceWorker();
}
