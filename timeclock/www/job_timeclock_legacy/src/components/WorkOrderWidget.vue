<template>
  <Card
    @click="click"
    :class="{ 'bg-blue-100': isSelected }"
    class="overflow-hidden"
  >
    <div class="flex flex-col">
      <h3 class="text-xl xl:text-4xl">{{ workOrder.production_item }}</h3>
      <span class="text-lg" v-if="selected === false">{{
        workOrder.name
      }}</span>
    </div>
    <span
      v-if="selected === false"
      class="px-2 inline-flex text-sm leading-5 font-semibold rounded-full bg-green-100 text-green-800"
    >
      {{ workOrder.status }}
    </span>
  </Card>
</template>

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { WorkOrder } from "../types/WorkOrder";

import Card from "./Card.vue";

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
    selected: Boolean;
  } {
    return {
      selected: false,
    };
  },

  methods: {
    click(workOrder) {
      if (this.selected === true) {
        this.selected = false;
      } else {
        this.$emit("click", workOrder);
        this.selected = true;
      }
    },

    mounted() {
      this.selected = false;
    },
  },
  unmounted() {
    this.selected = false;
  },
});
</script>
