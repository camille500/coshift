<template>
  <div>
    <!-- Hero -->
    <section class="hero">
      <div class="hero-content">
        <div class="hero-badge reveal">
          <span class="badge-dot" />
          {{ t('hero.badge') }}
        </div>
        <h1 class="hero-title reveal reveal-delay-1">
          {{ t('hero.title.1') }}<br />
          <span class="gradient-text">{{ t('hero.title.2') }}</span>.
        </h1>
        <p class="hero-desc reveal reveal-delay-2">{{ t('hero.desc') }}</p>
        <div class="hero-cta reveal reveal-delay-3">
          <NuxtLink to="/#contact" class="btn-hero">
            <span>{{ t('hero.cta.primary') }}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </NuxtLink>
          <NuxtLink to="/#use-cases" class="btn-ghost">{{ t('hero.cta.secondary') }}</NuxtLink>
        </div>
      </div>
      <div class="hero-visual">
        <div class="orb orb-1 animate-float" />
        <div class="orb orb-2 animate-float-slow" />
        <div class="orb orb-3 animate-float" style="animation-delay: -4s" />
        <div class="ai-core reveal reveal-delay-2">
          <div class="ring ring-1" /><div class="ring ring-2" /><div class="ring ring-3" /><div class="ring ring-4" />
          <div class="core-center">
            <div class="core-pulse" />
            <div class="core-pulse core-pulse-2" />
            <svg class="core-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
          </div>
          <div class="orbit-track orbit-track-1"><div class="orbit-particle" /></div>
          <div class="orbit-track orbit-track-2"><div class="orbit-particle p2" /></div>
          <div class="orbit-track orbit-track-3"><div class="orbit-particle p3" /></div>
          <div class="orbit-track orbit-track-4"><div class="orbit-particle p4" /></div>
        </div>
        <div class="float-card float-card-1 glass animate-float">
          <div class="fc-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
            <span class="fc-label">{{ t('hero.card.processing') }}</span>
          </div>
          <div class="fc-bar"><div class="fc-bar-fill" /></div>
          <span class="fc-stat">12,847 docs/hr</span>
        </div>
        <div class="float-card float-card-2 glass animate-float-slow">
          <div class="fc-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent-violet)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span class="fc-label">{{ t('hero.card.compliance') }}</span>
          </div>
          <span class="fc-check">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            ISO 27001 · 42001
          </span>
        </div>
        <div class="float-card float-card-3 glass" style="animation: float 7s ease-in-out infinite; animation-delay: -2s;">
          <div class="fc-row">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#c9a227" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
            <span class="fc-label">{{ t('hero.card.automation') }}</span>
          </div>
          <div class="fc-mini-flow">
            <span class="fc-flow-dot" /><span class="fc-flow-line" /><span class="fc-flow-dot active" /><span class="fc-flow-line" /><span class="fc-flow-dot" />
          </div>
          <span class="fc-stat">{{ t('hero.card.agents') }}</span>
        </div>
        <div class="sparkle" style="top: 5%; left: 72%; animation-delay: 0s" />
        <div class="sparkle" style="top: 85%; left: 10%; animation-delay: 1s" />
        <div class="sparkle violet" style="top: 18%; left: 12%; animation-delay: 2s" />
        <div class="sparkle" style="top: 60%; left: 88%; animation-delay: 3s" />
        <div class="sparkle lg" style="top: 12%; left: 48%; animation-delay: 1.5s" />
        <div class="sparkle lg violet" style="top: 78%; left: 58%; animation-delay: 3.5s" />
        <div class="sparkle" style="top: 40%; left: 95%; animation-delay: 0.5s" />
        <div class="sparkle lg" style="top: 92%; left: 42%; animation-delay: 2.5s" />
        <svg class="connection-lines" viewBox="0 0 500 440" fill="none">
          <path d="M250 220 L80 80" stroke="url(#conn-grad)" stroke-width="1" opacity="0.18" stroke-dasharray="4 4" class="conn-dash"/>
          <path d="M250 220 L420 150" stroke="url(#conn-grad)" stroke-width="1" opacity="0.18" stroke-dasharray="4 4" class="conn-dash"/>
          <path d="M250 220 L100 360" stroke="url(#conn-grad)" stroke-width="1" opacity="0.18" stroke-dasharray="4 4" class="conn-dash"/>
          <path d="M250 220 L400 380" stroke="url(#conn-grad)" stroke-width="1" opacity="0.1" stroke-dasharray="4 4" class="conn-dash"/>
          <defs><linearGradient id="conn-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--accent)" stop-opacity="0.6"/><stop offset="100%" stop-color="var(--accent-violet)" stop-opacity="0.3"/></linearGradient></defs>
        </svg>
      </div>
    </section>

    <!-- Marquee -->
    <div class="marquee-wrap reveal">
      <div class="marquee-track">
        <span v-for="n in 3" :key="n" class="marquee-set">
          <span v-for="i in 8" :key="`${n}-${i}`" class="marquee-item">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            {{ t(`marquee.${i}`) }}
          </span>
        </span>
      </div>
    </div>

    <!-- Services -->
    <section id="services" class="section">
      <p class="section-label reveal">{{ t('services.label') }}</p>
      <h2 class="section-title reveal reveal-delay-1">{{ t('services.title.1') }} <span class="gradient-text">{{ t('services.title.2') }}</span>.</h2>
      <p class="section-desc reveal reveal-delay-2">{{ t('services.desc') }}</p>
      <div class="services-grid">
        <div v-for="i in 5" :key="i" class="service-card glass reveal" :class="['reveal-delay-' + i, { 'service-card-wide': i === 4 }]">
          <div class="service-icon-wrap" :style="{ background: serviceStyles[i-1].bg, borderColor: serviceStyles[i-1].border }">
            <div v-html="serviceIcons[i-1]" />
          </div>
          <h3 class="service-title">{{ t(`service.${i}.title`) }}</h3>
          <p class="service-desc">{{ t(`service.${i}.desc`) }}</p>
          <div v-if="i === 4" class="service-badges">
            <span class="service-badge">ISO 27001</span>
            <span class="service-badge">ISO 42001</span>
            <span class="service-badge">Gap-analyse</span>
            <span class="service-badge">Certificering</span>
          </div>
        </div>
      </div>
    </section>

    <div class="glow-separator" />

    <!-- Impact -->
    <section id="impact" class="section section-impact">
      <p class="section-label reveal">{{ t('impact.label') }}</p>
      <h2 class="section-title reveal reveal-delay-1">{{ t('impact.title.1') }} <span class="gradient-text">{{ t('impact.title.2') }}</span>.</h2>
      <p class="section-desc reveal reveal-delay-2">{{ t('impact.desc') }}</p>
      <div class="impact-grid">
        <div v-for="i in 3" :key="i" class="impact-card glass reveal" :class="'reveal-delay-' + i">
          <div class="impact-before">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
            <span>{{ t(`impact.${i}.before`) }}</span>
          </div>
          <div class="impact-arrow">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </div>
          <div class="impact-after">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
            <span>{{ t(`impact.${i}.after`) }}</span>
          </div>
          <div class="impact-metric">
            <span class="impact-metric-value">{{ t(`impact.${i}.metric`) }}</span>
            <span class="impact-metric-label">{{ t(`impact.${i}.metricLabel`) }}</span>
          </div>
        </div>
      </div>
      <p class="impact-bottom reveal">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
        {{ t('impact.bottom') }}
      </p>
    </section>

    <!-- Manifesto -->
    <section class="section section-manifesto">
      <div class="manifesto-inner">
        <div class="manifesto-sparkle sparkle lg" style="top: 10%; left: 5%; animation-delay: 0s" />
        <div class="manifesto-sparkle sparkle violet" style="top: 80%; right: 8%; animation-delay: 1.5s" />
        <div class="manifesto-sparkle sparkle lg" style="bottom: 15%; left: 50%; animation-delay: 2.5s" />
        <p class="manifesto-line reveal">{{ t('manifesto.line1') }}</p>
        <p class="manifesto-line reveal reveal-delay-1">{{ t('manifesto.line2') }}</p>
        <p class="manifesto-line manifesto-dim reveal reveal-delay-2">{{ t('manifesto.line3') }}</p>
        <p class="manifesto-line manifesto-accent reveal reveal-delay-3">
          <span class="gradient-text">{{ t('manifesto.line4') }}</span>
        </p>
      </div>
    </section>

    <div class="glow-separator" />

    <!-- Use Cases -->
    <section id="use-cases" class="section">
      <p class="section-label reveal">{{ t('cases.label') }}</p>
      <h2 class="section-title reveal reveal-delay-1">{{ t('cases.title.1') }} <span class="gradient-text">{{ t('cases.title.2') }}</span>.</h2>
      <p class="section-desc reveal reveal-delay-2">{{ t('cases.desc') }}</p>
      <div class="cases-grid">
        <div v-for="(c, idx) in casesMeta" :key="idx" class="case-card glass reveal" :class="'reveal-delay-' + ((idx % 3) + 1)">
          <div class="case-icon" :style="{ background: c.bg }"><div v-html="c.icon" /></div>
          <div class="case-body">
            <h3 class="case-title">{{ t(`case.${idx+1}.title`) }}</h3>
            <p class="case-desc">{{ t(`case.${idx+1}.desc`) }}</p>
          </div>
          <div class="case-tags">
            <span v-for="tag in c.tags" :key="tag" class="case-tag">{{ tag }}</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Features strip -->
    <section class="section section-features">
      <div class="features-strip">
        <div v-for="i in 4" :key="i" class="feature-item reveal" :class="'reveal-delay-' + i">
          <div class="feature-icon" v-html="featureIcons[i-1]" />
          <div class="feature-number">{{ t(`feature.${i}.stat`) }}</div>
          <div class="feature-label">{{ t(`feature.${i}.label`) }}</div>
        </div>
      </div>
    </section>

    <!-- Process -->
    <section id="process" class="section">
      <p class="section-label reveal">{{ t('process.label') }}</p>
      <h2 class="section-title reveal reveal-delay-1">{{ t('process.title.1') }} <span class="gradient-text">{{ t('process.title.2') }}</span>.</h2>
      <div class="process-grid">
        <div v-for="i in 3" :key="i" class="process-step reveal" :class="'reveal-delay-' + i">
          <div class="step-number">{{ String(i).padStart(2, '0') }}</div>
          <div class="step-icon-wrap"><div v-html="stepIcons[i-1]" /></div>
          <h3 class="step-title">{{ t(`step.${i}.title`) }}</h3>
          <p class="step-desc">{{ t(`step.${i}.desc`) }}</p>
        </div>
        <div class="process-line" aria-hidden="true" />
      </div>
    </section>

    <div class="glow-separator" />

    <!-- Contact -->
    <section id="contact" class="section section-contact">
      <div class="cta-card glass reveal">
        <div class="cta-orb cta-orb-1" /><div class="cta-orb cta-orb-2" /><div class="cta-orb cta-orb-3" />
        <div class="sparkle lg" style="top: 8%; left: 10%; animation-delay: 0.5s" />
        <div class="sparkle violet" style="bottom: 12%; right: 8%; animation-delay: 2s" />
        <div class="cta-content">
          <h2 class="cta-title">{{ t('contact.title.1') }} <span class="gradient-text">{{ t('contact.title.2') }}</span>?</h2>
          <p class="cta-desc">{{ t('contact.desc') }}</p>
          <form class="contact-form" @submit.prevent="onSubmit">
            <div class="form-row-inline">
              <div class="form-field"><input v-model="form.name" type="text" :placeholder="t('contact.name')" required /></div>
              <div class="form-field"><input v-model="form.email" type="email" :placeholder="t('contact.email')" required /></div>
            </div>
            <div class="form-field"><textarea v-model="form.message" :placeholder="t('contact.message')" rows="4" required /></div>
            <button type="submit" class="btn-submit">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
              {{ t('contact.submit') }}
            </button>
          </form>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

