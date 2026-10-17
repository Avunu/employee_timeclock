<template>
	<div class="static h-screen flex z-0">
		<header class="z-10 block rounded-lg bg-gray-300 fixed w-screen">
			<div class="z-100 mx-auto px-4 py-6 lg:px-8 flex h-center items-center justify-between">
				<!-- Job Timeclock Header -->
				<button class="text-4xl font-bold tracking-tight text-gray-900" @click="refresh_page">
					{{ header }}
				</button>

				<!-- Clock out -->
				<!--<button class="bg-teal-300 hover:bg-teal-400 text-white font-normal lg:text-3xl py-4 px-8 rounded ring-2 ring-offset-1 ring-gray-100" -->
				<!-- v-if="activeSession" @click="log_out_employee(this.token)">Clock Out</button>-->

				<!-- Work station Dropdown -->
				<KeepAlive include="workstation">
					<DropDownMenu v-if="activeSession" @send_workstation="select_workstation" />
				</KeepAlive>
				<!-- Switch Employee -->
				<button
					class="bg-green-500 hover:bg-green-600 text-white font-normal lg:text-3xl py-4 px-4 rounded ring-2 ring-offset-1 ring-gray-100"
					v-if="activeSession"
					@click="switchEmployee"
				>
					Switch Employee
				</button>
				<SessionTimer :employeeName="employeeName" :tokenExpiration="tokenExpiration" v-if="activeSession" />
			</div>
		</header>

		<main class="z-0 flex w-full overflow-hidden my-16 pt-16" v-if="activeSession">
			<!-- When session is active -->
			<!-- Work Orders Section -->
			<WorkOrderList
				class="z-0"
				:workOrders="workOrders"
				:selectedWorkOrder="selectedWorkOrder"
				@select="selectWorkOrder"
			/>
			<!-- Job Cards Section -->
			<transition name="job_card_list">
				<JobCardList
					class="z-0"
					name="job_cards_comp"
					:jobCards="jobCards"
					v-if="selectedWorkOrder"
					:employee_id="this.employeeId"
				/>
			</transition>
		</main>

		<!-- <main v-else: class="bg-white fixed w-auto top-100 z-50 h-24"> -->
		<main v-else: class="w-full h-screen">
			<!-- When session is inactive -->
			<!-- Use this when scanner is working. -->
			<AuthorizationMessage />
			<!-- <StartScreen :employees="employees" @send_login="receive_login" @send_employee="get_token_from_employee"/> -->

			<!-- This is to log in without scanner -->
			<!-- <h1 class="text-3xl font-bold top-50">Employee List</h1>
        <p>Click who you are:</p>
        <EmployeeList :employees="employees" @send_employee="get_token_from_employee"/> -->
		</main>
	</div>
</template>

<script lang="ts">
import { defineComponent, provide, watch } from "vue";
import { useStorage } from "@vueuse/core";
import { jwtDecode } from "jwt-decode";
import onScan from "onscan.js";
import { FrappeCall } from "../../FrappeCall.js";

// import sub components
import AuthorizationMessage from "./components/AuthorizationMessage.vue";
import SessionTimer from "./components/SessionTimer.vue";
import TimerWidget from "./components/TimerWidget.vue";
import WorkOrderList from "./components/WorkOrderList.vue";
import { WorkOrder } from "./types/WorkOrder";
import JobCardList from "./components/JobCardList.vue";
import { JobCard } from "./types/JobCard";
import EmployeeList from "./components/EmployeeList.vue";
import { Employee } from "./types/Employee";
import StartScreen from "./components/StartScreen.vue";
import DropDownMenu from "./components/DropDownMenu.vue";

//  Toastification is a simple system to make toast notifications.
import { useToast } from "vue-toastification";
// Trying to use realtime to track when employees clock out for the day
// then shutting off their time when they do.
// import { FrappeUI, initSocket } from 'frappe-ui';

const toast = useToast();

