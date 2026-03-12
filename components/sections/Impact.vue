<script setup lang="ts">
const { t } = useI18n();

const icons = [
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
];
</script>

<template>
  <section id="impact" class="section section-impact">
    <p class="section-label reveal">{{ t('impact.label') }}</p>
    <h2 class="section-title reveal reveal-delay-1">{{ t('impact.title.1') }} <span class="gradient-text">{{ t('impact.title.2') }}</span>.</h2>
    <p class="section-desc reveal reveal-delay-2">{{ t('impact.desc') }}</p>
    <div class="impact-grid">
      <div
        v-for="i in [1, 2, 3]"
        :key="i"
        :class="`impact-card glass reveal reveal-delay-${i}`"
      >
        <div class="impact-icon" v-html="icons[i - 1]"></div>
        <h3 class="impact-title">{{ t(`impact.${i}.title`) }}</h3>
        <p class="impact-desc">{{ t(`impact.${i}.desc`) }}</p>
      </div>
    </div>
    <p class="impact-bottom reveal">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
      {{ t('impact.bottom') }}
    </p>
  </section>
</template>

<style scoped>
  .section-impact { background: linear-gradient(180deg, transparent, var(--bg-surface), transparent); }
  .impact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .impact-card { padding: 36px 32px; display: flex; flex-direction: column; gap: 12px; transition: border-color 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; }
  .impact-card:hover { border-color: var(--card-border); transform: translateY(-3px); box-shadow: var(--card-shadow-hover); }
  .impact-icon { width: 48px; height: 48px; border-radius: 12px; display: flex; align-items: center; justify-content: center; background: rgba(0, 212, 170, 0.08); color: var(--accent); margin-bottom: 4px; }
  .impact-title { font-size: 1.25rem; font-weight: 700; color: var(--text-primary); letter-spacing: -0.01em; }
  .impact-desc { color: var(--text-muted); font-size: 0.925rem; line-height: 1.65; }
  .impact-bottom { text-align: center; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 48px; font-size: 1.0625rem; color: var(--text-secondary); font-weight: 500; }

  @media (max-width: 900px) {
    .impact-grid { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; }
  }
  @media (min-width: 601px) and (max-width: 1024px) {
    .impact-grid { grid-template-columns: repeat(2, 1fr); }
    .impact-grid .impact-card:last-child { grid-column: span 2; max-width: 420px; margin: 0 auto; }
  }
</style>