const serviceIcons = [
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="9" height="9" rx="2"/><rect x="13" y="2" width="9" height="9" rx="2"/><rect x="2" y="13" width="9" height="9" rx="2"/><rect x="13" y="13" width="9" height="9" rx="2"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 3 21 3 21 8"/><line x1="4" y1="20" x2="21" y2="3"/><polyline points="21 16 21 21 16 21"/><line x1="15" y1="15" x2="21" y2="21"/><line x1="4" y1="4" x2="9" y2="9"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
]

const serviceStyles = [
  { bg: 'rgba(0, 212, 170, 0.1)', border: 'rgba(0, 212, 170, 0.15)' },
  { bg: 'rgba(124, 107, 218, 0.1)', border: 'rgba(124, 107, 218, 0.15)' },
  { bg: 'rgba(201, 162, 39, 0.1)', border: 'rgba(201, 162, 39, 0.15)' },
  { bg: 'rgba(0, 212, 170, 0.1)', border: 'rgba(0, 212, 170, 0.15)' },
  { bg: 'rgba(124, 107, 218, 0.1)', border: 'rgba(124, 107, 218, 0.15)' }
]

const casesMeta = [
  { icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>', bg: 'rgba(0, 212, 170, 0.12)', tags: ['NLP', 'Classification', 'Automation'] },
  { icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', bg: 'rgba(124, 107, 218, 0.12)', tags: ['Chatbot', 'RAG', 'Escalation'] },
  { icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>', bg: 'rgba(201, 162, 39, 0.12)', tags: ['ML', 'IoT', 'Forecasting'] },
  { icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>', bg: 'rgba(0, 212, 170, 0.12)', tags: ['ISO 27001', 'ISO 42001', 'Audit'] },
  { icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>', bg: 'rgba(124, 107, 218, 0.12)', tags: ['NL2SQL', 'Dashboard', 'BI'] },
  { icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>', bg: 'rgba(201, 162, 39, 0.12)', tags: ['Agents', 'LLM', 'Orchestration'] }
]

const featureIcons = [
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/></svg>'
]

const stepIcons = [
  '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
  '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
]

const form = reactive({ name: '', email: '', message: '' })

function onSubmit () {
  alert(t('contact.thanks'))
  form.name = ''
  form.email = ''
  form.message = ''
}

onMounted(() => {
  const observer = new IntersectionObserver(
    (entries) => { entries.forEach((entry) => { if (entry.isIntersecting) entry.target.classList.add('visible') }) },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  )
  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el))
  onUnmounted(() => observer.disconnect())
})
</script>

<style scoped>
/* Hero */
.hero { min-height: 94vh; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: center; max-width: 1280px; margin: 0 auto; padding: 48px 24px 80px; }
.hero-content { max-width: 620px; }
.hero-badge { display: inline-flex; align-items: center; gap: 10px; padding: 6px 14px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.06em; color: var(--accent); background: var(--accent-dim); border: 1px solid rgba(0, 212, 170, 0.15); border-radius: 6px; margin-bottom: 28px; }
.badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse-dot 2s ease-in-out infinite; flex-shrink: 0; }
@keyframes pulse-dot { 0%, 100% { opacity: 1; box-shadow: 0 0 0 0 rgba(0, 212, 170, 0.4); } 50% { opacity: 0.7; box-shadow: 0 0 0 8px rgba(0, 212, 170, 0); } }
.hero-title { font-size: clamp(2.6rem, 5.2vw, 4rem); line-height: 1.1; letter-spacing: -0.04em; margin-bottom: 28px; font-weight: 700; }
.hero-desc { color: var(--text-muted); font-size: 1.125rem; line-height: 1.7; margin-bottom: 40px; max-width: 500px; }
.hero-cta { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
.btn-hero { display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px; background: var(--accent); color: var(--bg-deep); font-family: var(--font-body); font-weight: 600; font-size: 0.95rem; letter-spacing: 0.02em; border-radius: 8px; text-decoration: none; transition: transform 0.25s ease, box-shadow 0.35s ease; border: none; cursor: pointer; position: relative; overflow: hidden; }
.btn-hero::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent); transform: translateX(-100%); transition: transform 0.6s ease; }
.btn-hero:hover::before { transform: translateX(100%); }
.btn-hero:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0, 212, 170, 0.4); }
.btn-hero svg { transition: transform 0.2s ease; }
.btn-hero:hover svg { transform: translateX(4px); }
.btn-ghost { display: inline-flex; align-items: center; padding: 14px 24px; background: transparent; color: var(--text-primary); font-family: var(--font-body); font-weight: 500; font-size: 0.95rem; letter-spacing: 0.01em; border-radius: 8px; text-decoration: none; border: 1px solid var(--border-glass); transition: border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease; }
.btn-ghost:hover { border-color: rgba(255, 255, 255, 0.15); color: var(--accent); box-shadow: 0 0 24px rgba(0, 212, 170, 0.06); }

