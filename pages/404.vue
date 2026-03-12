<template>
  <div class="not-found">
    <div class="not-found-inner">
      <p class="not-found-code">404</p>
      <h1 class="not-found-title">Pagina niet gevonden</h1>
      <p class="not-found-desc">Deze pagina bestaat niet of is verplaatst.</p>
      <NuxtLink to="/" class="not-found-btn">Terug naar home</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' });
</script>

<style scoped>
.not-found {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 120px 24px 80px;
  text-align: center;
}

.not-found-inner {
  max-width: 480px;
}

.not-found-code {
  font-size: 6rem;
  font-weight: 800;
  color: var(--accent);
  opacity: 0.3;
  line-height: 1;
  margin-bottom: 16px;
  font-family: var(--font-display);
}

.not-found-title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 12px;
}

.not-found-desc {
  color: var(--text-muted);
  margin-bottom: 32px;
}

.not-found-btn {
  display: inline-flex;
  align-items: center;
  padding: 12px 28px;
  background: var(--accent);
  color: var(--bg-deep);
  font-weight: 600;
  border-radius: 8px;
  transition: transform 0.2s, box-shadow 0.3s;
}

.not-found-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 212, 170, 0.3);
}
</style>
