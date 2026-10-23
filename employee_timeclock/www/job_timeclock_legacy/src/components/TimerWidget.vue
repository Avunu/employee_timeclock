<template>
	<!-- <div v-if="taskStarted" class="fixed bottom-4 right-4 p-4 bg-gray-200 rounded-lg shadow-md"> -->
	<div>
		<h4 class="font-bold text-xl">Task Timer</h4>
		<button
			class="bg-green-400 text-white font-normal lg:text-3xl focus:bg-green-200 rounded-md px-2 py-4 lg:px-8 lg:py-8"
			@click="startTask(jobCard)"
			v-if="taskStarted === false && completed_jobCard === false"
		>
			Start Timer
		</button>
		<button
			class="bg-red-400 text-white font-normal lg:text-3xl focus:bg-red-200 rounded-md px-2 py-4 lg:px-8 lg:py-8"
			@click="stopTask(jobCard)"
			v-if="taskStarted && completed_jobCard === false"
		>
			Stop Timer
		</button>
		<button
			class="bg-gray-800 text-white font-normal lg:text-3xl focus:bg-gray-200 rounded-md px-2 py-4 lg:px-8 lg:py-8"
			@click="complete_task(jobCard)"
		>
			Complete
		</button>
		<p class="text-gray-700 text-md font-family-sans" v-if="completed_jobCard === false">
			{{ elapsedTime }}
		</p>
	</div>
</template>

<script lang="ts">
import { defineComponent, PropType, watch } from "vue";
import { JobCard } from "../types/JobCard";
import { START_LOCATION } from "vue-router";
import { useThrottledRefHistory, useStorage } from "@vueuse/core";
import { FrappeCall } from "../../../FrappeCall.js";
import { useToast } from "vue-toastification";
const toast = useToast();

