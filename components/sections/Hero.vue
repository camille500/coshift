<template>
  <section class="hero">
    <ClientOnly>
      <ParticleNetwork />
    </ClientOnly>
    <div class="hero-content">
      <div class="hero-badge reveal">
        <span class="badge-dot"></span>
        {{ t('hero.badge') }}
      </div>
      <h1 class="hero-title reveal reveal-delay-1">
        {{ t('hero.title.1') }}<br />
        <span class="gradient-text">{{ t('hero.title.2') }}</span>.
      </h1>
      <p class="hero-desc reveal reveal-delay-2">{{ t('hero.desc') }}</p>
      <div
        class="hero-typewriter reveal reveal-delay-2"
        :data-phrases="JSON.stringify(phrases)"
        :aria-label="phrases[0]"
      >
        <span class="typewriter-prefix">&gt; </span>
        <span class="typewriter-text" ref="typewriterRef"></span>
        <span class="typewriter-cursor">|</span>
      </div>
      <div class="hero-cta reveal reveal-delay-3">
        <NuxtLink :to="localePath('/#contact')" class="btn-hero">
          <span>{{ t('hero.cta.primary') }}</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </NuxtLink>
        <NuxtLink :to="localePath('/#use-cases')" class="btn-ghost">{{ t('hero.cta.secondary') }}</NuxtLink>
      </div>
    </div>
    <div class="hero-visual">
      <div class="orb orb-1 animate-float"></div>
      <div class="orb orb-2 animate-float-slow"></div>
      <div class="orb orb-3 animate-float" style="animation-delay: -4s"></div>
      <div class="ai-core reveal reveal-delay-2">
        <div class="ring ring-1"></div><div class="ring ring-2"></div><div class="ring ring-3"></div><div class="ring ring-4"></div>
        <div class="core-center">
          <div class="core-pulse"></div>
          <div class="core-pulse core-pulse-2"></div>
          <svg class="core-icon" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
        </div>
        <div class="orbit-track orbit-track-1"><div class="orbit-particle"></div></div>
        <div class="orbit-track orbit-track-2"><div class="orbit-particle p2"></div></div>
        <div class="orbit-track orbit-track-3"><div class="orbit-particle p3"></div></div>
        <div class="orbit-track orbit-track-4"><div class="orbit-particle p4"></div></div>
      </div>
      <div class="float-card float-card-1 glass animate-float">
        <div class="fc-row">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
          <span class="fc-label">{{ t('hero.card.processing') }}</span>
        </div>
        <div class="fc-bar"><div class="fc-bar-fill"></div></div>
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
          <span class="fc-flow-dot"></span><span class="fc-flow-line"></span><span class="fc-flow-dot active"></span><span class="fc-flow-line"></span><span class="fc-flow-dot"></span>
        </div>
        <span class="fc-stat">{{ t('hero.card.agents') }}</span>
      </div>
      <div class="sparkle" style="top: 5%; left: 72%; animation-delay: 0s"></div>
      <div class="sparkle violet" style="top: 78%; left: 58%; animation-delay: 2s"></div>
      <svg class="connection-lines" viewBox="0 0 500 440" fill="none">
        <path d="M250 220 L80 80" stroke="url(#conn-grad)" stroke-width="1" opacity="0.18" stroke-dasharray="4 4" class="conn-dash"/>
        <path d="M250 220 L420 150" stroke="url(#conn-grad)" stroke-width="1" opacity="0.18" stroke-dasharray="4 4" class="conn-dash"/>
        <path d="M250 220 L100 360" stroke="url(#conn-grad)" stroke-width="1" opacity="0.18" stroke-dasharray="4 4" class="conn-dash"/>
        <defs><linearGradient id="conn-grad" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="var(--accent)" stop-opacity="0.6"/><stop offset="100%" stop-color="var(--accent-violet)" stop-opacity="0.3"/></linearGradient></defs>
      </svg>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n();
const localePath = useLocalePath();
const typewriterRef = ref<HTMLSpanElement | null>(null);

const phrases = computed(() => [
  t('hero.typewriter.1'), t('hero.typewriter.2'), t('hero.typewriter.3'),
  t('hero.typewriter.4'), t('hero.typewriter.5'), t('hero.typewriter.6'),
]);

onMounted(() => {
  const el = typewriterRef.value;
  if (!el) return;

  let phraseIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = phrases.value[phraseIdx];
    if (!deleting) {
      el!.textContent = current.substring(0, charIdx++);
      if (charIdx > current.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
      setTimeout(type, 50 + Math.random() * 30);
    } else {
      el!.textContent = current.substring(0, charIdx--);
      if (charIdx < 0) {
        deleting = false;
        phraseIdx = (phraseIdx + 1) % phrases.value.length;
        charIdx = 0;
        setTimeout(type, 400);
        return;
      }
      setTimeout(type, 25);
    }
  }
  setTimeout(type, 1200);
});
</script>