export default defineComponent({
	name: "JobTimeClock",
	components: {
		AuthorizationMessage,
		JobCardList,
		SessionTimer,
		TimerWidget,
		WorkOrderList,
		EmployeeList,
		StartScreen,
		DropDownMenu,
	},
	data(): {
		employeeId: string;
		employeeName: string;
		header: string;
		jobCards: JobCard[];
		selectedWorkOrder: null | WorkOrder;
		showAuthMessage: boolean;
		token: string | null;
		tokenExpiration: number;
		workOrders: WorkOrder[];
		activeSession: Boolean;
		employeeLoggedIn: Boolean;
		employees: Employee[];
		dropdown_value: string;
		active_dropdown: Boolean;
		workstation: string;
	} {
		return {
			employeeId: "",
			employeeName: "",
			header: "Job Timeclock",
			jobCards: [],
			selectedWorkOrder: null,
			showAuthMessage: false,
			token: useStorage<string | null>("token", null)!,
			tokenExpiration: 0,
			workOrders: [],
			activeSession: false,
			employeeLoggedIn: false,
			employees: [],
			active_dropdown: false,
			workstation: "",
		};
	},

	// computed: {
	//     sorted_jobCards(){
	//         const cards = this.jobCards
	//         cards.sort((a) =>{
	//             const valueA = a["operation"];
	//             const valueB = b[this.sortValue];
	//             if (valueA < valueB) return -1;
	//             if (valueA > valueB) return 1;
	//             return 0;
	//         });
	//     }
	// },

	methods: {
		async check_for_erp_log_in() {
			const response = await FrappeCall("timeclock.www.job_timeclock.check_for_erp_log_in", {});
			if (response.user_id === "Guest") {
				console.log(response.user_id);
			} else {
				console.log("Session logged in", response.user_id);
			}
			// if (frappe.session.user ! == 'Guest'){
			//     console.log('User ID:', frappe.session.user);
			// } else {
			//     console.log('Please log in to access the ERP.')
			// }
		},

		async authenticateEmployee(sCode: string) {
			this.token = null;
			this.tokenExpiration = 0;
			this.jobCards = [];
			this.selectedWorkOrder = null;
			this.workOrders = [];
			this.employeeId = "";
			this.employeeName = "";
			this.workstation = this.workstation;

			const response = await FrappeCall("timeclock.www.job_timeclock.authenticate_employee", { rfid: sCode });

			if (response?.status === "success") {
				this.token = response.token;
				this.activeSession = true;
				// This was commented out because of errors for Allen during night shift.
				// if (response.last_checkin === 'OUT'){
				//    toast.success(`${this.employee_name} has punched in.`);
				//    this.log_employee_in(this.token)
				//} else {
				// console.log('You are already logged in.');
				//    this.employeeLoggedIn= true;
				//}

				await this.getWorkOrders();
			} else {
				console.log("Sorry! You are not authenticated.");
				console.log(response.message);
				this.activeSession = false;
				this.setSessionFalse;
				this.token = null;
				this.tokenExpiration = 0;
				this.jobCards = [];
				this.selectedWorkOrder = null;
				this.workOrders = [];
				this.employeeId = "";
				this.employeeName = "";
			}
		},

		async decodeToken() {
			const tokenData: any = jwtDecode(this.token);
			this.tokenExpiration = tokenData.exp * 1000;
			this.employeeId = tokenData.employee_id;
			this.employeeName = tokenData.employee_name;
			console.log("Hurrah! You are authenticated as ", tokenData.employee_name);

			// Every time Token is refreshed, timer restarts.
			const currentTime = Date.now();
			const timeout = this.tokenExpiration - currentTime;
			this.resetTimer(timeout);
		},

		async getWorkOrders() {
			const response = await FrappeCall("timeclock.www.job_timeclock.get_work_orders", { token: this.token });

			if (response?.status === "success") {
				this.token = response.token;
				this.workOrders = response.work_orders;
				// console.log(this.workOrders);
			} else {
				this.workOrders = [];
				this.activeSession = false;
			}
		},

		selectWorkOrder(workOrder: WorkOrder) {
			this.selectedWorkOrder = workOrder;
			this.getJobCards(workOrder.name);
		},

		async getJobCards(workOrderName: string) {
			const response = await FrappeCall("timeclock.www.job_timeclock.get_job_cards", {
				token: this.token,
				work_order: workOrderName,
			});
			if (response?.status === "success") {
				this.token = response.token;
				this.jobCards = response.job_cards;
				// console.log(response.active_cards)
				for (let i = 0; i < this.jobCards.length; i++) {
					this.jobCards[i].is_active = response.active_cards[i];
				}
				// console.log(this.jobCards)

				// Check for workstation
				if (this.workstation !== "") {
					const response2 = await FrappeCall("timeclock.www.job_timeclock.sort_jobcard_by_workstation", {
						jobCards: this.jobCards,
						workstation: this.workstation,
					});
					if (response2?.status === "success") {
						this.jobCards = response2.sorted_job_cards;
						// console.log(response2.sorted_job_cards)
					} else {
						console.log("sort failed.");
					}
				} else {
					console.log("Workstation: default");
				}
			} else {
				this.jobCards = [];
				// console.log('getJobCards: Token no longer active.')
				this.activeSession = false;
			}
		},

		// These functions are to turn off the session once it is done.
		setSessionFalse() {
			this.activeSession = false;
			console.log("Logged out of Job Time Clock Session");
		},

		startTimer(timeout: number) {
			const timeoutId = setTimeout(this.endTimer, timeout);
		},

		endTimer() {
			this.setSessionFalse;
			this.activeSession = false;
			this.token = null;
			this.tokenExpiration = 0;
			this.jobCards = [];
			this.selectedWorkOrder = null;
			this.workOrders = [];
			this.employeeId = "";
			this.employeeName = "";
		},

		resetTimer(timeout: number) {
			clearTimeout(this.timeoutId);
			this.startTimer(timeout);
		},

		// This is not currently working.
		async log_employee_in(token: string) {
			// console.log('You are not clocked in.');

			// Calculate current time to log in.
			this.date = new Date();
			const year = this.date.getUTCFullYear();
			const month = this.date.getUTCMonth() + 1; // Months are zero-based
			const day = this.date.getUTCDate();
			const hour = this.date.getUTCHours();
			const minute = this.date.getUTCMinutes();
			const second = this.date.getUTCSeconds();
			const pad = (num: number) => (num < 10 ? "0" + num : num);
			const current_time = `${year}-${pad(month)}-${pad(day)} ${pad(hour - 4)}:${pad(minute)}`;
			// console.log(current_time);

			// Log Call
			const response = await FrappeCall("timeclock.www.job_timeclock.log_in_employee", {
				token: token,
				time: current_time,
			});

			if (response?.status === "success") {
				console.log("You are now logged in.");
			} else {
				console.log("did not work. You are still logged out:");
				// console.log(response.log)
			}
		},

		switchEmployee() {
			toast.success(`${this.employeeName} switched user.`);
			// toast('Signed Out.', {
			//     toastClassName: "custom_default",
			//     bodyClassName: ['custom_class-1','custom-class-2']

			// });

			this.activeSession = false;
			this.token = null;
			this.tokenExpiration = 0;
			this.jobCards = [];
			this.selectedWorkOrder = null;
			this.workOrders = [];
			this.employeeId = "";
			this.employeeName = "";

			this.employeeId = "";
			this.employeeName = "";
			this.jobCards = [];
			this.selectedWorkOrder = null;
			this.tokenExpiration = 0;
			this.workOrders = [];
			this.activeSession = false;
			this.employeeLoggedIn = false;
			this.employees = [];
		},

		// This does not currently work. Comes from button that is cancelled out.
		async log_out_employee(token) {
			// Calculate current time to log in.
			const date = new Date();
			const year = date.getUTCFullYear();
			const month = date.getUTCMonth() + 1; // Months are zero-based
			const day = date.getUTCDate();
			const hour = date.getUTCHours();
			const minute = date.getUTCMinutes();
			const second = date.getUTCSeconds();
			const pad = (num: number) => (num < 10 ? "0" + num : num);
			const current_time = `${year}-${pad(month)}-${pad(day)} ${pad(hour - 4)}:${pad(minute)}`;
			// console.log(current_time);

			// Log Call
			const response = await FrappeCall("timeclock.www.job_timeclock.log_out_employee", {
				token: token,
				time: current_time,
			});

			if (response?.status === "success") {
				toast.success(`${this.employeeName} has punched out.`);
				console.log("You are now logged out.", response.log);
				this.activeSession = false;
				this.token = null;
				this.tokenExpiration = 0;
				this.jobCards = [];
				this.selectedWorkOrder = null;
				this.workOrders = [];
				this.employeeId = "";
				this.employeeName = "";
				this.employees = [];
			} else {
				toast.error(`${this.employeeName} was not properly signed out.`);
				console.log("Did not work. You are still logged in:", response.log);
			}
		},
		async get_employees() {
			const response = await FrappeCall("timeclock.www.job_timeclock.get_employees");
			if (response?.status === "success") {
				this.employees = response.employees;
				// console.log(this.employees)
			}
		},

		get_token_from_employee(employee: Employee) {
			// console.log(employee)
			this.authenticateEmployee(employee.sCode);
		},

		// To receive send_login Emit from StartScreen.vue
		receive_login(sCode: string) {
			console.log("Receive login succeeded: ", sCode);
			this.authenticateEmployee(sCode);
		},

		// For 'Job Timeclock' refresh button on click.
		refresh_page() {
			window.location.reload();
			console.log("Page reloaded.");
		},

		select_workstation(workstation) {
			console.log("Workstation Name", workstation);
			this.workstation = workstation;
			if (localStorage.getItem("workstation")) {
				this.replaceState(Object.assign(state, JSON));
				localStorage.setItem("workstation", workstation);
			}
		},
	},

	mounted() {
		if (this.token) {
			// Initialize getting token and then work orders.
			this.getWorkOrders();
		}
		this.check_for_erp_log_in();

		// This code is to hardwire employees logging in without scan.
		this.employees = this.get_employees();

		// This is to be used with scan.
		const scanner = onScan.attachTo(document, {
			onScan: this.authenticateEmployee,
			ignoreIfFocusOn: ".frappe-input",
		});

		this.scanner = scanner;
		window.scanner = scanner;
		// this.scanner.simulate(document, '1234512345');
		// const socket = initSocket[]

		watch(
			() => this.token,
			(newToken) => {
				// If you don't do this, it will refresh every time you switch work orders.
				// console.log('watching.')
				if (newToken !== this.token) {
					this.decodeToken();
				} else if (newToken) {
					this.decodeToken();
				} else {
					// console.log('Token is the same.')
				}
			},
			{ immediate: true },
		);
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
