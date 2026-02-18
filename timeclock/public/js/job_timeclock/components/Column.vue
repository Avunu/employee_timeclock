<template>
  <Simplebar
    class="flex-none transition ease-in-out duration-500 py-6 sm:px-6 lg:px-8"
    transition="expand"
  >
    <div class="px-4 pb-6 sm:px-0 flex items-start justify-between gap-4">
      <div>
        <h3 class="text-lg leading-6 font-medium text-gray-900">
          {{ title }}
        </h3>
        <p class="mt-1 text-sm text-gray-500">
          {{ description }}
        </p>
      </div>
      <slot name="actions" />
    </div>
    <slot></slot>
  </Simplebar>
</template>

<script lang="ts">
import Simplebar from "simplebar-vue";
import "simplebar-vue/dist/simplebar.min.css";
import { defineComponent } from "vue";

export default defineComponent({
  name: "Column",
  components: {
    Simplebar,
  },
  props: {
    title: {
      type: String,
      default: "",
    },
    description: {
      type: String,
      default: "",
    },
  },
});
</script>