<style scoped>
.hero { min-height: 94vh; display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 48px; align-items: center; max-width: 1280px; margin: 0 auto; padding: 48px 24px 80px; position: relative; overflow: visible; }
.hero-content { max-width: 620px; }
.hero-badge { display: inline-flex; align-items: center; gap: 10px; padding: 6px 14px; font-size: 0.75rem; font-weight: 600; letter-spacing: 0.06em; color: var(--accent); background: var(--accent-dim); border: 1px solid rgba(0, 212, 170, 0.15); border-radius: 6px; margin-bottom: 28px; }
.badge-dot { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: pulse-dot 2s ease-in-out infinite; flex-shrink: 0; }
.hero-title { font-size: clamp(2.6rem, 5.2vw, 4rem); line-height: 1.1; letter-spacing: -0.04em; margin-bottom: 28px; font-weight: 700; }
.hero-desc { color: var(--text-muted); font-size: 1.125rem; line-height: 1.7; margin-bottom: 20px; max-width: 500px; }
.hero-typewriter { display: flex; align-items: center; gap: 2px; font-family: 'Courier New', monospace; font-size: 0.9rem; color: var(--accent); margin-bottom: 32px; padding: 10px 16px; background: rgba(0, 212, 170, 0.04); border: 1px solid rgba(0, 212, 170, 0.1); border-radius: 6px; max-width: 500px; min-height: 44px; }
.typewriter-prefix { opacity: 0.5; user-select: none; }
.typewriter-text { white-space: nowrap; overflow: hidden; }
.typewriter-cursor { animation: blink 1s step-end infinite; font-weight: 300; opacity: 0.7; }
@keyframes blink { 50% { opacity: 0; } }
.hero-cta { display: flex; gap: 16px; flex-wrap: wrap; align-items: center; }
.btn-hero { display: inline-flex; align-items: center; gap: 10px; padding: 14px 28px; background: var(--accent); color: var(--bg-deep); font-family: var(--font-body); font-weight: 600; font-size: 0.95rem; letter-spacing: 0.02em; border-radius: 8px; transition: transform 0.25s ease, box-shadow 0.35s ease; position: relative; overflow: hidden; }
.btn-hero::before { content: ''; position: absolute; inset: 0; background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent); transform: translateX(-100%); transition: transform 0.6s ease; }
.btn-hero:hover::before { transform: translateX(100%); }
.btn-hero:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(0, 212, 170, 0.4); }
.btn-hero svg { transition: transform 0.2s ease; }
.btn-hero:hover svg { transform: translateX(4px); }
.btn-ghost { display: inline-flex; align-items: center; padding: 14px 24px; background: transparent; color: var(--text-primary); font-family: var(--font-body); font-weight: 500; font-size: 0.95rem; border-radius: 8px; border: 1px solid var(--border-glass); transition: border-color 0.3s ease, color 0.3s ease, box-shadow 0.3s ease; }
.btn-ghost:hover { border-color: var(--card-border); color: var(--accent); box-shadow: 0 0 24px rgba(0, 212, 170, 0.06); }

.hero-visual { position: relative; min-height: 480px; display: flex; align-items: center; justify-content: center; }
.orb { position: absolute; border-radius: 50%; filter: blur(80px); opacity: calc(0.22 * var(--aurora-opacity, 1)); }
.orb-1 { width: 280px; height: 280px; background: var(--accent); top: -20px; left: 0; }
.orb-2 { width: 220px; height: 220px; background: var(--accent-violet); top: 35%; right: -10px; }
.orb-3 { width: 160px; height: 160px; background: var(--accent-gold); bottom: 0; left: 25%; opacity: 0.14; }

.ai-core { position: relative; width: 260px; height: 260px; display: flex; align-items: center; justify-content: center; z-index: 2; }
.ring { position: absolute; border-radius: 50%; border: 1px solid; }
.ring-1 { width: 100%; height: 100%; border-color: rgba(0, 212, 170, 0.15); animation: spin-ring 20s linear infinite; }
.ring-2 { width: 78%; height: 78%; border-color: rgba(124, 107, 218, 0.12); border-style: dashed; animation: spin-ring 15s linear infinite reverse; }
.ring-3 { width: 54%; height: 54%; border-color: rgba(0, 212, 170, 0.18); animation: spin-ring 10s linear infinite; }
.ring-4 { width: 130%; height: 130%; border-color: rgba(124, 107, 218, 0.06); border-style: dashed; animation: spin-ring 30s linear infinite; }
.core-center { position: relative; width: 80px; height: 80px; border-radius: 50%; background: radial-gradient(circle, rgba(0, 212, 170, 0.18), rgba(0, 212, 170, 0.03)); border: 1px solid rgba(0, 212, 170, 0.25); display: flex; align-items: center; justify-content: center; z-index: 3; }
.core-icon { color: var(--accent); animation: core-spin 8s ease-in-out infinite; filter: drop-shadow(0 0 8px rgba(0, 212, 170, 0.4)); }
.core-pulse { position: absolute; inset: -10px; border-radius: 50%; border: 1px solid rgba(0, 212, 170, 0.18); animation: core-pulse-anim 3s ease-in-out infinite; }
.core-pulse-2 { animation-delay: -1.5s; border-color: rgba(124, 107, 218, 0.12); inset: -18px; }

