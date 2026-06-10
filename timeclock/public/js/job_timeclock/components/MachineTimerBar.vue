<template>
  <div
    v-if="machineTimers.length > 0"
    class="relative bottom-0 left-0 right-0 z-1 bg-blue-50 border-t-2 border-blue-200 px-4 py-3 shadow-lg"
  >
    <div class="flex items-center gap-3 grow overflow-x-visible">
      <div
        v-for="timer in machineTimers"
        :key="`${timer.work_order}:${timer.operation}`"
        :class="[
          'flex flex-col gap-2 rounded-lg px-4 py-2 ring-2 shrink-0 cursor-pointer transition-colors',
          timer.is_corrective
            ? 'ring-orange-400 bg-orange-100 hover:bg-orange-200'
            : 'ring-blue-400 bg-blue-100 hover:bg-blue-200',
        ]"
        @click="$emit('navigate-to-timer', timer)"
      >
        <div class="flex items-center gap-2">
          <span
            :class="[
              'font-semibold text-lg truncate max-w-[13rem]',
              timer.is_corrective ? 'text-orange-800' : 'text-blue-800',
            ]"
          >
            {{ timer.operation }}
            <span v-if="timer.is_corrective" class="text-sm font-normal">(Rework)</span>
          </span>
          <span
            :class="[
              'font-mono text-lg font-bold',
              timer.is_corrective ? 'text-orange-900' : 'text-blue-900',
            ]"
          >
            {{ elapsed(timer) }}
          </span>
          <button
            :class="[
              'ml-1 p-1.5 rounded transition-colors',
              timer.is_corrective
                ? 'bg-orange-200 hover:bg-orange-300 text-orange-800'
                : 'bg-blue-200 hover:bg-blue-300 text-blue-800',
            ]"
            title="Stop Machine Timer"
            @click.stop="$emit('stop-machine-timer', timer)"
          >
            <div class="w-4 h-4 rounded-sm bg-current" />
          </button>
        </div>
        <div class="flex">
          <span
            :class="[
              'text-sm truncate max-w-[24rem]',
              timer.is_corrective ? 'text-orange-700' : 'text-blue-700',
            ]"
          >
            {{ timerProductionItem(timer.work_order) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { MachineTimer, WorkOrder } from "../types";

export default defineComponent({
  name: "MachineTimerBar",
  props: {
    machineTimers: {
      type: Array as PropType<MachineTimer[]>,
      default: () => [],
    },
    workOrders: {
      type: Array as PropType<WorkOrder[]>,
      default: () => [],
    },
  },
  emits: ["stop-machine-timer", "navigate-to-timer"],

  data(): { now: number; tick: ReturnType<typeof setInterval> | null } {
    return { now: Date.now(), tick: null };
  },

  methods: {
    elapsed(timer: MachineTimer): string {
      if (!timer.from_time) return "00:00:00";
      const start = new Date(timer.from_time).getTime();
      const diff = Math.max(0, Math.floor((this.now - start) / 1000));
      const h = String(Math.floor(diff / 3600)).padStart(2, "0");
      const m = String(Math.floor((diff % 3600) / 60)).padStart(2, "0");
      const s = String(diff % 60).padStart(2, "0");
      return `${h}:${m}:${s}`;
    },

    timerProductionItem(workOrderName: string): string {
      const wo = this.workOrders.find((wo) => wo.name === workOrderName);
      return wo ? wo.production_item : "";
    },
  },

  mounted() {
    this.tick = setInterval(() => {
      this.now = Date.now();
    }, 1000);
  },

  beforeUnmount() {
    if (this.tick) clearInterval(this.tick);
  },
});
</script>
