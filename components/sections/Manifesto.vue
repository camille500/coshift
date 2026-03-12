<script setup lang="ts">
const { t } = useI18n();

// Helper: split text into word spans for animation
function wordWrap(text: string): string {
  return text.split(' ').map(word => `<span class="manifesto-word"><span class="manifesto-word-inner">${word}</span></span>`).join(' ');
}
</script>

<template>
  <section class="section section-manifesto">
    <div class="manifesto-inner">
      <div class="sparkle violet" style="top: 80%; right: 8%; animation-delay: 1.5s"></div>
      <p class="manifesto-line" v-html="wordWrap(t('manifesto.line1'))" />
      <p class="manifesto-line" v-html="wordWrap(t('manifesto.line2'))" />
      <p class="manifesto-line manifesto-dim" v-html="wordWrap(t('manifesto.line3'))" />
      <p class="manifesto-line manifesto-accent">
        <span class="gradient-text" v-html="wordWrap(t('manifesto.line4'))" />
      </p>
    </div>
  </section>
</template>

<style scoped>
  .section-manifesto { padding: 120px 24px; position: relative; overflow: hidden; }
  .section-manifesto::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0, 212, 170, 0.025), transparent 70%); pointer-events: none; }
  .manifesto-inner { max-width: 800px; margin: 0 auto; text-align: center; position: relative; }
  .manifesto-line { font-family: var(--font-display); font-size: clamp(1.75rem, 3.5vw, 2.75rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.3; color: var(--text-primary); margin-bottom: 8px; perspective: 800px; }
  .manifesto-dim { color: var(--text-muted); }
  .manifesto-accent { font-size: clamp(2rem, 4vw, 3.25rem); margin-top: 8px; }

  @media (max-width: 900px) {
    .section-manifesto { padding: 80px 24px; }
    .manifesto-line { font-size: clamp(1.4rem, 5vw, 2rem); }
    .manifesto-accent { font-size: clamp(1.6rem, 6vw, 2.5rem); }
  }
</style>
