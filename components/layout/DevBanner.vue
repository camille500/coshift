<template>
  <div v-if="!dismissed" class="dev-banner">
    <div class="dev-banner-inner">
      <svg class="dev-banner-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
      <span>{{ t('banner.dev') }}</span>
      <button class="dev-banner-close" @click="dismiss" :aria-label="locale === 'nl' ? 'Sluiten' : 'Close'">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();
const emit = defineEmits<{ dismissed: [] }>();

const dismissed = ref(false);

onMounted(() => {
  if (sessionStorage.getItem('dev-banner-dismissed') === '1') {
    dismissed.value = true;
    emit('dismissed');
  }
});

function dismiss() {
  dismissed.value = true;
  sessionStorage.setItem('dev-banner-dismissed', '1');
  emit('dismissed');
}
</script>

<style scoped>
.dev-banner {
  background: var(--bg-elevated);
  border-bottom: 1px solid var(--border-glass);
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 400;
  text-align: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 101;
}

.dev-banner-inner {
  max-width: 1280px;
  margin: 0 auto;
  padding: 5px 40px 5px 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
}

.dev-banner-icon {
  flex-shrink: 0;
  opacity: 0.4;
  width: 12px;
  height: 12px;
}

.dev-banner-close {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.4;
  transition: opacity 0.2s ease;
  border-radius: 4px;
}

.dev-banner-close:hover {
  opacity: 0.8;
}
</style>
