<template>
    <div class="h-screen flex flex-col">
    <header class="block rounded-lg bg-gray-300 fixed w-screen">
        <div class="mx-auto px-4 py-6 lg:px-8 flex h-center items-center justify-between">
            
            <!-- Job Timeclock Header -->
            <button class="text-4xl font-bold tracking-tight text-gray-900" 
            @click="refresh_page">{{ header }}</button>
            
            <!-- Clock out -->
            <button class="z-1 bg-teal-300 hover:bg-teal-400 text-white font-normal lg:text-3xl py-4 px-8 rounded ring-2 ring-offset-1 ring-gray-100" 
            v-if="activeSession" @click="log_out_employee(this.token)">Clock Out</button>
            
            <!-- Work station Dropdown -->
            <!-- <button class="bg-teal-500 hover:bg-teal-700 text-white font-normal lg:text-3xl py-4 px-8 rounded ring-2 ring-offset-1 ring-gray-100" 
            v-if="activeSession" @click="show_dropdown">{{ workstation_name }}</button> -->

            <DropDownMenu v-if="activeSession" @select_workstation="select_workstation" />

            <!-- Switch Employee -->
            <button class="bg-green-500 hover:bg-green-600 text-white font-normal lg:text-3xl py-4 px-4 rounded ring-2 ring-offset-1 ring-gray-100" 
            v-if="activeSession" @click="switchEmployee">Switch Employee</button>
            <SessionTimer :employeeName="employeeName" :tokenExpiration="tokenExpiration" v-if="activeSession" />
        </div>
    </header>

    <main class="h-screen overflow-hidden pt-16 z-1" v-if="activeSession">
        <!-- When session is active -->
        <!-- Work Orders Section -->
        <WorkOrderList :workOrders="workOrders" :selectedWorkOrder="selectedWorkOrder" @select="selectWorkOrder" />
        <!-- Job Cards Section -->
        <transition name="job_card_list">
        <JobCardList name='job_cards_comp' :jobCards="jobCards" v-if="selectedWorkOrder" :employee_id = "this.employeeId" />
        </transition>

    </main>

    <!-- <main v-else: class="bg-white fixed w-auto top-100 z-50 h-24"> -->
        <main v-else:>
        <!-- When session is inactive -->
        <!-- Use this when scanner is working. -->
        <AuthorizationMessage />
        <DropDownMenu @select_workstation="select_workstation" />
        <!-- <StartScreen :employees="employees" @send_login="receive_login" @send_employee="get_token_from_employee"/> -->
        
        <!-- This is to log in without scanner -->
        <!-- <h1 class="text-3xl font-bold top-50">Employee List</h1>
        <p>Click who you are:</p>
        <EmployeeList :employees="employees" @send_employee="get_token_from_employee"/> -->
    </main>
</div>
</template>

<script lang="ts">
import { defineComponent, provide, watch } from 'vue';
import { useStorage } from '@vueuse/core';
import { jwtDecode } from 'jwt-decode';
import onScan from 'onscan.js';
import { FrappeCall } from '../../FrappeCall.js';

// import sub components
import AuthorizationMessage from './components/AuthorizationMessage.vue';
import SessionTimer from './components/SessionTimer.vue';
import TimerWidget from './components/TimerWidget.vue';
import WorkOrderList from './components/WorkOrderList.vue';
import { WorkOrder } from './types/WorkOrder';
import JobCardList from './components/JobCardList.vue';
import { JobCard } from './types/JobCard';
import EmployeeList from './components/EmployeeList.vue';
import { Employee } from './types/Employee';
import StartScreen from './components/StartScreen.vue';
import DropDownMenu from './components/DropDownMenu.vue';