/* Hero visual */
.hero-visual { position: relative; min-height: 480px; display: flex; align-items: center; justify-content: center; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.22; }
.orb-1 { width: 280px; height: 280px; background: var(--accent); top: -20px; left: 0; }
.orb-2 { width: 220px; height: 220px; background: var(--accent-violet); top: 35%; right: -10px; }
.orb-3 { width: 160px; height: 160px; background: var(--accent-gold); bottom: 0; left: 25%; opacity: 0.14; }

/* AI Core */
.ai-core { position: relative; width: 260px; height: 260px; display: flex; align-items: center; justify-content: center; z-index: 2; }
.ring { position: absolute; border-radius: 50%; border: 1px solid; }
.ring-1 { width: 100%; height: 100%; border-color: rgba(0, 212, 170, 0.15); animation: spin-ring 20s linear infinite; }
.ring-2 { width: 78%; height: 78%; border-color: rgba(124, 107, 218, 0.12); border-style: dashed; animation: spin-ring 15s linear infinite reverse; }
.ring-3 { width: 54%; height: 54%; border-color: rgba(0, 212, 170, 0.18); animation: spin-ring 10s linear infinite; }
.ring-4 { width: 130%; height: 130%; border-color: rgba(124, 107, 218, 0.06); border-style: dashed; animation: spin-ring 30s linear infinite; }
@keyframes spin-ring { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
.core-center { position: relative; width: 80px; height: 80px; border-radius: 50%; background: radial-gradient(circle, rgba(0, 212, 170, 0.18), rgba(0, 212, 170, 0.03)); border: 1px solid rgba(0, 212, 170, 0.25); display: flex; align-items: center; justify-content: center; z-index: 3; }
.core-icon { color: var(--accent); animation: core-spin 8s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(0, 212, 170, 0.4)); }
@keyframes core-spin { 0%, 100% { transform: rotate(0deg) scale(1); } 25% { transform: rotate(5deg) scale(1.08); } 75% { transform: rotate(-5deg) scale(0.92); } }
.core-pulse { position: absolute; inset: -10px; border-radius: 50%; border: 1px solid rgba(0, 212, 170, 0.18); animation: core-pulse-anim 3s ease-in-out infinite; }
.core-pulse-2 { animation-delay: -1.5s; border-color: rgba(124, 107, 218, 0.12); inset: -18px; }
@keyframes core-pulse-anim { 0%, 100% { transform: scale(1); opacity: 0.7; } 50% { transform: scale(1.35); opacity: 0; } }

