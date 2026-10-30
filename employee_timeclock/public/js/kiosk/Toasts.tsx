// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { createContext, type PropsWithChildren, useCallback, useContext, useState } from "react";
import { ToastNotification } from "@carbon/react";
import type { ShowToast, ToastState } from "./types";

/** How long a toast stays: long enough to read, short enough that the next person in line
 * doesn't take it for theirs. */
const TOAST_TIMEOUT_MS = 8000;

let nextToastId = 1;

const ToastContext = createContext<ShowToast>(() => {});

export function useToasts(): ShowToast {
	return useContext(ToastContext);
}

export function ToastProvider({ children }: PropsWithChildren) {
	const [toasts, setToasts] = useState<ToastState[]>([]);

	const showToast = useCallback<ShowToast>((next) => {
		// Newest on top; older toasts stay until they time out or are closed
		// so a burst of them can't silently replace each other.
		setToasts((current) => [{ ...next, id: nextToastId++ }, ...current]);
	}, []);

	const dismissToast = useCallback((id: number) => {
		setToasts((current) => current.filter((toast) => toast.id !== id));
	}, []);

	return (
		<ToastContext.Provider value={showToast}>
			{children}
			{/* Top-right overlay, just under Carbon's 3rem fixed Header. */}
			<div
				style={{
					position: "fixed",
					top: "4rem",
					right: "1rem",
					width: "24rem",
					maxWidth: "calc(100vw - 2rem)",
					maxHeight: "calc(100vh - 5rem)",
					overflowY: "auto",
					display: "flex",
					flexDirection: "column",
					gap: "0.5rem",
					zIndex: 9000,
				}}
			>
				{toasts.map((toast) => (
					<ToastNotification
						key={toast.id}
						kind={toast.kind}
						title={toast.title}
						timeout={TOAST_TIMEOUT_MS}
						onClose={() => dismissToast(toast.id)}
						style={{ width: "100%", margin: 0 }}
					/>
				))}
			</div>
		</ToastContext.Provider>
	);
}
