<template>
  <div :data-work-order="workOrder.name" @click="click">
    <div
      class="flex flex-col rounded-lg border bg-white px-4 py-3 shadow cursor-pointer mt-2 mb-2"
      :class="{
        '!bg-blue-100': isSelected && !isActive,
        'ring-2 ring-green-500 !bg-green-50': isActive && !isCorrective,
        'ring-2 ring-orange-500 !bg-orange-50': isActive && isCorrective,
      }"
    >
      <!-- Header row: title + donut chart + status badge -->
      <div class="flex items-center justify-between gap-3">
        <p class="text-xl font-semibold flex-1 min-w-0 leading-tight truncate">
          {{ workOrder.production_item }}
        </p>
        <div class="flex items-center gap-2 shrink-0">
          <!-- Donut progress chart – click.stop so it doesn't re-trigger card click -->
          <div v-if="workOrder.planned_time_mins > 0" @click.stop class="-my-1">
            <Plotly
              :data="chartData"
              :layout="chartLayout"
              :config="chartConfig"
            />
          </div>
          <Badge
            :label="workOrder.status"
            :theme="statusTheme"
            variant="outline"
            size="lg"
          />
        </div>
      </div>

      <!-- Subtitle -->
      <p class="text-sm text-gray-500 mt-1">{{ workOrder.name }}</p>

      <!-- Time summary row -->
      <p
        v-if="workOrder.planned_time_mins > 0"
        class="text-xs mt-0.5 font-mono"
        :class="isOverrun ? 'text-red-500' : 'text-gray-400'"
      >
        {{ formatMins(workOrder.logged_time_mins) }} /
        {{ formatMins(workOrder.planned_time_mins) }}
        <span v-if="isOverrun">
          · +{{
            formatMins(workOrder.logged_time_mins - workOrder.planned_time_mins)
          }}
          overrun
        </span>
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { WorkOrder } from "../types/WorkOrder";
import { Badge } from "frappe-ui";
import VuePlotly from "vue3-plotly-ts";

export default defineComponent({
  name: "WorkOrderWidget",
  components: {
    Badge,
    Plotly: VuePlotly,
  },
  emits: ["click"],
  props: {
    workOrder: {
      type: Object as PropType<WorkOrder>,
      required: true,
    },
    isSelected: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isCorrective: {
      type: Boolean,
      default: false,
    },
  },

  computed: {
    isOverrun(): boolean {
      return (
        this.workOrder.planned_time_mins > 0 &&
        this.workOrder.logged_time_mins > this.workOrder.planned_time_mins
      );
    },

    statusTheme(): "gray" | "blue" | "green" | "orange" | "red" {
      const map: Record<string, "gray" | "blue" | "green" | "orange" | "red"> =
        {
          "Not Started": "gray",
          "In Process": "blue",
          Completed: "green",
          Stopped: "red",
          Draft: "gray",
        };
      return map[this.workOrder.status] ?? "gray";
    },

    chartData(): object[] {
      const logged = this.workOrder.logged_time_mins || 0;
      const planned = this.workOrder.planned_time_mins || 1;
      const overrun = logged > planned;
      return [
        {
          type: "pie",
          hole: 0.65,
          // When overrun show a solid filled circle; otherwise show progress arc
          values: overrun
            ? [1, 0]
            : [Math.max(logged, 0.0001), Math.max(planned - logged, 0)],
          marker: {
            colors: overrun ? ["#ef4444", "#f3f4f6"] : ["#22c55e", "#f3f4f6"],
            line: { width: 0 },
          },
          textinfo: "none",
          hoverinfo: "none",
          sort: false,
          direction: "clockwise",
          rotation: -90,
        },
      ];
    },

    chartLayout(): object {
      return {
        width: 72,
        height: 72,
        margin: { l: 0, r: 0, t: 0, b: 0, pad: 0 },
        showlegend: false,
        paper_bgcolor: "transparent",
        plot_bgcolor: "transparent",
      };
    },

    chartConfig(): object {
      return {
        displayModeBar: false,
        staticPlot: true,
        responsive: false,
      };
    },
  },

  methods: {
    click(): void {
      this.$emit("click");
    },

    formatMins(mins: number): string {
      if (!mins || mins <= 0) return "0m";
      const h = Math.floor(mins / 60);
      const m = Math.round(mins % 60);
      if (h > 0 && m > 0) return `${h}h ${m}m`;
      if (h > 0) return `${h}h`;
      return `${m}m`;
    },
  },
});
</script>