.orbit-track { position: absolute; width: 100%; height: 100%; top: 0; left: 0; border-radius: 50%; }
.orbit-track-1 { animation: spin-ring 8s linear infinite; }
.orbit-track-2 { animation: spin-ring 12s linear infinite reverse; width: 78%; height: 78%; top: 11%; left: 11%; }
.orbit-track-3 { animation: spin-ring 6s linear infinite; width: 130%; height: 130%; top: -15%; left: -15%; }
.orbit-track-4 { animation: spin-ring 18s linear infinite reverse; width: 54%; height: 54%; top: 23%; left: 23%; }
.orbit-particle { position: absolute; top: -3px; left: 50%; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 14px rgba(0, 212, 170, 0.7), 0 0 28px rgba(0, 212, 170, 0.35); }
.orbit-particle.p2 { background: var(--accent-violet); box-shadow: 0 0 14px rgba(124, 107, 218, 0.7), 0 0 28px rgba(124, 107, 218, 0.35); width: 6px; height: 6px; }
.orbit-particle.p3 { background: var(--accent-gold); box-shadow: 0 0 14px rgba(201, 162, 39, 0.7); width: 5px; height: 5px; }
.orbit-particle.p4 { background: var(--accent); box-shadow: 0 0 10px rgba(0, 212, 170, 0.5); width: 4px; height: 4px; }

