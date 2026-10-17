<template>
	<!-- Path to log in or just scan. -->
	<div
		class="h-screen flex flex-col justify-around items-center"
		v-if="log_in === false && this.authenticated === false"
	>
		<button
			class="bg-green-300 rounded-full text-center-white me-2 mb-2 px-5 py-2 active:bg-green-500 focus:outline-none focus:ring focus:ring-green-200"
			@click="log_in_module"
		>
			ERP Log In
		</button>
		<p class="text-4xl">or</p>
		<AuthorizationMessage />
	</div>

	<!-- Path to log in username and password, then select who you are to be authorized. -->
	<div v-if="log_in">
		<LogInModule @return_triggered="return_triggered" @submit_login="return_auth" />
	</div>
	<div v-if="log_in === false && this.authenticated">
		<h1 class="text-3xl font-bold top-50">Employee List</h1>
		<p>Click who you are:</p>
		<EmployeeList :employees="employees" @send_employee="return_employee" />
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import EmployeeList from "./EmployeeList.vue";
import { Employee } from "../types/Employee";
import AuthorizationMessage from "./AuthorizationMessage.vue";
import LogInModule from "./LogInModule.vue";

export default defineComponent({
	name: "StartScreen",
	components: {
		EmployeeList,
		LogInModule,
		AuthorizationMessage,
	},
	props: {
		employees: {
			type: Array as PropType<Employee[]>,
		},
	},

	data(): {
		log_in: Boolean;
		authenticated: Boolean;
	} {
		return {
			log_in: false,
			authenticated: false,
		};
	},

	methods: {
		log_in_module() {
			console.log("logged in dude.");
			this.log_in = true;
		},

		// Return from log in menu if accidentally clicked, or log in failed.
		return_triggered(return_triggered: Boolean) {
			if (return_triggered) {
				this.log_in = false;
				console.log("aye");
			}
		},

		send_login(sCode: string) {
			this.$emit("send_login", sCode);
		},

		return_auth(authenticated: Boolean) {
			console.log("dope");
			this.authenticated = authenticated;
			this.log_in = false;
		},

		return_employee(employee) {
			this.$emit("send_employee", employee);
		},
	},
	mounted() {
		const scanner = onScan.attachTo(document, {
			onScan: this.send_scan,
			ignoreIfFocusOn: ".frappe-input",
		});

		this.scanner = scanner;
		console.log(this.employees);
	},

	unmounted() {
		this.employees = [];
		this.log_in = false;
	},
});
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap");

body {
	font-family: "Poppins", sans-serif;
}

.btn {
	display: inline-block;
	background: rgb(108, 241, 159);
	color: #ffffff;
	border: none;
	padding: 10px 20px;
	margin: 5px;
	border-radius: 5px;
	cursor: pointer;
	text-decoration: none;
	font-size: 15px;
	font-family: inherit;
}
</style>
