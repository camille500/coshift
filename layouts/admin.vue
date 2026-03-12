<template>
  <div class="admin-body">
    <Head>
      <Title>{{ title }}</Title>
      <Meta name="robots" content="noindex, nofollow" />
      <Link rel="preload" href="/fonts/PlusJakartaSans-Bold.woff2" as="font" type="font/woff2" crossorigin="" />
    </Head>

    <aside class="admin-sidebar">
      <NuxtLink to="/" class="admin-logo">
        <span class="logo-text">Co</span><span class="logo-accent">Shift</span>
      </NuxtLink>
      <nav class="admin-nav">
        <NuxtLink to="/admin" class="admin-nav-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Dashboard
        </NuxtLink>
        <NuxtLink to="/admin/blog" class="admin-nav-link">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/></svg>
          Blog Posts
        </NuxtLink>
      </nav>
    </aside>

    <div class="admin-main">
      <header class="admin-header">
        <h1 class="admin-page-title">{{ title }}</h1>
        <UserButton />
      </header>
      <div class="admin-content">
        <slot />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { UserButton } from '@clerk/nuxt/components';

// Pages inject their title via provide('adminTitle', 'Page Title')
const injectedTitle = inject<string | Ref<string>>('adminTitle', '');
const title = computed(() => unref(injectedTitle) || 'Admin');
</script>

<style scoped>
.admin-body {
  display: flex; min-height: 100vh;
  background: var(--bg-deep); color: var(--text-primary); font-family: var(--font-body);
}

.admin-sidebar {
  width: 240px; flex-shrink: 0;
  background: var(--bg-elevated); border-right: 1px solid var(--border-glass);
  padding: 24px 16px; display: flex; flex-direction: column; gap: 32px;
}

.admin-logo { font-family: var(--font-display); font-size: 1.25rem; font-weight: 800; letter-spacing: -0.04em; padding: 0 8px; }
.logo-text { color: var(--text-primary); }
.logo-accent { color: var(--accent); }

.admin-nav { display: flex; flex-direction: column; gap: 4px; }
.admin-nav-link {
  display: flex; align-items: center; gap: 10px; padding: 10px 12px;
  font-size: 0.9rem; font-weight: 500; color: var(--text-muted); border-radius: 8px;
  transition: background 0.2s, color 0.2s;
}
.admin-nav-link:hover { background: rgba(255, 255, 255, 0.04); color: var(--text-primary); }
.admin-nav-link.router-link-active { background: rgba(0, 212, 170, 0.08); color: var(--accent); }

.admin-main { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.admin-header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px 32px; border-bottom: 1px solid var(--border-glass);
}
.admin-page-title { font-size: 1.25rem; font-weight: 600; }
.admin-content { flex: 1; padding: 32px; overflow-y: auto; }
</style>