/* Float cards */
.float-card { position: absolute; padding: 14px 18px; z-index: 4; min-width: 155px; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 10px; background: rgba(10, 10, 18, 0.75); backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; }
.float-card:hover { transform: translateY(-6px) scale(1.03); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3); }
.float-card-1 { top: -15px; left: -35px; }
.float-card-2 { top: 25px; right: -55px; }
.float-card-3 { bottom: -15px; left: -25px; }
.fc-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.fc-label { font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); letter-spacing: 0.02em; }
.fc-bar { height: 4px; background: rgba(255, 255, 255, 0.06); border-radius: 2px; margin-bottom: 8px; overflow: hidden; }
.fc-bar-fill { height: 100%; width: 72%; border-radius: 2px; background: linear-gradient(90deg, var(--accent), var(--accent-violet)); animation: bar-fill 3s ease-in-out infinite alternate; }
@keyframes bar-fill { 0% { width: 40%; } 100% { width: 92%; } }
.fc-stat { font-size: 0.6875rem; color: var(--text-muted); font-weight: 500; font-variant-numeric: tabular-nums; }
.fc-check { display: flex; align-items: center; gap: 6px; font-size: 0.6875rem; color: var(--text-muted); font-weight: 500; }
.fc-mini-flow { display: flex; align-items: center; gap: 0; margin-bottom: 8px; }
.fc-flow-dot { width: 8px; height: 8px; border-radius: 50%; background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.08); flex-shrink: 0; }
.fc-flow-dot.active { background: var(--accent); border-color: var(--accent); box-shadow: 0 0 10px rgba(0, 212, 170, 0.5); animation: dot-active 2s ease-in-out infinite; }
@keyframes dot-active { 0%, 100% { box-shadow: 0 0 10px rgba(0, 212, 170, 0.5); } 50% { box-shadow: 0 0 20px rgba(0, 212, 170, 0.8); } }
.fc-flow-line { width: 20px; height: 1px; background: rgba(255, 255, 255, 0.08); flex-shrink: 0; }
.connection-lines { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; }
.conn-dash { animation: dash-flow 4s linear infinite; }
@keyframes dash-flow { from { stroke-dashoffset: 0; } to { stroke-dashoffset: -24; } }

