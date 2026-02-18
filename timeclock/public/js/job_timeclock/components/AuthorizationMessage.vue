<template>
  <div class="h-screen flex flex-col justify-around items-center bg-gray-400">
    <div
      class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow hover:bg-gray-100"
    >
      <Spinner class="w-8 mb-4 mx-auto" />
      <p class="text-center text-3xl font-bold text-red-600">
        Please scan your employee ID to continue.
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { LoadingIndicator as Spinner } from "frappe-ui";

export default defineComponent({
  name: "AuthorizationMessage",
  components: {
    Spinner,
  },
});
</script>
