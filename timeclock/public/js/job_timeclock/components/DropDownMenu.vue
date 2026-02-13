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
import { frappeCall } from "../../FrappeCall";
import type { GetWorkstationsResponse } from "../types/api";

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
        const response = await frappeCall<GetWorkstationsResponse>(
          "timeclock.timeclock.www.job_timeclock.get_workstations",
        );
        if (response.status === "success" && response.workstations) {
          this.workstations = response.workstations;
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
