<template>
    
    <!-- <div v-if="taskStarted" class="fixed bottom-4 right-4 p-4 bg-gray-200 rounded-lg shadow-md"> -->
    <div>
        <h4 class="font-bold text-xl justify-end">Task Timer</h4>
        <button class="btn" @click="startTask(jobCard)" v-if="taskStarted === false && completed_jobCard === false">Start Timer</button>
        <button class="stop" @click="stopTask(jobCard)" v-if="taskStarted  && completed_jobCard === false">Stop Timer</button>
        <button class="complete" @click="complete_task" >Complete</button>
        <p class="text-gray-700" v-if="completed_jobCard === false">{{ elapsedTime }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted, PropType, watch } from 'vue';
import { JobCard } from '../types/JobCard';
import { START_LOCATION } from 'vue-router';
import { useThrottledRefHistory } from '@vueuse/core';

export default defineComponent({
    name: 'TimerWidget',
    
    data(): {
        taskStarted: Boolean,
        startTime: Date,
        elapsedTime: String,
        interval: Object,
        completed_jobCard: Boolean,

    } {
        return {
            taskStarted: false,
            startTime: new Date(),
            elapsedTime: '00:00:00',
            interval: null as any, // Adjust as necessary
            completed_jobCard: false,
        };
    },

    props: {
        jobCard: {
          type: Object as PropType<JobCard>,
            default: () => {},
        },
    },
    methods: {
        get_time_in_string(date: Date){
          const year = date.getUTCFullYear();
          const month = date.getUTCMonth() + 1; // Months are zero-based
          const day = date.getUTCDate();
          const hour = date.getUTCHours();
          const minute = date.getUTCMinutes();
          const second = date.getUTCSeconds();
          const pad = (num: number) => (num < 10 ? '0' + num : num);
          const frappeString = `${year}-${pad(month)}-${pad(day)} ${pad(hour-5)}:${pad(minute)}:${pad(second)}`;
          
          return frappeString
        },
      
        startTask(jobCard: JobCard) {
          this.taskStarted = true;
            
          // if (jobCard.time_log.to_time){
          //   this.startTime = new Date();

          //   } else{  
          //     this.startTime = jobCard.time_log.from_time
          //     this.startTime = new Date(this.startTime)
          //   }
            
            this.startTime = new Date();
            this.start_time_frappe = this.get_time_in_string(this.startTime);
            // console.log('frappe time', this.start_time_frappe)
            this.$emit('send_start_time', this.start_time_frappe, jobCard.name);
            // console.log('start time', this.startTime)

            this.start_timer(this.startTime)
        },

        start_timer(time){
          this.interval = setInterval(() => {
                const now = new Date();
                const timeDiff = now.getTime() - time.getTime();

                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

                this.elapsedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            
            }, 1000);
        },

        stopTask(jobCard: JobCard) {
            // console.log('Stop', name)
            this.endTime = new Date();
            this.end_time_frappe = this.get_time_in_string(this.endTime);
            // console.log('frappe end time', this.end_time_frappe)
            this.$emit('send_end_time', this.end_time_frappe, jobCard.name);
            this.taskStarted = false;
            
            clearInterval(this.interval);
        },

        complete_task(){
          if (this.completed_jobCard === false){
            if(confirm('Are you sure you want to submit?')) {
              this.completed_jobCard = true
            } else {
              this.completed_jobCard = false
          // Put logic here to submit job Card
        }
      } else {
        console.log('aye')
      }
    },
  },

    mounted() {
        
        // Turn off timer and buttons if job card is already complete.
        if (this.jobCard.status === 'Completed'){
          this.completed_jobCard = true
          // console.log(this.jobCard.name)
        }

        // watch(() => this.jobCard, (new_jobCard) => {
        //   if (this.JobCard.time_log.start_timer && this.JobCard.time_log.from_time == ''){
        //     this.taskStarted = true
        //     const time_from = this.jobCard.time_log.from_time
        //     this.start_time = new Date(time_from)
        //     this.start_timer(this.start_time)
        //   }
        // })
    },

    beforeMount(){
        // console.log('jobcard in timerwidget',this.jobCard);

        if (this.jobCard.time_log.time_in_mins !== 0){
          this.taskStarted = false
          // console.log('if statement failed.')
        } else {
          // Initializer time on timer for a previously started timer. 
          this.taskStarted = true
          const time_from = this.jobCard.time_log.from_time
          this.start_time = new Date(time_from)
          this.start_timer(this.start_time)
        }
        
    },

    unmounted() {
        // clearInterval(this.interval);
    },

});

</script>

<style scoped>
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
}
</style>