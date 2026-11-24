<!--
  Button.vue — Local extension of the frappe-ui Button.

  Applies Job Timeclock style defaults:
    • Thicker border on "outline" variant (border-2)
    • Bolder font weight (font-semibold)
    • Slightly larger minimum hit target on touch screens (min-h-[3rem])

  frappe-ui 1.x has no "xl" or "2xl" size, so those render as "lg" with the
  0.1 height, font size and radius restored by the legacy classes below.

  All other frappe-ui Button props, slots, and events are passed through unchanged.
  Use this component exactly as you would <Button> from frappe-ui.
-->
<template>
	<FrappeButton v-bind="{ ...$attrs, ...frappeProps }" :class="localClasses">
		<template v-for="(_, name) in $slots" #[name]="slotData">
			<slot :name="name" v-bind="slotData ?? {}" />
		</template>
	</FrappeButton>
</template>

<script lang="ts" setup>
import { computed } from "vue";
import { Button as FrappeButton } from "frappe-ui";
import type { Component } from "vue";
import type { RouterLinkProps } from "vue-router";

// frappe-ui 1.x's ButtonProps (components/Button/types.ts), which the package does not export,
// plus the two sizes this app still uses from 0.1.
interface ButtonProps {
	theme?: "gray" | "blue" | "green" | "red";
	size?: "sm" | "md" | "lg" | "xl" | "2xl";
	variant?: "solid" | "subtle" | "outline" | "ghost";
	label?: string;
	icon?: string | Component;
	iconLeft?: string | Component;
	iconRight?: string | Component;
	tooltip?: string;
	loading?: boolean;
	loadingText?: string;
	disabled?: boolean;
	route?: RouterLinkProps["to"];
	href?: string;
	type?: "button" | "submit" | "reset";
}

// The 0.1 geometry of the "xl" and "2xl" sizes (height, font size, radius), applied on top of "lg".
const legacySizeClasses = {
	xl: ["!h-[2.875rem]", "!text-xl", "!rounded-lg"],
	"2xl": ["!h-[3.25rem]", "!text-2xl", "!rounded-xl"],
} as const;

defineOptions({ name: "Button", inheritAttrs: false });

const props = defineProps<ButtonProps>();

const frappeProps = computed(() => ({
	...props,
	size: props.size === "xl" || props.size === "2xl" ? ("lg" as const) : props.size,
}));

const localClasses = computed(() => {
	const classes: string[] = ["font-semibold", "min-h-[3rem]", "px-6", "py-3"];

	if (props.variant === "outline") {
		classes.push("!border-2");
	}

	if (props.size === "xl" || props.size === "2xl") {
		classes.push(...legacySizeClasses[props.size]);
	}

	return classes;
});
</script>
