<template>
    <div v-if="taskStarted" class="fixed bottom-4 right-4 p-4 bg-gray-200 rounded-lg shadow-md">
        <h4 class="font-bold text-xl">Task Timer</h4>
        <p class="text-gray-700">{{ elapsedTime }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const taskStarted = ref(false);
const startTime = ref(null);
const elapsedTime = ref('00:00:00');

let interval;

const startTask = () => {
    taskStarted.value = true;
    startTime.value = new Date();
    interval = setInterval(() => {
        const now = new Date();
        const timeDiff = now - startTime.value;

        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

        elapsedTime.value = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
}

const stopTask = () => {
    taskStarted.value = false;
    clearInterval(interval);
}

onMounted(() => {
    // Optional logic here
});

onUnmounted(() => {
    clearInterval(interval);
});

// You can export functions if needed to control the timer from outside
defineExpose({
    startTask,
    stopTask
});
</script>
