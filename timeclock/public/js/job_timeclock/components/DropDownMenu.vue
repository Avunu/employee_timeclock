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

export default defineComponent({
  name: "DropDownMenu",
  components: {
    Dropdown,
  },

  data(): {
    workstations: Array<{ id: number; name: string }>;
    selected: string;
  } {
    return {
      workstations: [
        { id: 1, name: "Planer" },
        { id: 2, name: "CNC" },
        { id: 3, name: "Hand Sanding" },
        { id: 4, name: "Sander/Stainer" },
        { id: 5, name: "Truss Assembly" },
        { id: 6, name: "Hardware" },
        { id: 7, name: "T&G Cutting" },
      ],
      selected: useStorage<string>("workstation", "").value,
    };
  },

  computed: {
    dropdownOptions() {
      return this.workstations.map((ws) => ({
        label: ws.name,
        onClick: () => this.send_workstation(ws),
      }));
    },
  },

  methods: {
    send_workstation(workstation: { id: number; name: string }): void {
      this.selected = workstation.name;
      useStorage<string>("workstation", "").value = workstation.name;
      this.$emit("send_workstation", workstation.name);
    },
  },

  mounted(): void {
    if (this.selected && this.selected !== "") {
      this.$emit("send_workstation", this.selected);
    }
  },
});
</script>
