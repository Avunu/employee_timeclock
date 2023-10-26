<template>
    
    <div v-if="taskStarted" class="fixed bottom-4 right-4 p-4 bg-gray-200 rounded-lg shadow-md">
        <h4 class="font-bold text-xl">Task Timer</h4>
        <button @click="startTask">Start Timer</button>
        <button @click="stopTask">End Timer</button>
        <p class="text-gray-700">{{ elapsedTime }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, onUnmounted } from 'vue';

export default defineComponent({
    name: 'TimerWidget',
    data() {
        return {
            taskStarted: false,
            startTime: new Date(),
            elapsedTime: '00:00:00',
            interval: null as any, // Adjust as necessary
        };
    },
    methods: {
        startTask() {
            this.taskStarted = true;
            this.startTime = new Date();
            this.interval = setInterval(() => {
                const now = new Date();
                const timeDiff = now.getTime() - this.startTime.getTime();

                const hours = Math.floor(timeDiff / (1000 * 60 * 60));
                const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

                this.elapsedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
            }, 1000);
        },

        stopTask() {
            this.taskStarted = false;
            clearInterval(this.interval);
        },
    },
    mounted() {
        // Optional logic here
        console.log(`Does this work.`)
    },
    unmounted() {
        clearInterval(this.interval);
    },
});
</script>
