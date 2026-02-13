<!--
  Button.vue — Local extension of the frappe-ui Button.

  Applies Job Timeclock style defaults:
    • Thicker border on "outline" variant (border-2)
    • Bolder font weight (font-semibold)
    • Slightly larger minimum hit target on touch screens (min-h-[3rem])

  All frappe-ui Button props, slots, and events are passed through unchanged.
  Use this component exactly as you would <Button> from frappe-ui.
-->
<template>
  <FrappeButton
    v-bind="{ ...$attrs, ...props }"
    :class="localClasses"
  >
    <template v-for="(_, name) in $slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData ?? {}" />
    </template>
  </FrappeButton>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Button as FrappeButton } from "frappe-ui";
import type { ButtonProps } from "frappe-ui/src/components/Button/types";

defineOptions({ name: "Button", inheritAttrs: false });

const props = defineProps<ButtonProps>();

const localClasses = computed(() => {
  const classes: string[] = [
    "font-semibold",
    "min-h-[3rem]",
  ];

  if (props.variant === "outline") {
    classes.push("!border-2");
  }

  return classes;
});
</script>
