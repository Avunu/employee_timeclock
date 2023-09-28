<template>
  <div class="text-gray-500 text-sm">
    <strong>Employee:</strong> {{ employeeName }}
    <div v-if="tokenExpiration">
      Timeout in {{ timeLeftDisplay }}
    </div>
  </div>
</template>
  
<script>
import { ref, computed, watchEffect, onUnmounted } from 'vue';

export default {
  name: 'SessionTimer',
  props: {
    employeeName: {
      type: String,
      required: true,
    },
    tokenExpiration: {
      type: Number,
      required: true,
    },
  },
  setup(props) {

    let intervalId = null;
    const timeLeft = ref(0); // this will store the actual remaining time

    const timeLeftDisplay = computed(() => {
      const minutes = Math.floor(timeLeft.value / 60);
      const seconds = timeLeft.value % 60;
      return `${minutes}m ${seconds}s`;
    });

    const updateRemainingTime = () => {
      const now = Date.now();
      timeLeft.value = Math.floor((props.tokenExpiration - now) / 1000);
    };

    watchEffect(() => {
      clearInterval(intervalId);
      if (props.tokenExpiration && props.tokenExpiration > Date.now()) {
        intervalId = setInterval(updateRemainingTime, 1000);
        updateRemainingTime(); // immediately update
      }
    });

    onUnmounted(() => {
      clearInterval(intervalId);
    });

    return {
      timeLeftDisplay,
    };
  },
};
</script>
