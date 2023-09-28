<template>
    <div class="flex flex-col items-center justify-center min-h-screen">
        <Spinner class="w-8 mb-4" />
        <p>Please scan your employee ID to continue.</p>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Spinner } from 'frappe-ui';

export default defineComponent({
    name: 'AuthorizationMessage',
    components: {
        Spinner,
    },
});
</script>