<template>
  <div class="auth-page">
    <SignUp force-redirect-url="/" />
  </div>
</template>

<script setup lang="ts">
import { SignUp } from '@clerk/nuxt/components';

definePageMeta({ layout: false });
</script>

<style scoped>
.auth-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-deep);
  padding: 24px;
}
</style>