export default defineComponent({
    name: 'JobTimeClock',
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
        employeeId: string,
        employeeName: string,
        header: string,
        jobCards: JobCard[],
        selectedWorkOrder: null | WorkOrder,
        showAuthMessage: boolean,
        token: string | null,
        tokenExpiration: number,
        workOrders: WorkOrder[],
        activeSession: Boolean,
        employeeLoggedIn: Boolean,
        employees: Employee[],
        dropdown_value: string,
        active_dropdown: Boolean,
    } {
        return {
            employeeId: '',
            employeeName: '',
            header: 'Job Timeclock',
            jobCards: [],
            selectedWorkOrder: null,
            showAuthMessage: false,
            token: useStorage<string | null>('token', null)!,
            tokenExpiration: 0,
            workOrders: [],
            activeSession: false,
            employeeLoggedIn: false,
            employees: [],
            active_dropdown:false,
        };
    },

    // computed: {
    //     isSessionActive() {
    //         const currentTime = Date.now();
    //         // console.log(currentTime);
    //         // console.log(this.tokenExpiration);
    //         if((this.tokenExpiration) && (this.tokenExpiration > currentTime)){
    //             console.log('Logged in');
    //             return true
    //         } else {
    //             console.log('session was not activated');
    //             return false
    //         }
    //         // return (this.tokenExpiration && this.tokenExpiration > currentTime) as boolean;
    //     }
    // },
    methods: {
        async check_for_erp_log_in(){
            const response = await FrappeCall('timeclock.www.job_timeclock.check_for_erp_log_in', {});
            if (response.user_id === 'Guest') {
                console.log(response.user_id);
            } else {
                console.log('Session logged in', response.user_id);
            };
            // if (frappe.session.user ! == 'Guest'){
            //     console.log('User ID:', frappe.session.user);
            // } else {
            //     console.log('Please log in to access the ERP.')
            // }
        },

        // async test_erp_log_in(){
        //     const response = await FrappeCall('login', { usr: 'Administrator', pwd: 'admin' });
        //     console.log(response);
        // },
        
        async authenticateEmployee(sCode: string) {
            if (this.activeSession === true){
                this.setSessionFalse;
                this.activeSession= false;
                this.token = null;
                this.tokenExpiration = 0;
                this.jobCards= [];
                this.selectedWorkOrder= null;
                this.workOrders = [];
                this.employeeId= '';
                this.employeeName= '';
            }
            
            const response = await FrappeCall('timeclock.www.job_timeclock.authenticate_employee', { rfid: sCode });

            if (response?.status === 'success') {
                this.token = response.token;
                this.activeSession = true;
                if (response.last_checkin === 'OUT'){
                    this.log_employee_in(this.token)
                } else {
                    // console.log('You are already logged in.');
                    this.employeeLoggedIn= true;
                }
                
                await this.getWorkOrders();
            } else {
                console.log("Sorry! You are not authenticated.")
                console.log(response.message)
                this.activeSession = false
                this.setSessionFalse
                this.token = null
                this.tokenExpiration = 0
                this.jobCards= []
                this.selectedWorkOrder= null
                this.workOrders = []
                this.employeeId= ''
                this.employeeName= ''
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
            const timeout = (this.tokenExpiration - currentTime);
            this.resetTimer(timeout);
        },

        async getWorkOrders() {
            const response = await FrappeCall('timeclock.www.job_timeclock.get_work_orders', { token: this.token });

            if (response?.status === 'success') {
                this.token = response.token;
                this.workOrders = response.work_orders;
                // console.log(this.workOrders);
            } else {
                this.workOrders = [];
                this.activeSession = false
            }
        },

        selectWorkOrder(workOrder: WorkOrder) {
            this.selectedWorkOrder = workOrder;
            this.getJobCards(workOrder.name);
        },

        async getJobCards(workOrderName: string) {
            const response = await FrappeCall('timeclock.www.job_timeclock.get_job_cards', { token: this.token, work_order: workOrderName });
            if (response?.status === 'success') {
                this.token = response.token
                this.jobCards = response.job_cards
                this.time_logs = response.time_logs
                // console.log(this.time_logs);
                // giving serverError property to jobCards
                // for (let i=0; i < this.jobCards.operation; i++){
                //     if (this.jobCards[i].operation === 'Truss Assembly'){
                //     console.log(this.time_logs[i])
                // }
                // }
                // // console.log(response.job_cards);
            } else {
                this.jobCards = []
                // console.log('getJobCards: Token no longer active.')
                this.activeSession = false
            }
        },

        // These functions are to turn off the session once it is done. 
        setSessionFalse(){
            this.activeSession = false;
            console.log('Logged out of Job Time Clock Session')
        },

        startTimer(timeout: number){
            const timeoutId = setTimeout(this.endTimer, timeout);
        },

        endTimer(){
            this.setSessionFalse;
            this.activeSession= false;
            this.token = null;
            this.tokenExpiration = 0;
            this.jobCards= [];
            this.selectedWorkOrder= null;
            this.workOrders = [];
            this.employeeId= '';
            this.employeeName= '';
        },

        resetTimer(timeout: number){
            clearTimeout(this.timeoutId);
            this.startTimer(timeout);
        },

        async log_employee_in(token: string){
            // console.log('You are not clocked in.');
            
            // Calculate current time to log in.
            this.date = new Date();
            const year = this.date.getUTCFullYear();
            const month = this.date.getUTCMonth() + 1; // Months are zero-based
            const day = this.date.getUTCDate();
            const hour = this.date.getUTCHours();
            const minute = this.date.getUTCMinutes();
            const second = this.date.getUTCSeconds();
            const pad = (num: number) => (num < 10 ? '0' + num : num);
            const current_time = `${year}-${pad(month)}-${pad(day)} ${pad(hour-5)}:${pad(minute)}`;
            // console.log(current_time);
            
            // Log Call
            const response = await FrappeCall('timeclock.www.job_timeclock.log_in_employee', { token: token, time: current_time });
            
            if (response?.status === 'success') {
                console.log('You are now logged in.')
            }
            else {
                console.log('did not work. You are still logged out:')
                // console.log(response.log)
            }
        },

        switchEmployee(){
            this.activeSession= false;
            this.token = null;
            this.tokenExpiration = 0;
            this.jobCards= [];
            this.selectedWorkOrder= null;
            this.workOrders = [];
            this.employeeId= '';
            this.employeeName= '';
        
        },

        async log_out_employee(token){
            
            // Calculate current time to log in.
            const date = new Date();
            const year = date.getUTCFullYear();
            const month = date.getUTCMonth() + 1; // Months are zero-based
            const day = date.getUTCDate();
            const hour = date.getUTCHours();
            const minute = date.getUTCMinutes();
            const second = date.getUTCSeconds();
            const pad = (num: number) => (num < 10 ? '0' + num : num);
            const current_time = `${year}-${pad(month)}-${pad(day)} ${pad(hour-5)}:${pad(minute)}`;
            // console.log(current_time);
            
            // Log Call
            const response = await FrappeCall('timeclock.www.job_timeclock.log_out_employee', { token: token, time: current_time });
            
            if (response?.status === 'success') {
                console.log('You are now logged out.', response.log)
                this.activeSession= false
                this.token = null
                this.tokenExpiration = 0
                this.jobCards= []
                this.selectedWorkOrder= null
                this.workOrders = []
                this.employeeId= ''
                this.employeeName= ''
                this.employees= []
                
                }
            else {
                console.log('Did not work. You are still logged in:', response.log)
            }
        },
        async get_employees(){
            const response = await FrappeCall('timeclock.www.job_timeclock.get_employees');
            if (response?.status === 'success'){
                this.employees = response.employees
                // console.log(this.employees)
            }
            
        },

        get_token_from_employee(employee: Employee){
            // console.log(employee)
            this.authenticateEmployee(employee.sCode);
        },

        // To receive send_login Emit from StartScreen.vue
        receive_login(sCode: string){
            console.log('Receive login succeeded: ', sCode)
            this.authenticateEmployee(sCode);
        },

        refresh_page(){
            window.location.reload();
            console.log('Page reloaded.')
        },

        show_dropdown(){
            this.active_dropdown = true;
            console.log('drop down:', this.active_dropdown)
        },

        select_workstation(workstation){
            console.log('Workstation Name',workstation)

        }


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
            ignoreIfFocusOn: '.frappe-input',
            
        });

        this.scanner = scanner;
        // this.scanner.simulate(document, '1234512345');

        watch(() => this.token, (newToken) => {
            // If you don't do this, it will refresh every time you switch work orders.
            // console.log('watching.')
            if (newToken !== this.token) {
                this.decodeToken();
            } 
            else if(newToken){
                this.decodeToken();
            } 
            else {
                // console.log('Token is the same.')
            }
        }, { immediate: true },
        )
    }
});
</script>

<style scoped>
.job_card_list-enter-active,
.job_card_list-leave-active{
    transition: opacity 1s ease-out;
}

.job_card_list-enter-from,
.job_card_list-leave-to {
  opacity: 0;
}
</style>