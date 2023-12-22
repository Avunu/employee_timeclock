<template>
<div>
    <Card class="w-screen w-1/2 p-4 m-4 bg-white shadow-lg rounded-lg box-border h-20 hover:bg-gray-300 justify_content:center" v-for="employee in employees" :key="employee.id" @click="send_employee(employee)">
    <h1 class="text-3xl center font-thin">{{ employee.name }}</h1>
    </Card>
</div>
</template>

<script lang="ts">
import { defineComponent, PropType} from 'vue';
import Card from './Card.vue';
import { Employee } from './types/Employee';

export default defineComponent({
    name: 'Employee List',
    components: {
        Card
    },
    inheritAttrs:false,
    props:{
        employees: {
            type: Array as PropType<Employee[]>,
        }
    },
    data(): {
    }{
    return{
        employee: ''
    };
    
},
    
methods:{
    send_employee(employee){
        // console.log(employee);
        this.$emit('send_employee', employee);
    }
}
})

</script>

<style>

</style>