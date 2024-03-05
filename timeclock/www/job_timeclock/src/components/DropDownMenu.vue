<!-- DropdownMenu.vue -->
<template>
    <Menu as="div" class="relative inline-block text-left">
    <div class="z-100">
    <MenuButton class="bg-teal-500 hover:bg-teal-700 text-white font-normal lg:text-3xl py-4 px-8 rounded ring-2 ring-offset-1 ring-gray-100">
    {{ this.selected }}
    </MenuButton>
    </div>

    <transition enter-active-class="transition ease-out duration-100" enter-from-class="transform opacity-90 scale-95" enter-to-class="transform opacity-100 scale-100" leave-active-class="transition ease-in duration-75" leave-from-class="transform opacity-100 scale-100" leave-to-class="transform opacity-0 scale-95">
    <MenuItems class="absolute right-0 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
    <!-- <select v-model="this.selected"> -->
    <div class="py-1 text-3xl">
    <MenuItem v-slot="{active}" v-for="workstation in this.workstations" :key="workstation" @click="send_workstation(workstation)">
        <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-3xl']">
        {{ workstation.name }}
        </a>
    </MenuItem>
    <!-- <MenuItem v-slot="{ active }">
            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Account settings</a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">Support</a>
          </MenuItem>
          <MenuItem v-slot="{ active }">
            <a href="#" :class="[active ? 'bg-gray-100 text-gray-900' : 'text-gray-700', 'block px-4 py-2 text-sm']">License</a>
          </MenuItem>     -->
        </div>
    <!-- </select> -->
    </MenuItems>
    </transition>
    
</Menu>
</template>

<script lang="ts">
import {defineComponent} from 'vue';
import { Menu, MenuButton, MenuItems, MenuItem  } from '@headlessui/vue';
export default defineComponent({
  name: "DropdownMenu",
  components:{
    MenuItems,
    MenuItem,
    Menu,
    MenuButton,
  },
 
  data(): {
    selected: String,
    active: Boolean,
    workstations: Array[],
    workstation_name: String,
    } {
    return {
        // The local data property that holds the selected option
        // Should be workstation getting sent over.
        selected: 'Workstation',
        // The state that controls the visibility of the menu
        active:false,
        workstations:[{id:1, name:'Planer'},{id:2, name:'CNC'},{id:3, name:'Hand Sanding'},{id:4, name:'Sander/Stainer'},{id:5, name:'Truss Assembly'},{id:6, name:'Hardware'},{id:7, name:'T&G Cutting'},],
        workstation_name: 'Workstation',
    };
  },
  watch: {
    // The watcher that emits an event to the parent component when the selected option changes
    selected(newValue) {
      this.$emit("set_workstation", newValue);
    },
  },
  methods: {
    // The method that toggles the active state and shows or hides the menu
    toggle() {
      this.active = !this.active;
    },

    send_workstation(workstation){
        console.log(workstation.name);
    },
  },
  mounted(){
    console.log('Dropdown Working.')
  },
});
</script>

