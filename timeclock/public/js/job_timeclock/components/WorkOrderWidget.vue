<template>
  <div :data-work-order="workOrder.name">
  <Card
    :title="workOrder.production_item"
    :subtitle="selected ? undefined : workOrder.name"
    @click="click"
    :class="{
      '!bg-blue-100': isSelected && !isActive,
      'ring-2 ring-green-500 !bg-green-50': isActive && !isCorrective,
      'ring-2 ring-orange-500 !bg-orange-50': isActive && isCorrective,
    }"
    class="overflow-hidden cursor-pointer mt-2 mb-2"
  >
    <template #actions>
      <Badge
        :label="workOrder.status"
        :theme="statusTheme"
        variant="outline"
        size="lg"
      />
    </template>
  </Card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { WorkOrder } from "../types/WorkOrder";
import { Card, Badge } from "frappe-ui";

export default defineComponent({
  name: "WorkOrderWidget",
  components: {
    Card,
    Badge,
  },
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
  data(): {
    selected: boolean;
  } {
    return {
      selected: false,
    };
  },

  computed: {
    statusTheme(): "gray" | "blue" | "green" | "orange" | "red" {
      const map: Record<string, "gray" | "blue" | "green" | "orange" | "red"> = {
        "Not Started": "gray",
        "In Process": "blue",
        "Completed": "green",
        "Stopped": "red",
        "Draft": "gray",
      };
      return map[this.workOrder.status] ?? "gray";
    },
  },

  methods: {
    click(workOrder: WorkOrder): void {
      if (this.selected === true) {
        this.selected = false;
      } else {
        this.$emit("click", workOrder);
        this.selected = true;
      }
    },
  },

  mounted(): void {
    this.selected = false;
  },

  unmounted(): void {
    this.selected = false;
  },
});
</script>
