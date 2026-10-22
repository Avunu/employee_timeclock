<template>
	<div class="static h-screen flex z-0">
		<header class="z-10 block rounded-lg bg-gray-300 fixed w-screen">
			<div class="z-100 mx-auto px-4 py-6 lg:px-8 flex h-center items-center justify-between">
				<!-- Job Timeclock Header -->
				<button
					class="flex justify-center text-4xl font-bold tracking-tight text-white-300"
					@click="refresh_page"
				>
					{{ header }}
				</button>
			</div>
		</header>

		<main class="w-full h-screen">
			<AuthorizationMessage />
		</main>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import onScan from "onscan.js";
import { FrappeCallError, frappeCall } from "../../../public/js/FrappeCall";

// import sub components
import AuthorizationMessage from "./components/AuthorizationMessage.vue";
import type { KioskPunch } from "./types/api";

// Extend Window interface for TypeScript
declare global {
	interface Window {
		onScanAttached?: boolean;
		onScan?: typeof onScan;
	}
}

//  Toastification is a simple system to make toast notifications.
import { useToast } from "vue-toastification";

const toast = useToast();

/** Reload the page hourly, so the kiosk session stays active and a stale page never lingers. */
const RELOAD_INTERVAL_MS = 60 * 60 * 1000;

export default defineComponent({
	name: "TimeClock",
	components: {
		AuthorizationMessage,
	},
	data(): {
		header: string;
		pendingScans: Set<string>;
		reloadId: number | undefined;
	} {
		return {
			header: "Clock In",
			pendingScans: new Set(),
			reloadId: undefined,
		};
	},

	methods: {
		async punch(scan: string): Promise<void> {
			// a scanner that fires twice sends the same badge again before the first punch is saved
			if (this.pendingScans.has(scan)) {
				return;
			}
			this.pendingScans.add(scan);
			try {
				const punch = await frappeCall<KioskPunch>("employee_timeclock.www.timeclock.punch", {
					badge: scan,
				});
				const message = `${punch.employee_name} has punched ${punch.log_type.toLowerCase()}. ${punch.weekly_hours} hours this week.`;
				if (punch.log_type === "IN") {
					toast.success(message);
				} else {
					toast.info(message);
				}
			} catch (error) {
				this.reportError(error);
			} finally {
				this.pendingScans.delete(scan);
			}
		},

		reportError(error: unknown): void {
			if (error instanceof FrappeCallError && error.status === 403) {
				// the kiosk user is signed out: reloading shows the login page
				window.location.reload();
				return;
			}
			if (error instanceof FrappeCallError) {
				// an unknown badge (401), the scan rate limit (429) or a rejected punch
				toast.error(error.message);
			} else {
				toast.error("Could not reach the server. Please scan again.");
			}
			console.error(error);
		},

		// For 'Clock In' refresh button on click.
		refresh_page(): void {
			window.location.reload();
		},
	},

	mounted() {
		// Attach onScan to document for barcode scanning
		onScan.attachTo(document, {
			onScan: this.punch,
		});

		// Track that onScan is attached (useful for cleanup)
		window.onScanAttached = true;
		window.onScan = onScan;

		this.reloadId = window.setInterval(() => window.location.reload(), RELOAD_INTERVAL_MS);
	},

	beforeUnmount() {
		// Clean up onScan listener when component is destroyed
		if (window.onScanAttached) {
			onScan.detachFrom(document);
			window.onScanAttached = false;
		}
		window.clearInterval(this.reloadId);
	},
});
</script>

<style scoped>
.Vue-Toastification__toast--default.custom_default {
	background-color: rgb(15, 255, 35);
}

/* Applied to the toast body when using regular strings as content */
.Vue-Toastification__toast-body.custom-class-1 {
	font-size: 30px;
}

/* Applied to a wrapper div when using a custom component as content */
.Vue-Toastification__toast-component-body.custom-class-2 {
	width: 100%;
}
</style>
