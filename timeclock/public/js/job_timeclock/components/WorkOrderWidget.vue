<template>
  <div :data-work-order="workOrder.name" @click="click">
    <div
      class="flex flex-col rounded-lg border bg-white px-6 py-5 shadow cursor-pointer mt-3 mb-3"
      :class="{
        '!bg-blue-100': isSelected && !isActive,
        'ring-2 ring-green-500 !bg-green-50': isActive && !isCorrective,
        'ring-2 ring-orange-500 !bg-orange-50': isActive && isCorrective,
      }"
    >
      <!-- Header row: title + status badge -->
      <div class="flex items-center justify-between gap-3">
        <p class="text-3xl font-semibold flex-1 min-w-0 leading-tight break-words">
          {{ workOrder.production_item }}
        </p>
        <Badge
          :label="workOrder.status"
          :theme="statusTheme"
          variant="outline"
          size="lg"
          class="shrink-0"
        />
      </div>

      <!-- Body: subtitle + time summary (left) | donut chart (right, under badge) -->
      <div class="flex items-end justify-between gap-2 mt-1">
        <div class="flex-1 min-w-0">
          <p class="text-lg text-gray-500">{{ workOrder.name }}</p>
        </div>
        <!-- Donut progress chart – click.stop prevents re-triggering card click -->
        <div v-if="workOrder.planned_time_mins > 0" @click.stop class="shrink-0 -mb-1">
          <Plotly :data="chartData" :layout="chartLayout" :config="chartConfig" />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { WorkOrder } from "../types";
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
      const map: Record<string, "gray" | "blue" | "green" | "orange" | "red"> = {
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
          values: overrun ? [1, 0] : [Math.max(logged, 0.0001), Math.max(planned - logged, 0)],
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
        width: 48,
        height: 48,
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
