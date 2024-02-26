<template>
  <div class="text-black-500 xl:text-2xl">
    <strong>Employee:</strong> {{ employeeName }}
    <div v-if="tokenExpiration" class="text-gray-500 text-m xl:text-xl">
      {{ timeLeftDisplay }}
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
      if (timeLeft.value >0){
        return `Timeout in ${minutes}m ${seconds}s`;
      } else {
        return `Session Timed Out.`;
      }
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
      } else {
        // console.log()
        }
    });

    onUnmounted(() => {
      clearInterval(intervalId);

    });

    return {
      timeLeftDisplay,
    };
  }
}
</script>

