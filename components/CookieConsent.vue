<template>
  <Transition name="cookie-banner">
    <div v-if="showBanner" class="cookie-banner">
      <p class="cookie-banner__text">{{ $t('cookie.message') }}</p>
      <div class="cookie-banner__actions">
        <button class="cookie-banner__btn cookie-banner__btn--decline" @click="handleDecline">
          {{ $t('cookie.decline') }}
        </button>
        <button class="cookie-banner__btn cookie-banner__btn--accept" @click="handleAccept">
          {{ $t('cookie.accept') }}
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
const STORAGE_KEY = 'cookie-consent'

const showBanner = ref(false)

function pushConsent(granted: boolean) {
  window.dataLayer = window.dataLayer || []
  window.dataLayer.push({
    event: 'consent_update',
    analytics_storage: granted ? 'granted' : 'denied',
  })
}

function handleAccept() {
  localStorage.setItem(STORAGE_KEY, 'accepted')
  pushConsent(true)
  showBanner.value = false
}

function handleDecline() {
  localStorage.setItem(STORAGE_KEY, 'declined')
  pushConsent(false)
  showBanner.value = false
}

onMounted(() => {
  const stored = localStorage.getItem(STORAGE_KEY)
  if (!stored) {
    showBanner.value = true
  } else {
    pushConsent(stored === 'accepted')
  }
})
</script>

<style scoped>
.cookie-banner {
  position: fixed;
  bottom: 1.5rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 9999;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1rem 1.5rem;
  max-width: 640px;
  width: calc(100% - 2rem);
  background: var(--bg-card);
  border: 1px solid var(--border-glass);
  border-radius: 12px;
  backdrop-filter: blur(16px);
  box-shadow: var(--card-shadow);
  font-family: var(--font-body);
}

.cookie-banner__text {
  flex: 1;
  margin: 0;
  font-size: 0.875rem;
  line-height: 1.5;
  color: var(--text-secondary);
}

.cookie-banner__actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.cookie-banner__btn {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8125rem;
  font-weight: 600;
  font-family: var(--font-body);
  cursor: pointer;
  border: none;
  transition: opacity 0.2s;
}

.cookie-banner__btn:hover {
  opacity: 0.85;
}

.cookie-banner__btn--accept {
  background: var(--accent);
  color: #fff;
}

.cookie-banner__btn--decline {
  background: transparent;
  color: var(--text-muted);
  border: 1px solid var(--border-glass);
}

.cookie-banner-enter-active,
.cookie-banner-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.cookie-banner-enter-from,
.cookie-banner-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(1rem);
}

@media (max-width: 600px) {
  .cookie-banner {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }

  .cookie-banner__actions {
    justify-content: flex-end;
  }
}
</style>
