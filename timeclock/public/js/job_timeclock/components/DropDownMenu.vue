<!-- DropdownMenu.vue -->
<template>
  <Menu as="div" class="z-1000 relative inline-block text-left">
    <div>
      <MenuButton
        class="bg-teal-500 hover:bg-teal-700 text-white font-normal lg:text-3xl py-4 px-8 rounded ring-2 ring-offset-1 ring-gray-100">
        {{ selected ? selected : 'Select Workstation' }}
      </MenuButton>
    </div>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-90 scale-95"
      enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75"
      leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
      <MenuItems
        class="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <!-- <select v-model="this.selected"> -->
        <div class="py-1 text-3xl">
          <MenuItem class="z-100" v-slot="{ active }" v-for="workstation in workstations" :key="workstation"
            @click="send_workstation(workstation)">
          <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-3xl']">
            {{ workstation.name }}
          </a>
          </MenuItem>

        </div>
      </MenuItems>
    </transition>

  </Menu>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useStorage } from '@vueuse/core';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/vue';
export default defineComponent({
  name: "DropDownMenu",
  components: {
    MenuItems,
    MenuItem,
    Menu,
    MenuButton,
  },

  data(): {
    active: boolean,
    workstations: Array<{ id: number, name: string }>,
    selected: string,
  } {
    return {
      // The state that controls the visibility of the menu
      active: false,
      workstations: [{ id: 1, name: 'Planer' }, { id: 2, name: 'CNC' }, { id: 3, name: 'Hand Sanding' }, { id: 4, name: 'Sander/Stainer' }, { id: 5, name: 'Truss Assembly' }, { id: 6, name: 'Hardware' }, { id: 7, name: 'T&G Cutting' }],
      selected: useStorage<string>('workstation', '').value,
    };
  },

  computed: {},

  watch: {
    // The watcher that emits an event to the parent component when the selected option changes
    // selected(newValue) {
    //   this.$emit("set_workstation", newValue);
    // },
  },
  methods: {
    // The method that toggles the active state and shows or hides the menu
    toggle() {
      this.active = !this.active;
    },

    send_workstation(workstation: { id: number, name: string }): void {
      // Update the local storage with the selected workstation
      this.selected = workstation.name;
      useStorage<string>('workstation', '').value = workstation.name;
      this.$emit("send_workstation", workstation.name);
    },
  },

  mounted(): void {
    // Emit the current workstation on mount if one is selected
    if (this.selected && this.selected !== '') {
      this.$emit("send_workstation", this.selected);
    }
  }
});
</script>
