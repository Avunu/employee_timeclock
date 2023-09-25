<template>
	<div>
	<H1>{{ header }}</H1>
		<div v-show="message" style="margin: 2em; font-size: 300%">
			<p>{{ message }}</p>
		</div>
		<table v-show="employee_id" class="table text-center h2" style="font-weight: 800">
			<tbody>
				<tr><td>Log Type</td><td>Time</td><td>Device</td></tr>
				<tr v-for="checkin of checkins" :key="checkin.name">
					<td>{{ checkin.log_type }}</td>
					<td>{{ checkin.time }}</td>
					<td>{{ checkin.device_id }}</td>
				</tr>
			</tbody>
		</table>
		<div v-show="employee_id" style="width: 100%; display: flex; align-items: center; margin-top: 2em">
			<button class="btn btn-lg" 
			:class="logType == 'OUT' ? 'btn-primary' : ''"
			style="width: 45%; margin-right: 1ch; font-size: 200%"
			@click="log_in(employee_id)"
			>LOG IN</button>
			<button class="btn btn-lg"
			:class="logType == 'IN' ? 'btn-primary' : ''"
			style="width: 45%; margin-left: 1ch; font-size: 200%"
			@click="log_out(employee_id)"
			>LOG OUT</button>
		</div>
	</div>
</template>
<script setup>
import { onMounted, ref } from 'vue'
import onScan from 'onscan.js'

const message = ref('')
const employee_name = ref('')
const employee_id = ref('')
let checkins = ref([])
let logType = ref('')
let header = ref('Please Scan In')


onMounted(() => {
	const scanner = onScan.attachTo(document, {
		onScan: async function (sCode, iQty) {
			await scan(sCode, iQty)
		},
		ignoreIfFocusOn: '.frappe-input',
	})
	window.scanner = scanner
})

async function scan(sCode, iQty) {
	return new Promise(resolve => {
		frappe.xcall('timeclock.www.timeclock.scan', { barcode: sCode, current_qty: iQty }).then(r => {
			if (r) {
				if(r.reload_timeclock){
					header.value = 'Please Wait ... Reloading Timeclock'
					setTimeout(() => {
						location.reload()
						resolve()
					}, 3000)
					return
				}
				checkins = r.checkins
				if(checkins && checkins.length){
					logType.value = checkins[0].log_type
				}
				message.value = r.message
				employee_name.value = r.employee_name
				header.value = `Hello ${employee_name.value}`
				employee_id.value = r.employee_id
				setTimeout(() => {
					header.value = 'Please Scan In'
					message.value = ''
					employee_name.value = ''
					employee_id.value = ''
					logType.value = ''
					checkins.splice(0)
				}, 20000)
				resolve()
			}
		})
	})
}

async function log_in(employee_id_number) {
	return new Promise(resolve => {
		frappe.xcall('timeclock.www.timeclock.log_in', { 'employee_id': employee_id_number}).then(r => {
			if (r) {
				message.value = r.message
				employee_name.value = ''
				logType.value = ''
				header.value = 'Thank You'
				employee_id.value = ''
				checkins.splice(0)
				setTimeout(() => {
					message.value = ''
					header.value = 'Please Scan In'
				}, 5000)
				resolve()
			}
		})
	})
}

async function log_out(employee_id_number) {
	return new Promise(resolve => {
		frappe.xcall('timeclock.www.timeclock.log_out', { 'employee_id': employee_id_number }).then(r => {
			if (r) {
				message.value = r.message
				employee_name.value = ''
				logType.value = ''
				header.value = 'Thank You'
				checkins.splice(0)
				employee_id.value = ''
				setTimeout(() => {
					message.value = ''
					header.value = 'Please Scan In'
				}, 5000)
				resolve()
			}
		})
	})
}

</script>