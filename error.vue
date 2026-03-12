<template>
  <div class="error-page">
    <h1>{{ error?.statusCode === 404 ? 'Pagina niet gevonden' : 'Er ging iets mis' }}</h1>
    <p>{{ error?.message || 'Een onverwachte fout is opgetreden.' }}</p>
    <button @click="handleError">Terug naar home</button>
  </div>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

defineProps<{ error: NuxtError }>()

function handleError() {
  clearError({ redirect: '/' })
}
</script>

<style scoped>
.error-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
  text-align: center;
  font-family: 'Plus Jakarta Sans', sans-serif;
  background: var(--bg-deep, #0a0a12);
  color: var(--text-primary, #e8e8f0);
}
.error-page h1 { font-size: 2rem; margin-bottom: 1rem; }
.error-page p { color: var(--text-muted, #888); margin-bottom: 2rem; }
.error-page button {
  padding: 12px 24px;
  background: var(--accent, #00d4aa);
  color: var(--bg-deep, #0a0a12);
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}
</style>
