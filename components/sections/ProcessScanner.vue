<script setup lang="ts">
const { t } = useI18n()

const scannerKeys = [
  'scanner.scanning', 'scanner.cta',
  'scanner.result.saving', 'scanner.result.approach',
  'scanner.cat.1', 'scanner.cat.2', 'scanner.cat.3', 'scanner.cat.4', 'scanner.cat.5', 'scanner.cat.6', 'scanner.cat.7',
  'scanner.res.1.saving', 'scanner.res.1.approach',
  'scanner.res.2.saving', 'scanner.res.2.approach',
  'scanner.res.3.saving', 'scanner.res.3.approach',
  'scanner.res.4.saving', 'scanner.res.4.approach',
  'scanner.res.5.saving', 'scanner.res.5.approach',
  'scanner.res.6.saving', 'scanner.res.6.approach',
  'scanner.res.7.saving', 'scanner.res.7.approach',
]

const translations = computed(() => {
  const result: Record<string, string> = {}
  for (const key of scannerKeys) {
    result[key] = t(key)
  }
  return result
})
</script>

<template>
  <section class="section section-scanner">
    <p class="section-label reveal">{{ t('scanner.label') }}</p>
    <h2 class="section-title reveal reveal-delay-1">{{ t('scanner.title.1') }} <span class="gradient-text">{{ t('scanner.title.2') }}</span>?</h2>
    <p class="section-desc reveal reveal-delay-2">{{ t('scanner.desc') }}</p>
    <div class="reveal reveal-delay-3">
      <AIProcessScanner :translations="translations" />
    </div>
  </section>
</template>

<style scoped>
.section-scanner { padding-bottom: 80px; }
</style>
