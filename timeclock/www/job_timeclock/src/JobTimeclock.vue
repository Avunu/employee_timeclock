<template>
    <header class="bg-white shadow">
        <div class="mx-auto px-4 py-6 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 class="text-3xl font-bold tracking-tight text-gray-900">{{ header }}</h1>
            <span v-if="employeeName" class="text-gray-500 text-sm"><strong>Employee:</strong> {{ employeeName }}</span>
        </div>
    </header>
    <main v-if="token">
        <div class="flex">
            <div id="WorkOrders" class="w-1/2 mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <div class="px-4 py-6 sm:px-0">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                        Work Orders
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">
                        Select a work order to start tracking time.
                    </p>
                </div>
                <ul role="list">
                    <li v-for="work_order in work_orders" :key="work_order.name"
                        :class="[defaultCardClasses, { 'bg-blue-100': work_order === selectedWorkOrder }]"
                        @click="selectWorkOrder(work_order)">
                        <div class="flex flex-col">
                            <span class="font-semibold text-gray-900">{{ work_order.name }}</span>
                            <span>{{ work_order.production_item }}</span>
                        </div>
                        <span
                            class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                            {{ work_order.status }}
                        </span>
                    </li>
                </ul>
            </div>
            <div id="JobCards" class="w-1/2 mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
                <div class="px-4 py-6 sm:px-0">
                    <h3 class="text-lg leading-6 font-medium text-gray-900">
                        Job Cards
                    </h3>
                    <p class="mt-1 text-sm text-gray-500">
                        Select a job card to start tracking time.
                    </p>
                </div>
                <!-- Job Cards section -->
                <ul role="list">
                    <li v-for="job_card in job_cards" :key="job_card.name" :class="defaultCardClasses">
                        {{ job_card.name }}
                        <!-- Start/Stop button -->
                        <Button @click="toggleTimer(job_card.status)"
                            :label="job_card.status === 'started' ? 'Stop' : 'Start'"></Button>
                    </li>
                </ul>
            </div>
        </div>
        <!-- Timer Widget in the bottom right corner -->
        <TimerWidget ref="timerRef" class="fixed bottom-4 right-4" />
    </main>
    <Dialog v-model="showDialog">
        <template #body-title>
            <h3>Waiting for authentication</h3>
        </template>
        <template #body-content>
            <div class="flex flex-col items-center">
                <Spinner class="w-8 mb-4" />
                <p>Please scan your employee ID to continue.</p>
            </div>
        </template>
    </Dialog>
</template>

<script setup>
import { FrappeCall } from '../../FrappeCall.js';
import { onMounted, ref } from 'vue'
import { useStorage } from '@vueuse/core'
import { Button, Dialog } from 'frappe-ui'
import TimerWidget, { startTask, stopTask } from './components/TimerWidget.vue';
import onScan from 'onscan.js'



const defaultCardClasses = 'divide-y divide-gray-100 rounded-md border border-gray-200 flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6 mt-2 mb-2';

const work_orders = ref([]);
const job_cards = ref([]);
const header = ref('Job Timeclock')
const token = useStorage('token', null);
const employeeName = useStorage('employee_name', null);
const selectedWorkOrder = ref(null);
const showDialog = ref(false);

onMounted(() => {
    if (!token.value) {
        showDialog.value = true;
    }
    const scanner = onScan.attachTo(document, {
        onScan: async function (sCode) {
            console.log(sCode)
            await authenticate_employee(sCode)
        },
        ignoreIfFocusOn: '.frappe-input',
    })
    window.scanner = scanner
    // if a token is already set, then call getWorkOrders
    if (token.value) {
        getWorkOrders()
    }
})

async function authenticate_employee(sCode) {
    return new Promise(resolve => {
        FrappeCall('timeclock.www.job_timeclock.authenticate_employee', { rfid: sCode }).then(r => {
            if (r) {
                if (r.status == 'success') {
                    token.value = r.token
                    employeeName.value = r.employee_name
                    console.log("Hurrah! You are authenticated as " + r.employee_name)
                    getWorkOrders()
                    showDialog.value = false;
                }
                else {
                    console.log("Sorry! You are not authenticated.")
                }
                resolve()
            }
        })
    })
}

async function getWorkOrders() {
    return new Promise(resolve => {
        FrappeCall('timeclock.www.job_timeclock.get_work_orders', { token: token.value }).then(r => {
            if (r) {
                if (r.status == 'success') {
                    work_orders.value = r.work_orders
                }
                else {
                    work_orders.value = []
                }
                resolve()
            }
        })
    })
}

function selectWorkOrder(work_order) {
    selectedWorkOrder.value = work_order;
    getJobCards(work_order.name)
}

async function getJobCards(work_order) {
    return new Promise(resolve => {
        FrappeCall('timeclock.www.job_timeclock.get_job_cards', { token: token.value, work_order: work_order }).then(r => {
            if (r) {
                if (r.status == 'success') {
                    job_cards.value = r.job_cards
                }
                else {
                    job_cards.value = []
                }
                resolve()
            }
        })
    })
}

</script>