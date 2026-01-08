<template>
    <div class="backdrop">
        <Card class="card">
            <h3>Username:</h3> <input type="email" required v-model="email">
            <h3>Password:</h3> <input type="password" required v-model="password">
            <p v-if="error_message" class="error">{{ error_message }}</p>
            <div class="button-group">
                <Button @click="submit_login(email, password)" theme="blue" variant="solid"> Submit </Button>
                <Button @click="return_trigger" theme="gray" variant="outline"> Return </Button>
            </div>
        </Card>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import Card from './Card.vue';
import Button from 'frappe-ui/src/components/Button/Button.vue';
import { frappeCall } from '../../FrappeCall';
import type { VerifyLoginResponse } from '../types/api';

export default defineComponent({
    name: 'LogInModule',
    components: {
        Card,
        Button
    },
    data(): {
        email: string,
        password: string,
        authenticated: boolean,
        error_message: string,
        return_triggered: boolean,
        verified: boolean
    } {
        return {
            email: '',
            password: '',
            authenticated: false,
            error_message: '',
            return_triggered: false,
            verified: false
        };
    },

    methods: {
        // This should be a server call to verify user and password.
        async submit_login(email: string, password: string) {

            // Needs to be built out and fully verified.
            const response = await frappeCall<VerifyLoginResponse>('timeclock.www.job_timeclock.verify_login', { email, password });
            if (response.status === 'success') {
                this.verified = true
                this.authenticated = true;
                this.$emit('submit_login', this.authenticated);
            } else {
                this.error_message = 'Incorrect Login and/or Password. Please try again.'
                this.password = ''
            }
        },
        return_trigger() {
            this.return_triggered = true;
            this.$emit('return_triggered', this.return_triggered);
        }
    },

    unmounted() {
        this.password = '';
        this.verified = false;
        this.error_message = '';
        this.return_triggered = false;
    }
});

</script>

<style scoped>
.card {
    width: 1200px;
    padding: 20px;
    margin: 100px auto;
    background: rgb(128, 245, 216);
    border-radius: 10px;
}

.backdrop {
    position: fixed;
    left: 10;
    top: 50%;
    background: rgba(0, 0, 0, 0, 5);
    width: 100%;
    height: 100%;
}

.button-group {
    display: flex;
    gap: 10px;
    margin-top: 15px;
}

.error {
    color: #dc2626;
    margin-top: 10px;
    font-weight: 500;
}
</style>