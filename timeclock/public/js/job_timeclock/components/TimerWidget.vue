<template>

  <!-- <div v-if="taskStarted" class="fixed bottom-4 right-4 p-4 bg-gray-200 rounded-lg shadow-md"> -->
  <div>
    <div class="flex gap-4 justify-end">
      <!-- Regular Timer Section -->
      <div class="flex flex-col items-center border border-gray-300 rounded-lg p-3 bg-gray-50">
        <button
          class="bg-green-400 text-white font-normal text-lg lg:text-xl focus:bg-green-200 rounded-md px-4 py-3 lg:px-6 lg:py-4"
          @click="startTask(jobCard)" v-if="taskStarted === false && completedJobCard === false">Start Timer</button>
        <button class="bg-red-400 text-white font-normal text-lg lg:text-xl focus:bg-red-200 rounded-md px-4 py-3 lg:px-6 lg:py-4"
          @click="stopTask(jobCard)" v-if="taskStarted && completedJobCard === false">Stop Timer</button>
        <p class="text-gray-700 text-md font-family-sans mt-2" v-if="completedJobCard === false">{{ elapsedTime }}</p>
      </div>
      <!-- Rework Timer Section -->
      <div class="flex flex-col items-center border border-orange-300 rounded-lg p-3 bg-orange-50">
        <button
          class="bg-orange-500 text-white font-normal text-lg lg:text-xl focus:bg-orange-300 rounded-md px-4 py-3 lg:px-6 lg:py-4"
          @click="startRework(jobCard)" v-if="reworkStarted === false && completedJobCard === false">Start Rework</button>
        <button
          class="bg-orange-700 text-white font-normal text-lg lg:text-xl focus:bg-orange-400 rounded-md px-4 py-3 lg:px-6 lg:py-4"
          @click="stopRework(jobCard)" v-if="reworkStarted && completedJobCard === false">Stop Rework</button>
        <p class="text-orange-600 text-md font-family-sans font-bold mt-2" v-if="completedJobCard === false">{{ reworkElapsedTime }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue';
import type { PropType } from 'vue';
import type { JobCard } from '../types/JobCard';
import type { FrappeDateTimeString } from '../types/FrappeDateTime';
import { dateToFrappeDateTimeString } from '../types/FrappeDateTime';
import { useStorage } from '@vueuse/core';
import { frappeCall } from '../../FrappeCall';
import { useToast } from 'vue-toastification';
import type { LogStartTimeResponse, LogEndTimeResponse, LogReworkStartResponse, LogReworkEndResponse } from '../types/api';
const toast = useToast()

export default defineComponent({
  name: 'TimerWidget',

  data(): {
    completedJobCard: boolean,
    elapsedTime: string,
    interval: ReturnType<typeof setInterval> | null,
    reworkElapsedTime: string,
    reworkInterval: ReturnType<typeof setInterval> | null,
    reworkStarted: boolean,
    reworkStartTime: Date,
    reworkStartTimeFrappe: FrappeDateTimeString | null,
    startTime: Date,
    startTimeFrappe: FrappeDateTimeString | null,
    taskStarted: boolean,
    timerStarted: boolean,
    endTime: Date | null,
    end_time_frappe: FrappeDateTimeString | null,
  } {
    return {
      completedJobCard: false,
      elapsedTime: '00:00:00',
      interval: null,
      reworkElapsedTime: '00:00:00',
      reworkInterval: null,
      reworkStarted: false,
      reworkStartTime: new Date(),
      reworkStartTimeFrappe: null,
      startTime: new Date(),
      startTimeFrappe: null,
      taskStarted: false,
      timerStarted: false,
      endTime: null,
      end_time_frappe: null,
    };
  },

  props: {
    jobCard: {
      type: Object as PropType<JobCard>,
      default: () => { },
    },
    employee_id: String,

    // watch: {
    //   jobCard(new_card, old_card){

    //   }
    // },
  },
  methods: {


    getTimeInString(date: Date): FrappeDateTimeString {
      return dateToFrappeDateTimeString(date, 5);
    },

    async startTask(jobCard: JobCard) {
      // Stop rework timer if it's running (mutually exclusive)
      if (this.reworkStarted) {
        await this.stopRework(jobCard);
      }

      this.startTime = new Date();
      this.startTimeFrappe = this.getTimeInString(this.startTime);
      // this.$emit('send_start_time', this.startTimeFrappe, jobCard.name);

      // Server call to test time. 
      // console.log('start_time',this.startTimeFrappe);
      // console.log(this.employee_id)
      const response = await frappeCall<LogStartTimeResponse>('timeclock.www.job_timeclock.log_start_time_of_jobcard', { employee_id: this.employee_id, start_time: this.startTimeFrappe, jobcard_name: jobCard.name });

      if (response.status === 'success') {
        // console.log('Start Time sent.')
        // console.log('Started Time: ', response.card_logged_out)
        this.taskStarted = true
        this.start_timer(this.startTime)
        this.timerStarted = true
        this.$emit('emit_timer', this.timerStarted)
        this.jobCard.is_active = true
        if (response.card_logged_out !== 'no cards logged out') {
          // Make Sure the new card's is_active value is updated as well.
          console.log(response.card_logged_out)
          toast.success(`Another card was logged out.`);
          this.$emit('emit_logged_out_card', { "card_logged_out": response.card_logged_out, "card_logged_in": this.jobCard })

        }
      }
      else {
        toast.error(`${this.jobCard.operation} failed to start.`);
        console.log('did not work.')
        console.log(response.job_card)
      }

    },

    formatElapsedTime(startTime: Date): string {
      const now = new Date();
      const timeDiff = now.getTime() - startTime.getTime();

      const hours = Math.floor(timeDiff / (1000 * 60 * 60));
      const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    },

    start_timer(time: Date): void {
      this.interval = setInterval(() => {
        this.elapsedTime = this.formatElapsedTime(time);
      }, 1000);
    },

    async stopTask(jobCard: JobCard) {
      // console.log('Stop', name)
      this.endTime = new Date();
      this.end_time_frappe = this.getTimeInString(this.endTime);
      // console.log('frappe end time', this.end_time_frappe)
      // this.$emit('send_end_time', this.end_time_frappe, jobCard.name);

      const response = await frappeCall<LogEndTimeResponse>('timeclock.www.job_timeclock.log_end_time_of_jobcard', { employee_id: this.employee_id, end_time: this.end_time_frappe, jobcard_name: jobCard.name });

      if (response.status === 'success') {
        console.log('End Time sent.')
        if (this.interval !== null) {
          clearInterval(this.interval);
          this.interval = null;
        }
        this.taskStarted = false;
        this.timerStarted = false;
        this.$emit('emit_timer', this.timerStarted)
        // console.log('end_time',this.end_time_frappe)
        this.jobCard.is_active = false
      }
      else {
        toast.error(`${this.jobCard.operation} failed to end.`);
        console.log('End job card did not work.')
      }

    },

    async startRework(jobCard: JobCard) {
      // Stop regular timer if it's running (mutually exclusive)
      if (this.taskStarted) {
        await this.stopTask(jobCard);
      }

      this.reworkStartTime = new Date();
      this.reworkStartTimeFrappe = this.getTimeInString(this.reworkStartTime);

      const response = await frappeCall<LogReworkStartResponse>('timeclock.www.job_timeclock.log_rework_start_time', {
        employee_id: this.employee_id,
        start_time: this.reworkStartTimeFrappe,
        jobcard_name: jobCard.name
      });

      if (response.status === 'success') {
        this.reworkStarted = true
        this.start_rework_timer(this.reworkStartTime)
        toast.success(`Rework started for ${jobCard.operation}.`);
      }
      else {
        toast.error(`${jobCard.operation} rework failed to start.`);
        console.log('Rework start did not work.')
      }
    },

    start_rework_timer(time: Date): void {
      this.reworkInterval = setInterval(() => {
        this.reworkElapsedTime = this.formatElapsedTime(time);
      }, 1000);
    },

    async stopRework(jobCard: JobCard) {
      this.endTime = new Date();
      this.end_time_frappe = this.getTimeInString(this.endTime);

      const response = await frappeCall<LogReworkEndResponse>('timeclock.www.job_timeclock.log_rework_end_time', {
        employee_id: this.employee_id,
        end_time: this.end_time_frappe,
        jobcard_name: jobCard.name
      });

      if (response.status === 'success') {
        console.log('Rework End Time sent.')
        if (this.reworkInterval !== null) {
          clearInterval(this.reworkInterval);
          this.reworkInterval = null;
        }
        this.reworkStarted = false;
        toast.success(`Rework completed for ${jobCard.operation}.`);
      }
      else {
        toast.error(`${jobCard.operation} rework failed to end.`);
        console.log('End rework did not work.')
      }
    },

    initialize_ongoing_timer(): void {
      this.taskStarted = true
      const time_from = this.jobCard.time_logs?.from_time
      if (!time_from) return;
      this.startTime = new Date(time_from)
      this.start_timer(this.startTime)

      // This is to change style in job card widget.
      this.timerStarted = true;
      this.$emit('emit_timer', this.timerStarted)
      // console.log('if statement failed.')

    }

  },

  mounted() {
    // Turn off timer and buttons if job card is already complete.
    if (this.jobCard.status === 'Completed') {
      this.completedJobCard = true
    }

    watch(() => this.jobCard.is_active, (newStatus) => {
      // If you don't do this, it will refresh every time you switch work orders.
      // console.log('watching.')
      if (newStatus === false) {
        // console.log('Status now False.')
        this.taskStarted = false
        if (this.interval !== null) {
          clearInterval(this.interval)
          this.interval = null;
        }
        this.timerStarted = false
        this.$emit('emit_timer', this.timerStarted)
        // console.log('end_time',this.end_time_frappe)
      }

    }, { immediate: true },
    )

  },

  beforeMount() {

    if (this.jobCard.is_active === true) {
      this.initialize_ongoing_timer()
    } else {
      this.taskStarted = false
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