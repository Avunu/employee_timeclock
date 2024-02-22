<template>
    <div class="backdrop">
        <Card class="card">
            <h3>Username:</h3> <input type="email" required v-model="email">
            <h3>Password:</h3> <input type="password" required v-model="password">
            {{  this.error_message }}
            <button class="btn" @click="submit_login(this.email, this.password)"> Submit </button>
            <button class="btn" @click="return_trigger"> Return </button>
        </Card>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Card from './Card.vue';
import { Button } from 'frappe-ui';
import { FrappeCall } from '../../../FrappeCall';

export default defineComponent({
    name: 'LogInModule',
    components: {
    Card,
    Button
},
data():{
    email: String,
    password: String,
    authenticated: Boolean,
    error_message: String
    return_triggered: Boolean,
} {
    return {
        email: '',
        password: '',
        authenticated: false,
        error_message: '',
        return_triggered: false
    };
},

methods: {
    // This should be a server call to verify user and password.
    async submit_login(email:String, password:String){
    
        // Needs to be built out and fully verified.
        const response = await FrappeCall('timeclock.www.job_timeclock.verify_login', email, password);
        if (response?.status === 'success'){
            this.verified = true
            this.authenticated = true;
            this.$emit('submit_login', this.authenticated);
        } else {
            this.error_message = 'Incorrect Login and/or Password. Please try again.'
            this.password = ''
        }
    },
    return_trigger(){
        this.return_triggered = true;
        this.$emit('return_triggered', this.return_triggered);
    }
},

unmounted(){
   this.password = '';
   this.verified = false;
   this.error_message = '';
   this.return_triggered = false;
}
});

</script>

<style scoped>
.card {
    width:1200px;
    padding: 20px;
    margin: 100px auto;
    background: rgb(128, 245, 216);
    border-radius:10px;
}
.backdrop {
    position: fixed;
    left: 10;
    top:50%;
    background: rgba(0,0,0,0,5);
    width:100%;
    height:100%;
}
.btn {
  display: inline-block;
  background: rgb(168, 121, 255);
  color: #ffffff;
  border: none;
  padding: 10px 20px;
  margin: 5px;
  border-radius: 5px;
  cursor: pointer;
  text-decoration: none;
  font-size: 15px;
  font-family: inherit;
}
</style>