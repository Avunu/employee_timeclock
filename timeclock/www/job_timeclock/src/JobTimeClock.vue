<template>
    <header class="bg-white shadow fixed w-screen top-0 z-10 h-20">
        <div class="mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 class="text-3xl font-bold tracking-tight text-gray-900">{{ header }}</h1>
            <SessionTimer :employeeName="employeeName" :tokenExpiration="tokenExpiration" v-if="isSessionActive" />
        </div>
    </header>

    <main class="flex h-screen overflow-hidden pt-16" v-if="isSessionActive">
        <!-- When session is active -->
        <!-- Work Orders Section -->
        <WorkOrderList :workOrders="workOrders" :selectedWorkOrder="selectedWorkOrder" @select="selectWorkOrder" />

        <!-- Job Cards Section -->
        <JobCardList :jobCards="jobCards" v-if="selectedWorkOrder" @toggleTimer="toggleTimer" />

        <!-- Timer Widget -->
        <TimerWidget ref="timerRef" class="fixed bottom-4 right-4" />
    </main>

    <main v-else>
        <!-- When session is inactive -->
        <AuthorizationMessage />
    </main>
</template>

<script lang="ts">
import { defineComponent, provide, watch } from 'vue';
import { useStorage } from '@vueuse/core';
import jwtDecode from 'jwt-decode';
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

export default defineComponent({
    name: 'JobTimeClock',
    components: {
        AuthorizationMessage,
        JobCardList,
        SessionTimer,
        TimerWidget,
        WorkOrderList
    },
    data(): {
        employeeId: string,
        employeeName: string,
        header: string,
        jobCards: JobCard[],
        selectedWorkOrder: WorkOrder | null,
        showAuthMessage: boolean,
        token: string | null,
        tokenExpiration: number,
        workOrders: WorkOrder[]
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
            workOrders: []
        };
    },
    computed: {
        isSessionActive() {
            const currentTime = Date.now();
            return (this.tokenExpiration && this.tokenExpiration > currentTime) as boolean;
        }
    },
    methods: {
        async authenticateEmployee(sCode: string) {
            const response = await FrappeCall('timeclock.www.job_timeclock.authenticate_employee', { rfid: sCode });

            if (response?.status === 'success') {
                this.token = response.token;
                await this.getWorkOrders();
            } else {
                console.log("Sorry! You are not authenticated.");
            }
        },

        async decodeToken() {
            const tokenData: any = jwtDecode(this.token);
            this.tokenExpiration = tokenData.exp * 1000;
            this.employeeId = tokenData.employee_id;
            this.employeeName = tokenData.employee_name;
            console.log("Hurrah! You are authenticated as ", tokenData.employee_name);
        },

        async getWorkOrders() {
            const response = await FrappeCall('timeclock.www.job_timeclock.get_work_orders', { token: this.token });

            if (response?.status === 'success') {
                this.token = response.token;
                this.workOrders = response.work_orders;
                console.log(this.workOrders);
            } else {
                this.workOrders = [];
            }
        },

        selectWorkOrder(workOrder: any) {
            this.selectedWorkOrder = workOrder;
            this.getJobCards(workOrder.name);
        },

        async getJobCards(workOrderName: string) {
            const response = await FrappeCall('timeclock.www.job_timeclock.get_job_cards', { token: this.token, work_order: workOrderName });

            if (response?.status === 'success') {
                this.token = response.token;
                this.jobCards = response.job_cards;
            } else {
                this.jobCards = [];
            }
        },
    },
    mounted() {
        if (this.token) {
            this.getWorkOrders();
        }

        const scanner = onScan.attachTo(document, {
            onScan: this.authenticateEmployee,
            ignoreIfFocusOn: '.frappe-input',
        });

        window.scanner = scanner;

        watch(() => this.token, (newToken) => {
            if (newToken) {
                this.decodeToken();
            }
        }, { immediate: true });
    }
});
</script>