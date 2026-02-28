<template>
  <header class="header" :class="{ scrolled }">
    <div class="header-inner">
      <NuxtLink to="/" class="logo">
        <svg class="logo-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 2L2 7l10 5 10-5-10-5z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
          <path d="M2 17l10 5 10-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.5"/>
          <path d="M2 12l10 5 10-5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" opacity="0.75"/>
        </svg>
        <span class="logo-text">Nova Delta</span>
      </NuxtLink>
      <nav class="nav" aria-label="Main navigation">
        <NuxtLink to="/#services" class="nav-link">{{ t('nav.services') }}</NuxtLink>
        <NuxtLink to="/#impact" class="nav-link">{{ t('nav.impact') }}</NuxtLink>
        <NuxtLink to="/#use-cases" class="nav-link">{{ t('nav.usecases') }}</NuxtLink>
        <NuxtLink to="/#process" class="nav-link">{{ t('nav.process') }}</NuxtLink>
        <NuxtLink to="/#contact" class="nav-link">{{ t('nav.contact') }}</NuxtLink>
      </nav>
      <div class="header-actions">
        <button class="lang-switch" @click="toggleLocale" :title="locale === 'nl' ? 'Switch to English' : 'Schakel naar Nederlands'">
          <span class="lang-flag">{{ locale === 'nl' ? 'EN' : 'NL' }}</span>
        </button>
        <NuxtLink to="/#contact" class="header-cta">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          {{ t('nav.cta') }}
        </NuxtLink>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from '../composables/useI18n'

const { t, locale, setLocale } = useI18n()

function toggleLocale () {
  setLocale(locale.value === 'nl' ? 'en' : 'nl')
}

const scrolled = ref(false)

onMounted(() => {
  const saved = localStorage.getItem('nova-locale')
  if (saved === 'en' || saved === 'nl') setLocale(saved)

  const onScroll = () => { scrolled.value = window.scrollY > 20 }
  window.addEventListener('scroll', onScroll, { passive: true })
  onUnmounted(() => window.removeEventListener('scroll', onScroll))
})
</script>

<style scoped>
.header { position: sticky; top: 0; z-index: 100; padding: 20px 32px; background: transparent; transition: background 0.4s ease, border-color 0.4s ease, padding 0.3s ease; border-bottom: 1px solid transparent; }
.header.scrolled { background: rgba(3, 3, 6, 0.88); backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px); border-bottom-color: var(--border-subtle); padding: 14px 32px; }
.header-inner { max-width: 1280px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; gap: 24px; }
.logo { text-decoration: none; color: var(--text-primary); font-family: var(--font-display); font-weight: 700; font-size: 1.2rem; letter-spacing: -0.03em; display: flex; align-items: center; gap: 10px; transition: opacity 0.2s ease; }
.logo:hover { opacity: 0.8; }
.logo-icon { color: var(--accent); flex-shrink: 0; }
.nav { display: flex; gap: 28px; }
.nav-link { color: var(--text-muted); text-decoration: none; font-weight: 500; font-size: 0.875rem; letter-spacing: 0.01em; transition: color 0.2s ease; position: relative; }
.nav-link::after { content: ''; position: absolute; bottom: -4px; left: 0; width: 0; height: 1px; background: var(--accent); transition: width 0.3s ease; }
.nav-link:hover { color: var(--text-primary); }
.nav-link:hover::after { width: 100%; }

.header-actions { display: flex; align-items: center; gap: 12px; }

.lang-switch { display: flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border-glass); background: transparent; color: var(--text-muted); font-family: var(--font-body); font-weight: 600; font-size: 0.7rem; letter-spacing: 0.05em; cursor: pointer; transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease; }
.lang-switch:hover { border-color: rgba(255, 255, 255, 0.15); color: var(--accent); background: rgba(0, 212, 170, 0.05); }

.header-cta { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; font-family: var(--font-body); font-weight: 600; font-size: 0.875rem; letter-spacing: 0.02em; border-radius: 8px; text-decoration: none; background: var(--accent); color: var(--bg-deep); border: none; transition: transform 0.2s ease, box-shadow 0.2s ease; }
.header-cta:hover { transform: translateY(-1px); box-shadow: 0 4px 24px rgba(0, 212, 170, 0.3); }
.header-cta svg { transition: transform 0.2s ease; }
.header-cta:hover svg { transform: translateX(2px); }

@media (max-width: 768px) {
  .nav { display: none; }
  .header { padding: 16px 20px; }
  .header.scrolled { padding: 12px 20px; }
}
</style>
