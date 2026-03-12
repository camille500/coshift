<script setup lang="ts">
const { t } = useI18n();

const casesMeta = [
  { icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>', bg: 'rgba(0, 212, 170, 0.12)', tags: ['NLP', 'Classification', 'Automation'] },
  { icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>', bg: 'rgba(124, 107, 218, 0.12)', tags: ['Chatbot', 'RAG', 'Escalation'] },
  { icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="6" height="6" rx="1"/><rect x="14" y="4" width="6" height="6" rx="1"/><rect x="4" y="14" width="6" height="6" rx="1"/><rect x="14" y="14" width="6" height="6" rx="1"/><line x1="10" y1="7" x2="14" y2="7"/><line x1="7" y1="10" x2="7" y2="14"/><line x1="17" y1="10" x2="17" y2="14"/><line x1="10" y1="17" x2="14" y2="17"/></svg>', bg: 'rgba(201, 162, 39, 0.12)', tags: ['IoT', 'Sensoren', 'Real-time'] },
  { icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>', bg: 'rgba(0, 212, 170, 0.12)', tags: ['ISO 27001', 'ISO 42001', 'Compliance'] },
  { icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18"/><path d="M9 21V9"/></svg>', bg: 'rgba(124, 107, 218, 0.12)', tags: ['NL2SQL', 'Dashboard', 'BI'] },
  { icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>', bg: 'rgba(201, 162, 39, 0.12)', tags: ['Agents', 'LLM', 'Orchestration'] },
  { icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>', bg: 'rgba(0, 212, 170, 0.12)', tags: ['Private Cloud', 'AVG'] },
  { icon: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>', bg: 'rgba(124, 107, 218, 0.12)', tags: ['Workshop', 'Training', 'Adoption'] },
];
</script>

<template>
  <section id="use-cases" class="section">
    <p class="section-label reveal">{{ t('cases.label') }}</p>
    <h2 class="section-title reveal reveal-delay-1">{{ t('cases.title.1') }} <span class="gradient-text">{{ t('cases.title.2') }}</span>.</h2>
    <p class="section-desc reveal reveal-delay-2">{{ t('cases.desc') }}</p>
    <div class="cases-grid">
      <div
        v-for="(c, idx) in casesMeta"
        :key="idx"
        :class="`case-card glass reveal reveal-delay-${(idx % 3) + 1}`"
      >
        <div class="case-icon" :style="`background: ${c.bg}`" v-html="c.icon"></div>
        <div class="case-body">
          <h3 class="case-title">{{ t(`case.${idx + 1}.title`) }}</h3>
          <p class="case-desc">{{ t(`case.${idx + 1}.desc`) }}</p>
        </div>
        <div class="case-tags">
          <span v-for="tag in c.tags" :key="tag" class="case-tag">{{ tag }}</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  .cases-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
  .case-card { padding: 28px 28px 24px; transition: border-color 0.3s ease, background 0.3s ease, transform 0.4s cubic-bezier(0.16, 1, 0.3, 1); cursor: default; position: relative; overflow: hidden; display: flex; flex-direction: column; }
  .case-card::before { content: ''; position: absolute; inset: 0; background: radial-gradient(circle at 30% 30%, rgba(0, 212, 170, 0.04), transparent 70%); opacity: 0; transition: opacity 0.3s ease; }
  .case-card:hover { border-color: var(--card-border); background: var(--card-bg-hover); box-shadow: var(--card-shadow-hover); transform: translateY(-2px); }
  .case-card:hover::before { opacity: 1; }
  .case-icon { width: 42px; height: 42px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; color: var(--text-primary); position: relative; flex-shrink: 0; }
  .case-body { flex: 1; position: relative; }
  .case-title { font-size: 1.0625rem; margin-bottom: 8px; font-weight: 600; position: relative; }
  .case-desc { color: var(--text-muted); font-size: 0.9rem; line-height: 1.6; position: relative; }
  .case-tags { display: flex; gap: 6px; flex-wrap: wrap; position: relative; margin-top: 16px; }
  .case-tag { font-size: 0.7rem; padding: 3px 9px; border-radius: 6px; background: var(--bg-glass); color: var(--text-muted); border: 1px solid var(--border-glass); font-weight: 500; letter-spacing: 0.02em; transition: border-color 0.2s ease, color 0.2s ease; }
  .case-card:hover .case-tag { border-color: rgba(0, 212, 170, 0.15); color: var(--text-secondary); }

  @media (max-width: 900px) { .cases-grid { grid-template-columns: 1fr; max-width: 480px; margin: 0 auto; } }
  @media (min-width: 601px) and (max-width: 1024px) { .cases-grid { grid-template-columns: repeat(2, 1fr); } }
</style>