export default defineComponent({
	name: "TimerWidget",

	data(): {
		taskStarted: Boolean;
		startTime: Date;
		elapsedTime: String;
		interval: Object;
		completed_jobCard: Boolean;
		start_time_frappe: Date;
	} {
		return {
			taskStarted: false,
			startTime: new Date(),
			elapsedTime: "00:00:00",
			interval: null as any, // Adjust as necessary
			completed_jobCard: false,
			start_time_frappe: new Date(),
		};
	},

	props: {
		jobCard: {
			type: Object as PropType<JobCard>,
			default: () => {},
		},
		employee_id: String,

		// watch: {
		//   jobCard(new_card, old_card){

		//   }
		// },
	},
	methods: {
		get_time_in_string(date: Date) {
			const year = date.getUTCFullYear();
			const month = date.getUTCMonth() + 1; // Months are zero-based
			const day = date.getUTCDate();
			const hour = date.getUTCHours();
			const minute = date.getUTCMinutes();
			const second = date.getUTCSeconds();
			const pad = (num: number) => (num < 10 ? "0" + num : num);
			const frappeString = `${year}-${pad(month)}-${pad(day)} ${pad(hour - 5)}:${pad(minute)}:${pad(second)}`;

			return frappeString;
		},

		async startTask(jobCard: JobCard) {
			this.startTime = new Date();
			this.start_time_frappe = this.get_time_in_string(this.startTime);
			// this.$emit('send_start_time', this.start_time_frappe, jobCard.name);

			// Server call to test time.
			// console.log('start_time',this.start_time_frappe);
			// console.log(this.employee_id)
			const response = await FrappeCall(
				"employee_timeclock.www.job_timeclock.log_start_time_of_jobcard",
				{
					employee_id: this.employee_id,
					start_time: this.start_time_frappe,
					jobcard_name: jobCard.name,
				},
			);

			if (response?.status === "success") {
				// console.log('Start Time sent.')
				// console.log('Started Time: ', response.card_logged_out)
				this.taskStarted = true;
				this.start_timer(this.startTime);
				this.timer_started = true;
				this.$emit("emit_timer", this.timer_started);
				this.jobCard.is_active = true;
				if (response.card_logged_out !== "no cards logged out") {
					// Make Sure the new card's is_active value is updated as well.
					console.log(response.card_logged_out);
					toast.success(`Another card was logged out.`);
					this.$emit("emit_logged_out_card", {
						card_logged_out: response.card_logged_out,
						card_logged_in: this.jobCard,
					});
				}
			} else {
				toast.error(`${this.jobCard.Operation} failed to start.`);
				console.log("did not work.");
				console.log(response.job_card);
			}
		},

		start_timer(time) {
			this.interval = setInterval(() => {
				const now = new Date();
				const timeDiff = now.getTime() - time.getTime();

				const hours = Math.floor(timeDiff / (1000 * 60 * 60));
				const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
				const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

				this.elapsedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
			}, 1000);
		},

		async stopTask(jobCard: JobCard) {
			// console.log('Stop', name)
			this.endTime = new Date();
			this.end_time_frappe = this.get_time_in_string(this.endTime);
			// console.log('frappe end time', this.end_time_frappe)
			// this.$emit('send_end_time', this.end_time_frappe, jobCard.name);

			const response = await FrappeCall(
				"employee_timeclock.www.job_timeclock.log_end_time_of_jobcard",
				{
					employee_id: this.employee_id,
					end_time: this.end_time_frappe,
					jobcard_name: jobCard.name,
				},
			);

			if (response?.status === "success") {
				console.log("End Time sent.");
				clearInterval(this.interval);
				this.taskStarted = false;
				this.timer_started = false;
				this.$emit("emit_timer", this.timer_started);
				// console.log('end_time',this.end_time_frappe)
				this.jobCard.is_active = false;
			} else {
				toast.error(`${this.jobCard.Operation} failed to end.`);
				console.log("End job card did not work.");
			}
		},

		async complete_task(jobCard) {
			if (this.completed_jobCard === false) {
				console.log(this.jobCard);
				if (confirm("Are you sure you want to submit?")) {
					// this.completed_jobCard = true
					const now = new Date();
					const complete_time = this.get_time_in_string(now);
					const response = await FrappeCall("employee_timeclock.www.job_timeclock.submit_jobcard", {
						jobCard: jobCard,
						complete_time: complete_time,
						employee_id: this.employee_id,
					});
					if (response?.status === "success") {
						this.completed_jobCard = true;
						console.log(response.job_card);
					} else {
						this.completed_jobCard = false;
						console.log(response.error_message);
					}
				} else {
					this.completed_jobCard = false;
				}
			} else {
				console.log("aye");
			}
		},

		initialize_ongoing_timer() {
			this.taskStarted = true;
			const time_from = this.jobCard.time_logs.from_time;
			this.start_time = new Date(time_from);
			this.start_timer(this.start_time);

			// This is to change style in job card widget.
			this.timer_started = true;
			this.$emit("emit_timer", this.timer_started);
			// console.log('if statement failed.')
		},
	},

	mounted() {
		// Turn off timer and buttons if job card is already complete.
		if (this.jobCard.status === "Completed") {
			this.completed_jobCard = true;
		}

		watch(
			() => this.jobCard.is_active,
			(newStatus) => {
				// If you don't do this, it will refresh every time you switch work orders.
				// console.log('watching.')
				if (newStatus === false) {
					// console.log('Status now False.')
					this.taskStarted = false;
					clearInterval(this.interval);
					this.timer_started = false;
					this.$emit("emit_timer", this.timer_started);
					// console.log('end_time',this.end_time_frappe)
				}
			},
			{ immediate: true },
		);
	},

	beforeMount() {
		if (this.jobCard.is_active === true) {
			this.initialize_ongoing_timer();
		} else {
			this.taskStarted = false;
			// Initializer time on timer for a previously started timer.
		}
	},

	unmounted() {
		// clearInterval(this.interval);
	},
});
</script>

<!-- <style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400&display=swap');

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Poppins', sans-serif;
}

.container {
  max-width: 500px;
  margin: 30px auto;
  overflow: auto;
  min-height: 300px;
  border: 1px solid steelblue;
  padding: 30px;
  border-radius: 5px;
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

.stop {
  display: inline-block;
  background: #ff8181;
  color: #ffffff;
  border: none;
  padding: 12px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
}

.complete {
  display: inline-block;
  background: #494949;
  color: #ffffff;
  border: none;
  padding: 12px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
}

.btn:focus {
  outline: none;
  display: inline-block;
  background: rgb(197, 255, 219);
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

.btn:active {
  transform: scale(0.98);
  background: rgb(197, 255, 219);
}

.btn-block {
  display: block;
  width: 100%;
} -->
<!-- </style> -->