/* Marquee */
.marquee-wrap { overflow: hidden; padding: 28px 0 88px; border-bottom: 1px solid var(--border-glass); }
.marquee-track { display: flex; width: max-content; animation: marquee 35s linear infinite; }
.marquee-set { display: flex; }
.marquee-item { display: inline-flex; align-items: center; gap: 8px; padding: 0 32px; font-size: 0.875rem; font-weight: 500; color: var(--text-muted); white-space: nowrap; letter-spacing: 0.02em; text-transform: uppercase; }
@keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-33.333%); } }

/* Sections */
.section { max-width: 1280px; margin: 0 auto; padding: 100px 24px; scroll-margin-top: 100px; }
.section-label { text-align: center; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.12em; color: var(--accent); margin-bottom: 12px; text-transform: uppercase; }
.section-title { font-size: clamp(1.9rem, 3.8vw, 2.6rem); text-align: center; margin-bottom: 16px; letter-spacing: -0.03em; font-weight: 700; line-height: 1.2; }
.section-desc { color: var(--text-muted); text-align: center; max-width: 560px; margin: 0 auto 56px; font-size: 1.0625rem; line-height: 1.65; }

/* Services */
.services-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 20px; }
.service-card { padding: 36px; transition: border-color 0.3s ease, background 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); cursor: default; position: relative; overflow: hidden; }
.service-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 20% 20%, rgba(0, 212, 170, 0.04), transparent 70%); opacity: 0; transition: opacity 0.3s ease; }
.service-card:hover { border-color: rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.04); transform: translateY(-6px); }
.service-card:hover::before { opacity: 1; }
.service-icon-wrap { width: 48px; height: 48px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 20px; color: var(--text-primary); border: 1px solid; position: relative; transition: transform 0.3s ease, box-shadow 0.3s ease; }
.service-card:hover .service-icon-wrap { transform: scale(1.1); box-shadow: 0 4px 20px rgba(0, 212, 170, 0.15); }
.service-title { font-size: 1.25rem; margin-bottom: 12px; font-weight: 600; position: relative; }
.service-desc { color: var(--text-muted); font-size: 0.95rem; line-height: 1.65; position: relative; }
.service-card-wide { grid-column: 1 / -1; display: grid; grid-template-columns: auto 1fr; grid-template-rows: auto auto auto; column-gap: 24px; }
.service-card-wide .service-icon-wrap { grid-row: 1 / 3; align-self: start; }
.service-card-wide .service-title { grid-column: 2; }
.service-card-wide .service-desc { grid-column: 2; }
.service-badges { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 16px; grid-column: 2; position: relative; }
.service-badge { font-size: 0.7rem; padding: 4px 10px; border-radius: 6px; background: rgba(0, 212, 170, 0.08); color: var(--accent); border: 1px solid rgba(0, 212, 170, 0.12); font-weight: 600; letter-spacing: 0.04em; }

