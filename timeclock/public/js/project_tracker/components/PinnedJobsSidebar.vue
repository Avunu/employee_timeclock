<template>
  <transition name="pinned-sidebar">
    <div
      v-if="isOpen && activeSession"
      class="fixed inset-0 z-50 flex justify-end"
      @click.self="$emit('close')"
    >
      <!-- Backdrop -->
      <div
        class="absolute inset-0 bg-black bg-opacity-50"
        @click="$emit('close')"
      ></div>

      <!-- Sidebar Content -->
      <div class="relative w-200 h-full bg-white shadow-2xl flex flex-col">
        <!-- Sidebar Header -->
        <div class="flex items-center justify-between p-6 border-b">
          <h2 class="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <IconPin class="w-6 h-6 text-amber-500 fill-current" />
            Pinned Jobs
          </h2>
          <button
            @click="$emit('close')"
            class="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <svg
              class="w-6 h-6 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <!-- Sidebar Body -->
        <div class="flex-1 overflow-y-auto p-4">
          <p
            v-if="pinnedCards.length === 0"
            class="text-sm text-gray-500 text-center py-8"
          >
            No pinned job cards yet.<br />
            Tap the
            <IconPin class="inline w-4 h-4 text-gray-400" />
            icon on any job card to pin it here.
          </p>
          <div v-else class="space-y-1">
            <JobCardWidget
              v-for="item in pinnedCards"
              :key="`${item.workOrder}::${item.operation.operation}`"
              :operation="item.operation"
              :activeTimer="activeTimer"
              :machineTimers="machineTimers"
              :workOrderName="item.workOrder"
              :productName="item.productName"
              :pinned="true"
              @toggle-pin="$emit('toggle-pin', $event)"
              @start-task="
                $emit('start-task', {
                  workOrderName: item.workOrder,
                  operationName: $event,
                })
              "
              @stop-task="
                $emit('stop-task', {
                  workOrder: item.workOrder,
                  operationName: $event,
                })
              "
              @start-rework="
                $emit('start-rework', {
                  workOrder: item.workOrder,
                  operationName: $event,
                })
              "
              @stop-rework="
                $emit('stop-rework', {
                  workOrder: item.workOrder,
                  operationName: $event,
                })
              "
            />
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import JobCardWidget from "./JobCardWidget.vue";
// @ts-ignore
import IconPin from "~icons/lucide/pin";
import type { Operation, ActiveTimer, MachineTimer } from "../types";

export interface PinnedCard {
  workOrder: string;
  operation: Operation;
  productName: string;
}

export default defineComponent({
  name: "PinnedJobsSidebar",
  components: {
    JobCardWidget,
    IconPin,
  },
  props: {
    isOpen: {
      type: Boolean,
      required: true,
    },
    activeSession: {
      type: Boolean,
      required: true,
    },
    pinnedCards: {
      type: Array as PropType<PinnedCard[]>,
      default: () => [],
    },
    activeTimer: {
      type: Object as PropType<ActiveTimer | null>,
      default: null,
    },
    machineTimers: {
      type: Array as PropType<MachineTimer[]>,
      default: () => [],
    },
  },
  emits: [
    "close",
    "toggle-pin",
    "start-task",
    "stop-task",
    "start-rework",
    "stop-rework",
  ],
});
</script>

<style scoped>
.pinned-sidebar-enter-active,
.pinned-sidebar-leave-active {
  transition: opacity 0.3s ease;
}

.pinned-sidebar-enter-active > div:last-child,
.pinned-sidebar-leave-active > div:last-child {
  transition: transform 0.3s ease;
}

.pinned-sidebar-enter-from,
.pinned-sidebar-leave-to {
  opacity: 0;
}

.pinned-sidebar-enter-from > div:last-child,
.pinned-sidebar-leave-to > div:last-child {
  transform: translateX(100%);
}
</style>
