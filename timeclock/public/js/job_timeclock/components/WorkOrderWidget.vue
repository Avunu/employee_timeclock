<template>
  <Card
    :title="workOrder.production_item"
    :subtitle="selected ? undefined : workOrder.name"
    @click="click"
    :class="{ '!bg-blue-100': isSelected }"
    class="overflow-hidden cursor-pointer mt-2 mb-2"
  >
    <template #actions>
      <span
        class="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800 whitespace-nowrap"
      >
        {{ workOrder.status }}
      </span>
    </template>
  </Card>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { WorkOrder } from "../types/WorkOrder";
import { Card } from "frappe-ui";

export default defineComponent({
  name: "WorkOrderWidget",
  components: {
    Card,
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
  },
  data(): {
    selected: boolean;
  } {
    return {
      selected: false,
    };
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
