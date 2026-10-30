// Copyright (c) 2026, Avunu LLC and contributors
// For license information, please see license.txt

import { act, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { mountKiosk } from "./mount";
import { registerServiceWorker } from "./serviceWorker";
import { useSession } from "./session";
import { useToasts } from "./components/Toasts";

vi.mock("./serviceWorker", () => ({ registerServiceWorker: vi.fn() }));

function Page() {
	// Both providers are there: their hooks hand back the real thing, not the no-op defaults.
	const session = useSession();
	const showToast = useToasts();
	return (
		<p>{typeof session.recordActivity === "function" && typeof showToast === "function" ? "ready" : ""}</p>
	);
}

describe("mountKiosk", () => {
	afterEach(() => {
		document.body.innerHTML = "";
		vi.mocked(registerServiceWorker).mockClear();
	});

	it("renders the page into #app, inside the shared providers, and registers the worker", async () => {
		document.body.innerHTML = '<div id="app"></div>';

		await act(async () => mountKiosk(<Page />));

		expect(await screen.findByText("ready")).toBeTruthy();
		expect(document.querySelector("#app .cds--g10")).not.toBeNull();
		expect(registerServiceWorker).toHaveBeenCalledOnce();
	});

	it("does nothing on a page without #app", () => {
		mountKiosk(<Page />);

		expect(document.body.textContent).toBe("");
		expect(registerServiceWorker).not.toHaveBeenCalled();
	});
});
