<script setup lang="ts">
const { t } = useI18n();

const items = Array.from({ length: 8 }, (_, i) => t(`marquee.${i + 1}`));
</script>

<template>
  <div class="marquee-wrap reveal">
    <div class="marquee-track">
      <span v-for="n in 3" :key="n" class="marquee-set">
        <span v-for="item in items" :key="item" class="marquee-item">
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          {{ item }}
        </span>
      </span>
    </div>
  </div>
</template>

<style scoped>
  .marquee-wrap { overflow: hidden; padding: 28px 0 88px; border-bottom: 1px solid var(--border-glass); }
  .marquee-track { display: flex; width: max-content; animation: marquee 35s linear infinite; }
  .marquee-set { display: flex; }
  .marquee-item { display: inline-flex; align-items: center; gap: 8px; padding: 0 32px; font-size: 0.875rem; font-weight: 500; color: var(--text-muted); white-space: nowrap; letter-spacing: 0.02em; text-transform: uppercase; }
</style>