.orbit-track { position: absolute; width: 100%; height: 100%; top: 0; left: 0; border-radius: 50%; }
.orbit-track-1 { animation: spin-ring 8s linear infinite; }
.orbit-track-2 { animation: spin-ring 12s linear infinite reverse; width: 78%; height: 78%; top: 11%; left: 11%; }
.orbit-track-3 { animation: spin-ring 6s linear infinite; width: 130%; height: 130%; top: -15%; left: -15%; }
.orbit-track-4 { animation: spin-ring 18s linear infinite reverse; width: 54%; height: 54%; top: 23%; left: 23%; }
.orbit-particle { position: absolute; top: -3px; left: 50%; width: 7px; height: 7px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 14px rgba(0, 212, 170, 0.7), 0 0 28px rgba(0, 212, 170, 0.35); }
.orbit-particle.p2 { background: var(--accent-violet); box-shadow: 0 0 14px rgba(124, 107, 218, 0.7), 0 0 28px rgba(124, 107, 218, 0.35); width: 6px; height: 6px; }
.orbit-particle.p3 { background: var(--accent-gold); box-shadow: 0 0 14px rgba(201, 162, 39, 0.7); width: 5px; height: 5px; }
.orbit-particle.p4 { background: var(--accent); box-shadow: 0 0 10px rgba(0, 212, 170, 0.5); width: 4px; height: 4px; }

.float-card { position: absolute; padding: 14px 18px; z-index: 4; min-width: 155px; border: 1px solid var(--card-border); border-radius: 10px; background: var(--card-bg); box-shadow: var(--card-shadow); transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s ease; }
:global([data-theme="dark"]) .float-card { backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); }
.float-card:hover { transform: translateY(-3px) scale(1.02); box-shadow: var(--card-shadow-hover); }
.float-card-1 { top: -15px; left: -35px; }
.float-card-2 { top: 25px; right: -55px; }
.float-card-3 { bottom: -15px; left: -25px; }
.fc-row { display: flex; align-items: center; gap: 8px; margin-bottom: 10px; }
.fc-label { font-size: 0.75rem; font-weight: 600; color: var(--text-secondary); letter-spacing: 0.02em; }
.fc-bar { height: 4px; background: var(--border-glass); border-radius: 2px; margin-bottom: 8px; overflow: hidden; }
.fc-bar-fill { height: 100%; width: 72%; border-radius: 2px; background: linear-gradient(90deg, var(--accent), var(--accent-violet)); animation: bar-fill 3s ease-in-out infinite alternate; }
.fc-stat { font-size: 0.6875rem; color: var(--text-muted); font-weight: 500; font-variant-numeric: tabular-nums; }
.fc-check { display: flex; align-items: center; gap: 6px; font-size: 0.6875rem; color: var(--text-muted); font-weight: 500; }
.fc-mini-flow { display: flex; align-items: center; gap: 0; margin-bottom: 8px; }
.fc-flow-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--border-glass); border: 1px solid var(--border-glass); flex-shrink: 0; }
.fc-flow-dot.active { background: var(--accent); border-color: var(--accent); box-shadow: 0 0 10px rgba(0, 212, 170, 0.5); animation: dot-active 2s ease-in-out infinite; }
.fc-flow-line { width: 20px; height: 1px; background: var(--border-glass); flex-shrink: 0; }
.connection-lines { position: absolute; inset: 0; width: 100%; height: 100%; z-index: 1; pointer-events: none; }
.conn-dash { animation: dash-flow 4s linear infinite; }

@media (max-width: 900px) {
  .hero { grid-template-columns: 1fr; text-align: center; padding-top: 100px; gap: 32px; min-height: auto; }
  .hero-content { max-width: 100%; }
  .hero-desc { margin-left: auto; margin-right: auto; }
  .hero-cta { justify-content: center; }
  .hero-visual { min-height: 380px; }
  .ai-core { width: 200px; height: 200px; }
  .float-card-1 { left: 0; top: 0; }
  .float-card-2 { right: -20px; }
  .float-card-3 { left: 10px; }
}
</style>
