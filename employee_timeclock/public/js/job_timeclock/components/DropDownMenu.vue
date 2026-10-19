<!-- DropdownMenu.vue -->
<template>
	<Dropdown
		:options="dropdownOptions"
		:button="{
			label: selected || 'Select Workstation',
			theme: 'green',
			variant: 'outline',
			size: '2xl',
		}"
	/>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { useStorage } from "@vueuse/core";
import { Dropdown } from "frappe-ui";
import { api } from "../client";

export default defineComponent({
	name: "DropDownMenu",
	components: {
		Dropdown,
	},

	data(): {
		workstations: string[];
		selected: string;
	} {
		return {
			workstations: [],
			selected: useStorage<string>("workstation", "").value,
		};
	},

	computed: {
		dropdownOptions() {
			return this.workstations.map((name) => ({
				label: name,
				onClick: () => this.send_workstation(name),
			}));
		},
	},

	methods: {
		send_workstation(workstation: string): void {
			this.selected = workstation;
			useStorage<string>("workstation", "").value = workstation;
			this.$emit("send_workstation", workstation);
		},

		async fetchWorkstations(): Promise<void> {
			try {
				const workstations = await api.getWorkstations();
				if (workstations.status === "success" && workstations.workstations) {
					this.workstations = workstations.workstations;
				}
			} catch (error) {
				console.error("Failed to fetch workstations:", error);
			}
		},
	},

	async mounted(): Promise<void> {
		await this.fetchWorkstations();
		if (this.selected && this.selected !== "") {
			this.$emit("send_workstation", this.selected);
		}
	},
});
</script>
