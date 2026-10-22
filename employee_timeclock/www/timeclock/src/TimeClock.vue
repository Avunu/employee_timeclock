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

		<main class="z-0 flex w-full overflow-hidden my-16 pt-16" v-if="activeSession">
			<!-- When session is active -->

			<transition name="job_card_list"> </transition>
		</main>

		<!-- <main v-else: class="bg-white fixed w-auto top-100 z-50 h-24"> -->
		<main v-else: class="w-full h-screen">
			<!-- When session is inactive -->
			<AuthorizationMessage />
		</main>
	</div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import { useStorage } from "@vueuse/core";
import { jwtDecode } from "jwt-decode";
import onScan from "onscan.js";
import { frappeCall } from "../../../public/js/FrappeCall";
import { dateToFrappeDateTimeString } from "../../../public/js/job_timeclock/utils";

// import sub components
import AuthorizationMessage from "./components/AuthorizationMessage.vue";
import type { Employee } from "./types/Employee";
import type { AuthenticateEmployeeResponse, EmployeeCheckinResponse } from "./types/api";

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

export default defineComponent({
	name: "TimeClock",
	components: {
		AuthorizationMessage,
	},
	data(): {
		activeSession: boolean;
		employeeId: string;
		employeeName: string;
		header: string;
		token: string | null;
		tokenExpiration: number;
		timeoutId: number | undefined;
	} {
		return {
			activeSession: false,
			employeeId: "",
			employeeName: "",
			header: "Clock In",
			token: useStorage<string | null>("token", null).value,
			tokenExpiration: 0,
			timeoutId: undefined,
		};
	},

	methods: {
		async authenticateEmployee(sCode: string): Promise<void> {
			this.token = null;
			this.tokenExpiration = 0;
			this.employeeId = "";
			this.employeeName = "";

			const response = await frappeCall<AuthenticateEmployeeResponse>(
				"employee_timeclock.www.timeclock.authenticate_employee",
				{ rfid: sCode },
			);

			if (response.status === "success" && response.token) {
				this.token = response.token;
				if (response.last_checkin === "OUT") {
					this.log_employee_in(this.token);
				} else if (response.last_checkin === "IN") {
					this.log_employee_out(this.token);
				} else {
					console.log("Else");
					this.log_employee_in(this.token);
				}
			} else {
				console.log("Sorry! You are not authenticated.");
				this.token = null;
				this.tokenExpiration = 0;
			}
		},

		// This is triggered by a watch command. Anytime Token changes, this function is run.
		decodeToken(): void {
			const tokenData = jwtDecode<{ exp: number; employee_id: string; employee_name: string }>(
				String(this.token),
			);
			this.tokenExpiration = tokenData.exp * 1000;
			this.employeeId = tokenData.employee_id;
			this.employeeName = tokenData.employee_name;
		},

		startTimer(timeout: number): void {
			this.timeoutId = setTimeout(this.endTimer, timeout) as unknown as number;
		},

		endTimer(): void {
			this.token = null;
			this.tokenExpiration = 0;
			this.employeeId = "";
			this.employeeName = "";
		},

		resetTimer(timeout: number): void {
			clearTimeout(this.timeoutId);
			this.startTimer(timeout);
		},

		async log_employee_in(token: string): Promise<void> {
			const current_time: string = dateToFrappeDateTimeString(new Date());

			const response = await frappeCall<EmployeeCheckinResponse>(
				"employee_timeclock.www.timeclock.log_in_employee",
				{
					token: token,
					time: current_time,
				},
			);

			if (response.status === "success") {
				console.log("You are now logged in.");
				toast.success(`${this.employeeName} has punched in.`);
			} else {
				console.log("did not work. You are still logged out:");
				toast.error(`${this.employeeName} was unsuccessfully logged in.`);
			}
			this.token = null;
			this.tokenExpiration = 0;
			this.employeeId = "";
			this.employeeName = "";
		},

		async log_employee_out(token: string): Promise<void> {
			const current_time: string = dateToFrappeDateTimeString(new Date());

			const response = await frappeCall<EmployeeCheckinResponse>(
				"employee_timeclock.www.timeclock.log_out_employee",
				{
					token: token,
					time: current_time,
				},
			);

			if (response.status === "success") {
				toast.success(`${this.employeeName} has punched out.`);
				console.log("You are now logged out.", response.log);
			} else {
				toast.error(`${this.employeeName} was not properly signed out.`);
				console.log("Did not work. You are still logged in:", response.log);
			}
			this.token = null;
			this.tokenExpiration = 0;
			this.employeeId = "";
			this.employeeName = "";
		},

		get_token_from_employee(employee: Employee): void {
			this.authenticateEmployee(employee.sCode);
		},

		// For 'Clock In' refresh button on click.
		refresh_page(): void {
			window.location.reload();
			console.log("Page reloaded.");
		},
	},

	mounted() {
		// This is to be used with scan.
		console.log("timeclock initialized.");

		// Attach onScan to document for barcode scanning
		onScan.attachTo(document, {
			onScan: this.authenticateEmployee,
		});

		// Track that onScan is attached (useful for cleanup)
		window.onScanAttached = true;
		window.onScan = onScan;

		watch(
			() => this.token,
			(newToken) => {
				if (newToken !== this.token) {
					this.decodeToken();
				} else if (newToken) {
					this.decodeToken();
				}
			},
			{ immediate: true },
		);
	},

	beforeUnmount() {
		// Clean up onScan listener when component is destroyed
		if (window.onScanAttached) {
			onScan.detachFrom(document);
			window.onScanAttached = false;
		}
	},
});
</script>

<style scoped>
.job_card_list-enter-active,
.job_card_list-leave-active {
	transition: opacity 1s ease-out;
}

.job_card_list-enter-from,
.job_card_list-leave-to {
	opacity: 0;
}

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
