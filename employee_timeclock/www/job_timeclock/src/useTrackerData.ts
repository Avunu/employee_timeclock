// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { useFrappeGetCall } from "frappe-react-sdk";
import { useSession } from "../../../public/js/kiosk/session";
import { useToasts } from "../../../public/js/kiosk/Toasts";
import { failedStatus, getErrorMessage } from "../../../public/js/kiosk/useBackendCall";
import { METHOD } from "./api";
import type { TrackerSession } from "./useEmployee";

interface TrackerAnswer {
	status?: string;
	token?: string | null;
}

/**
 * What one of the tracker's read methods answers, refetched when the page comes back into view.
 * `key` is the SDK's cache key: null fetches nothing. It is given rather than derived, as the
 * token in `params` changes with each answer. By POST, to keep the token out of URLs and logs.
 * With no way to reach the server, the last answer stays. SWR asks that before each fetch, of the
 * options it was last given, so it reads the state then rather than taking it as an option.
 */
export function useTrackerData<T extends TrackerAnswer>(
	session: TrackerSession,
	method: string,
	key: string | null,
	params: Record<string, unknown> = {},
) {
	const { recordActivity, reportForbidden } = useSession();
	const showToast = useToasts();

	return useFrappeGetCall<{ message: T }>(
		`${METHOD}.${method}`,
		{ ...params, token: session.token() },
		key,
		{
			isPaused: () => !navigator.onLine || !session.canCall(),
			shouldRetryOnError: false,
			onSuccess: ({ message }) => {
				recordActivity();
				session.accept(message);
			},
			onError: (error: unknown) => {
				const status = failedStatus(error);
				if (status === 401) session.signOut();
				else if (status === 403) reportForbidden();
				else if (status !== 0)
					showToast({ kind: "error", title: getErrorMessage(error, `${method} failed.`) });
			},
		},
		"POST",
	);
}