/* Impact */
.section-impact { background: linear-gradient(180deg, transparent, rgba(0, 212, 170, 0.018), transparent); }
.impact-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
.impact-card { padding: 32px; display: flex; flex-direction: column; gap: 16px; transition: border-color 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; }
.impact-card:hover { border-color: rgba(255, 255, 255, 0.1); transform: translateY(-6px); box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2); }
.impact-before { display: flex; align-items: center; gap: 8px; font-size: 0.875rem; color: var(--text-muted); text-decoration: line-through; opacity: 0.6; }
.impact-arrow { display: flex; justify-content: center; animation: bounce-right 2s ease-in-out infinite; }
@keyframes bounce-right { 0%, 100% { transform: translateX(0); } 50% { transform: translateX(6px); } }
.impact-after { display: flex; align-items: center; gap: 8px; font-size: 0.9rem; color: var(--text-primary); font-weight: 500; }
.impact-metric { margin-top: auto; padding-top: 16px; border-top: 1px solid var(--border-glass); display: flex; align-items: baseline; gap: 8px; }
.impact-metric-value { font-family: var(--font-display); font-size: 2.25rem; font-weight: 800; background: linear-gradient(135deg, var(--accent), var(--accent-violet)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1; }
.impact-metric-label { font-size: 0.8125rem; color: var(--text-muted); font-weight: 500; }
.impact-bottom { text-align: center; display: flex; align-items: center; justify-content: center; gap: 10px; margin-top: 48px; font-size: 1.0625rem; color: var(--text-secondary); font-weight: 500; line-height: 1.5; }

/* Manifesto */
.section-manifesto { padding: 120px 24px; position: relative; overflow: hidden; }
.section-manifesto::before { content: ''; position: absolute; inset: 0; background: radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0, 212, 170, 0.025), transparent 70%); pointer-events: none; }
.manifesto-inner { max-width: 800px; margin: 0 auto; text-align: center; position: relative; }
.manifesto-line { font-family: var(--font-display); font-size: clamp(1.75rem, 3.5vw, 2.75rem); font-weight: 700; letter-spacing: -0.03em; line-height: 1.3; color: var(--text-primary); margin-bottom: 8px; }
.manifesto-dim { color: var(--text-muted); }
.manifesto-accent { font-size: clamp(2rem, 4vw, 3.25rem); margin-top: 8px; }
.manifesto-sparkle { z-index: 1; }

/* Use cases */
.cases-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
.case-card { padding: 28px 28px 24px; transition: border-color 0.3s ease, background 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); cursor: default; position: relative; overflow: hidden; display: flex; flex-direction: column; }
.case-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 30% 30%, rgba(0, 212, 170, 0.04), transparent 70%); opacity: 0; transition: opacity 0.3s ease; }
.case-card:hover { border-color: rgba(255, 255, 255, 0.1); background: rgba(255, 255, 255, 0.04); transform: translateY(-6px); }
.case-card:hover::before { opacity: 1; }
.case-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; color: var(--text-primary); position: relative; flex-shrink: 0; }
.case-body { flex: 1; position: relative; }
.case-title { font-size: 1.0625rem; margin-bottom: 8px; font-weight: 600; position: relative; }
.case-desc { color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; position: relative; }
.case-tags { display: flex; gap: 6px; flex-wrap: wrap; position: relative; margin-top: 16px; }
.case-tag { font-size: 0.7rem; padding: 3px 9px; border-radius: 6px; background: rgba(255, 255, 255, 0.04); color: var(--text-muted); border: 1px solid rgba(255, 255, 255, 0.06); font-weight: 500; letter-spacing: 0.02em; transition: border-color 0.2s ease, color 0.2s ease; }
.case-card:hover .case-tag { border-color: rgba(0, 212, 170, 0.15); color: var(--text-secondary); }

