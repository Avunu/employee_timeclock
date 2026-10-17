<template>
	<div class="h-screen flex flex-col justify-around items-center bg-gray-400">
		<div class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100">
			<VueSpinner size="20" color="red" />
			<p class="text-center text-3xl font-bold text-red-300">Please scan your employee ID to continue.</p>
		</div>
	</div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { VueSpinner } from "vue3-spinners";

export default defineComponent({
	name: "AuthorizationMessage",
	components: {
		VueSpinner,
	},
});
</script>
