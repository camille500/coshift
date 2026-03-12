<script setup lang="ts">
const { t } = useI18n();

const faqItems = Array.from({ length: 13 }, (_, i) => ({
  q: t(`faq.${i + 1}.q`),
  a: t(`faq.${i + 1}.a`),
}));

const openItems = ref<boolean[]>(Array(13).fill(false));

function toggle(idx: number) {
  openItems.value[idx] = !openItems.value[idx];
}

// FAQ Schema for SEO
useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: faqItems.map(item => ({
        '@type': 'Question',
        name: item.q,
        acceptedAnswer: { '@type': 'Answer', text: item.a },
      })),
    }),
  }],
});
</script>

<template>
  <section id="faq" class="section section-faq">
    <p class="section-label reveal">{{ t('faq.label') }}</p>
    <h2 class="section-title reveal reveal-delay-1">{{ t('faq.title.1') }} <span class="gradient-text">{{ t('faq.title.2') }}</span>.</h2>
    <div class="faq-list">
      <div
        v-for="(item, idx) in faqItems"
        :key="idx"
        :class="['faq-item', 'glass', 'reveal', { open: openItems[idx] }]"
      >
        <button class="faq-question" @click="toggle(idx)">
          <span>{{ item.q }}</span>
          <svg
            class="faq-chevron"
            :class="{ rotated: openItems[idx] }"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          ><polyline points="6 9 12 15 18 9"/></svg>
        </button>
        <p v-if="openItems[idx]" class="faq-answer">{{ item.a }}</p>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .section-faq { max-width: 760px; }
  .faq-list { display: flex; flex-direction: column; gap: 12px; }
  .faq-item { padding: 0; overflow: hidden; transition: border-color 0.3s ease; }
  .faq-item.open { border-color: rgba(0, 212, 170, 0.15); }
  .faq-question {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 20px 24px;
    cursor: pointer;
    font-size: 1rem;
    font-weight: 600;
    color: var(--text-primary);
    list-style: none;
    transition: color 0.3s ease;
    width: 100%;
    background: transparent;
    border: none;
    text-align: left;
    font-family: var(--font-body);
  }
  .faq-question:hover { color: var(--accent); }
  .faq-chevron {
    flex-shrink: 0;
    color: var(--text-muted);
    transition: transform 0.3s ease, color 0.3s ease;
  }
  .faq-chevron.rotated {
    transform: rotate(180deg);
    color: var(--accent);
  }
  .faq-answer {
    padding: 0 24px 20px;
    color: var(--text-muted);
    font-size: 0.95rem;
    line-height: 1.7;
  }

  @media (max-width: 900px) {
    .faq-question { padding: 16px 18px; font-size: 0.95rem; }
    .faq-answer { padding: 0 18px 16px; }
  }
</style>
