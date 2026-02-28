<template>
  <footer class="footer">
    <div class="footer-inner">
      <div class="footer-top">
        <div class="footer-brand">
          <div class="footer-logo">
            <svg class="footer-logo-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2L2 7l10 5 10-5-10-5z"/>
              <path d="M2 17l10 5 10-5" opacity="0.5"/>
              <path d="M2 12l10 5 10-5" opacity="0.75"/>
            </svg>
            <span class="footer-brand-name">Nova Delta</span>
          </div>
          <p class="tagline">{{ t('footer.tagline') }}</p>
        </div>
        <div class="footer-nav">
          <div class="footer-col">
            <p class="footer-col-title">{{ t('footer.nav') }}</p>
            <NuxtLink to="/#services">{{ t('nav.services') }}</NuxtLink>
            <NuxtLink to="/#impact">{{ t('nav.impact') }}</NuxtLink>
            <NuxtLink to="/#use-cases">{{ t('nav.usecases') }}</NuxtLink>
            <NuxtLink to="/#process">{{ t('nav.process') }}</NuxtLink>
            <NuxtLink to="/#contact">{{ t('nav.contact') }}</NuxtLink>
          </div>
          <div class="footer-col">
            <p class="footer-col-title">{{ t('footer.services') }}</p>
            <span>{{ t('footer.s1') }}</span>
            <span>{{ t('footer.s2') }}</span>
            <span>{{ t('footer.s3') }}</span>
            <span>{{ t('footer.s4') }}</span>
          </div>
        </div>
      </div>
      <div class="footer-bottom">
        <p>&copy; {{ new Date().getFullYear() }} Nova Delta. {{ t('footer.rights') }}</p>
        <div class="footer-badges">
          <span class="footer-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
            {{ t('footer.iso') }}
          </span>
          <span class="footer-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            {{ t('footer.gdpr') }}
          </span>
          <span class="footer-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            {{ t('footer.euai') }}
          </span>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { useI18n } from '../composables/useI18n'

const { t } = useI18n()
</script>

<style scoped>
.footer { margin-top: auto; padding: 64px 24px 32px; border-top: 1px solid var(--border-glass); }
.footer-inner { max-width: 1280px; margin: 0 auto; }
.footer-top { display: flex; justify-content: space-between; gap: 48px; flex-wrap: wrap; }
.footer-logo { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; }
.footer-logo-icon { color: var(--accent); }
.footer-brand-name { font-family: var(--font-display); font-weight: 700; font-size: 1.1rem; letter-spacing: -0.02em; color: var(--text-primary); }
.tagline { color: var(--text-muted); font-size: 0.875rem; max-width: 320px; line-height: 1.6; }
.footer-nav { display: flex; gap: 64px; }
.footer-col { display: flex; flex-direction: column; gap: 8px; }
.footer-col-title { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text-secondary); margin-bottom: 4px; }
.footer-col a, .footer-col span { color: var(--text-muted); text-decoration: none; font-size: 0.9rem; transition: color 0.2s ease; }
.footer-col a:hover { color: var(--accent); }
.footer-bottom { margin-top: 48px; padding-top: 24px; border-top: 1px solid var(--border-glass); display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
.footer-bottom p { color: var(--text-muted); font-size: 0.8125rem; }
.footer-badges { display: flex; gap: 20px; }
.footer-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 0.8125rem; color: var(--text-muted); }
.footer-badge svg { color: var(--accent); flex-shrink: 0; }
@media (max-width: 600px) {
  .footer-top { flex-direction: column; }
  .footer-nav { gap: 40px; }
  .footer-bottom { flex-direction: column; align-items: flex-start; }
}
</style>