/* Features */
.section-features { border-top: 1px solid var(--border-glass); border-bottom: 1px solid var(--border-glass); padding: 64px 24px; }
.features-strip { display: flex; justify-content: center; gap: 80px; flex-wrap: wrap; }
.feature-item { text-align: center; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.feature-icon { color: var(--accent); margin-bottom: 4px; opacity: 0.7; }
.feature-number { font-family: var(--font-display); font-size: 2.5rem; font-weight: 800; letter-spacing: -0.03em; background: linear-gradient(135deg, var(--accent), var(--accent-violet)); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text; line-height: 1.1; }
.feature-label { font-size: 0.875rem; color: var(--text-muted); font-weight: 500; }

/* Process */
.process-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 40px; position: relative; margin-top: 16px; }
.process-line { position: absolute; top: 72px; left: 20%; right: 20%; height: 1px; background: linear-gradient(90deg, transparent, var(--border-glass), var(--accent-dim), var(--border-glass), transparent); }
.process-step { text-align: center; position: relative; }
.step-number { font-family: var(--font-display); font-size: 0.75rem; font-weight: 700; color: var(--accent); letter-spacing: 0.1em; margin-bottom: 16px; }
.step-icon-wrap { width: 56px; height: 56px; border-radius: 12px; background: var(--accent-dim); border: 1px solid rgba(0, 212, 170, 0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; color: var(--accent); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; }
.process-step:hover .step-icon-wrap { transform: translateY(-6px); box-shadow: 0 12px 40px rgba(0, 212, 170, 0.25); }
.step-title { font-size: 1.125rem; margin-bottom: 10px; font-weight: 600; }
.step-desc { color: var(--text-muted); font-size: 0.9375rem; line-height: 1.6; max-width: 300px; margin: 0 auto; }

/* Contact */
.section-contact { padding-bottom: 120px; }
.cta-card { max-width: 760px; margin: 0 auto; padding: 64px; position: relative; overflow: hidden; }
.cta-orb { position: absolute; border-radius: 50%; filter: blur(80px); pointer-events: none; }
.cta-orb-1 { width: 240px; height: 240px; background: var(--accent); opacity: 0.08; top: -80px; right: -60px; animation: breathe 8s ease-in-out infinite; }
.cta-orb-2 { width: 200px; height: 200px; background: var(--accent-violet); opacity: 0.06; bottom: -60px; left: -60px; animation: breathe 10s ease-in-out infinite; animation-delay: -3s; }
.cta-orb-3 { width: 160px; height: 160px; background: var(--accent-gold); opacity: 0.04; top: 50%; left: 50%; transform: translate(-50%, -50%); animation: breathe 12s ease-in-out infinite; animation-delay: -6s; }
.cta-content { position: relative; }
.cta-title { font-size: clamp(1.75rem, 3vw, 2.5rem); line-height: 1.2; margin-bottom: 12px; letter-spacing: -0.025em; text-align: center; }
.cta-desc { color: var(--text-muted); text-align: center; font-size: 1.05rem; margin-bottom: 40px; }
.contact-form { display: flex; flex-direction: column; gap: 16px; }
.form-row-inline { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-field input, .form-field textarea { width: 100%; padding: 14px 18px; border-radius: 8px; border: 1px solid var(--border-glass); background: rgba(0, 0, 0, 0.35); color: var(--text-primary); font-family: var(--font-body); font-size: 0.95rem; transition: border-color 0.3s ease, box-shadow 0.3s ease; }
.form-field input::placeholder, .form-field textarea::placeholder { color: var(--text-muted); opacity: 0.7; }
.form-field input:focus, .form-field textarea:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 1px var(--accent), 0 0 32px rgba(0, 212, 170, 0.12); }
.form-field textarea { resize: vertical; min-height: 100px; }
.btn-submit { display: inline-flex; align-items: center; justify-content: center; gap: 10px; padding: 14px 28px; background: var(--accent); color: var(--bg-deep); font-family: var(--font-body); font-weight: 600; font-size: 0.95rem; letter-spacing: 0.02em; border-radius: 8px; border: none; cursor: pointer; transition: transform 0.25s ease, box-shadow 0.35s ease; align-self: center; position: relative; overflow: hidden; }
.btn-submit::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent); transform: translateX(-100%); transition: transform 0.6s ease; }
.btn-submit:hover::before { transform: translateX(100%); }
.btn-submit:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0, 212, 170, 0.4); }

/* Responsive */
@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; text-align: center; padding-top: 24px; gap: 32px; min-height: auto; }
  .hero-content { max-width: 100%; }
  .hero-desc { margin-left: auto; margin-right: auto; }
  .hero-cta { justify-content: center; }
  .hero-visual { min-height: 380px; }
  .ai-core { width: 200px; height: 200px; }
  .float-card-1 { left: 0; top: 0; }
  .float-card-2 { right: -20px; }
  .float-card-3 { left: 10px; }
  .services-grid { grid-template-columns: 1fr; max-width: 520px; margin: 0 auto; }
  .service-card-wide { grid-template-columns: 1fr; }
  .service-card-wide .service-icon-wrap { grid-row: auto; }
  .service-card-wide .service-title { grid-column: 1; }
  .service-card-wide .service-desc { grid-column: 1; }
  .service-badges { grid-column: 1; }
  .impact-grid { grid-template-columns: 1fr; max-width: 420px; margin: 0 auto; }
  .cases-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; }
  .process-grid { grid-template-columns: 1fr; max-width: 380px; margin: 0 auto; }
  .process-line { display: none; }
  .features-strip { gap: 40px; }
  .form-row-inline { grid-template-columns: 1fr; }
  .cta-card { padding: 40px 24px; }
  .section-manifesto { padding: 80px 24px; }
  .manifesto-line { font-size: clamp(1.4rem, 5vw, 2rem); }
  .manifesto-accent { font-size: clamp(1.6rem, 6vw, 2.5rem); }
}
@media (min-width: 601px) and (max-width: 1024px) {
  .cases-grid { grid-template-columns: repeat(2, 1fr); }
  .impact-grid { grid-template-columns: repeat(2, 1fr); }
  .impact-grid .impact-card:last-child { grid-column: span 2; max-width: 420px; margin: 0 auto; }
}
</style>
