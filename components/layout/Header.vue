<template>
  <header :class="['header', { scrolled: isScrolled }]" :style="{ top: bannerVisible ? '32px' : '0' }" id="site-header">
    <div class="header-inner">
      <NuxtLink :to="localePath('/')" class="logo">
        <span class="logo-text">Co</span><span class="logo-accent">Shift</span>
      </NuxtLink>

      <nav class="nav" id="main-nav" :class="{ 'nav-open': menuOpen }">
        <NuxtLink :to="localePath('/#services')" class="nav-link" @click="closeMenu">{{ t('nav.services') }}</NuxtLink>
        <NuxtLink :to="localePath('/#impact')" class="nav-link" @click="closeMenu">{{ t('nav.impact') }}</NuxtLink>
        <NuxtLink :to="localePath('/#use-cases')" class="nav-link" @click="closeMenu">{{ t('nav.usecases') }}</NuxtLink>
        <NuxtLink :to="localePath('/#process')" class="nav-link" @click="closeMenu">{{ t('nav.process') }}</NuxtLink>
        <NuxtLink :to="localePath('/blog')" class="nav-link" @click="closeMenu">{{ t('nav.blog') }}</NuxtLink>
        <NuxtLink :to="localePath('/#contact')" class="nav-link" @click="closeMenu">{{ t('nav.contact') }}</NuxtLink>
      </nav>

      <div class="header-actions">
        <NuxtLink :to="altPath" class="lang-switch" :aria-label="`Switch to ${locale === 'nl' ? 'English' : 'Dutch'}`">
          <span :class="{ 'lang-active': locale === 'nl' }">NL</span>
          <span class="lang-sep">/</span>
          <span :class="{ 'lang-active': locale === 'en' }">EN</span>
        </NuxtLink>

        <button class="theme-toggle" @click="toggleTheme" aria-label="Toggle theme">
          <svg class="theme-icon-sun" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
          <svg class="theme-icon-moon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        </button>

        <ClientOnly>
          <SignedOut>
            <NuxtLink to="/sign-in" class="header-signin">
              {{ locale === 'nl' ? 'Inloggen' : 'Sign in' }}
            </NuxtLink>
          </SignedOut>
          <SignedIn>
            <NuxtLink v-if="showAdminLink" to="/admin" class="header-admin" aria-label="Admin panel">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>
            </NuxtLink>
            <div class="clerk-user-btn">
              <UserButton :appearance="{ elements: { userButtonAvatarBox: 'cl-avatar-override' } }" />
            </div>
          </SignedIn>
          <template #fallback>
            <NuxtLink to="/sign-in" class="header-signin">
              {{ locale === 'nl' ? 'Inloggen' : 'Sign in' }}
            </NuxtLink>
          </template>
        </ClientOnly>

        <NuxtLink :to="localePath('/#contact')" class="header-cta">
          <span>{{ t('nav.cta') }}</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </NuxtLink>

        <button class="hamburger" :class="{ 'is-open': menuOpen }" @click="toggleMenu" aria-label="Menu" :aria-expanded="menuOpen.toString()">
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
import { SignedIn, SignedOut, UserButton } from '@clerk/nuxt/components';

const props = withDefaults(defineProps<{ bannerVisible?: boolean }>(), { bannerVisible: false });

const { t, locale } = useI18n();
const localePath = useLocalePath();
const { userId } = useAuth();
const isScrolled = ref(false);
const menuOpen = ref(false);
const showAdminLink = ref(false);

const altPath = computed(() => locale.value === 'nl' ? '/en/' : '/');

onMounted(async () => {
  const onScroll = () => { isScrolled.value = window.scrollY > 40; };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Active section tracking
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');
  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navLinks.forEach(link => {
            const href = link.getAttribute('href') || '';
            link.classList.toggle('nav-active', href.includes('#' + id));
          });
        }
      });
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });
    sections.forEach(s => observer.observe(s));
  }
});

// Check admin status on server side via $fetch
watch(() => userId.value, async (uid) => {
  if (uid) {
    try {
      const result = await $fetch<{ isAdmin: boolean }>('/api/auth/me');
      showAdminLink.value = result.isAdmin;
    } catch {
      showAdminLink.value = false;
    }
  } else {
    showAdminLink.value = false;
  }
}, { immediate: true });

function toggleTheme() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  if (isDark) {
    document.documentElement.removeAttribute('data-theme');
    localStorage.setItem('theme', 'light');
  } else {
    document.documentElement.setAttribute('data-theme', 'dark');
    localStorage.setItem('theme', 'dark');
  }
}

function toggleMenu() {
  menuOpen.value = !menuOpen.value;
}

function closeMenu() {
  menuOpen.value = false;
}
</script>

<style scoped>
.header {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  padding: 16px 24px;
  transition: background 0.4s ease, border-color 0.4s ease, padding 0.3s ease;
  border-bottom: 1px solid transparent;
}

.header.scrolled {
  background: var(--header-bg-scrolled);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom-color: var(--border-glass);
  padding: 10px 24px;
}

.header-inner {
  max-width: 1280px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
}

.logo { font-family: var(--font-display); font-size: 1.35rem; font-weight: 800; letter-spacing: -0.04em; }
.logo-text { color: var(--text-primary); }
.logo-accent { color: var(--accent); }

.nav { display: flex; gap: 32px; }

.nav-link {
  font-size: 0.875rem; font-weight: 500; color: var(--text-muted);
  transition: color 0.25s ease; position: relative;
}
.nav-link::after {
  content: ''; position: absolute; bottom: -4px; left: 0;
  width: 0; height: 1px; background: var(--accent); transition: width 0.3s ease;
}
.nav-link:hover, .nav-link.nav-active { color: var(--text-primary); }
.nav-link:hover::after, .nav-link.nav-active::after { width: 100%; }

.header-actions { display: flex; align-items: center; gap: 16px; }

.lang-switch {
  font-size: 0.8rem; font-weight: 500; color: var(--text-muted);
  display: flex; align-items: center; gap: 4px; transition: color 0.2s ease;
}
.lang-sep { opacity: 0.3; }
.lang-active { color: var(--accent); font-weight: 600; }

.theme-toggle {
  background: none; border: 1px solid var(--border-glass); border-radius: 8px;
  padding: 6px; cursor: pointer; color: var(--text-muted);
  display: flex; align-items: center; justify-content: center;
  transition: color 0.2s ease, border-color 0.2s ease;
}
.theme-toggle:hover { color: var(--accent); border-color: var(--accent); }

.theme-icon-sun { display: none; }
.theme-icon-moon { display: block; }
:global([data-theme="dark"] .theme-icon-sun) { display: block; }
:global([data-theme="dark"] .theme-icon-moon) { display: none; }

.header-cta {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 8px 18px; font-size: 0.85rem; font-weight: 600;
  color: var(--bg-deep); background: var(--accent); border-radius: 6px;
  transition: transform 0.25s ease, box-shadow 0.35s ease;
}
.header-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0, 212, 170, 0.35); }
.header-cta svg { transition: transform 0.2s ease; }
.header-cta:hover svg { transform: translateX(3px); }

.header-signin { font-size: 0.85rem; font-weight: 500; color: var(--text-muted); transition: color 0.2s ease; }
.header-signin:hover { color: var(--accent); }

.header-admin { display: flex; align-items: center; justify-content: center; color: var(--text-muted); transition: color 0.2s ease; }
.header-admin:hover { color: var(--accent); }

.clerk-user-btn { display: flex; align-items: center; position: relative; }
.clerk-user-btn :deep(.cl-userButtonTrigger) { width: 32px !important; height: 32px !important; border-radius: 50% !important; overflow: hidden !important; }
.clerk-user-btn :deep(.cl-userButtonAvatarBox) { width: 32px !important; height: 32px !important; }
.clerk-user-btn :deep(.cl-avatar-override) { width: 32px !important; height: 32px !important; }
.clerk-user-btn :deep(img) { width: 32px !important; height: 32px !important; object-fit: cover !important; }

.hamburger {
  display: none; flex-direction: column; gap: 5px;
  background: none; border: none; cursor: pointer; padding: 4px; z-index: 101;
}
.hamburger-line {
  display: block; width: 22px; height: 2px;
  background: var(--text-primary); border-radius: 1px;
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.hamburger.is-open .hamburger-line:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.is-open .hamburger-line:nth-child(2) { opacity: 0; }
.hamburger.is-open .hamburger-line:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

@media (max-width: 768px) {
  .nav {
    display: none; position: fixed; inset: 0;
    background: var(--mobile-nav-bg); backdrop-filter: blur(24px);
    flex-direction: column; align-items: center; justify-content: center;
    gap: 40px; z-index: 100;
  }
  .nav.nav-open { display: flex; }
  .nav-link { font-size: 1.25rem; }
  .hamburger { display: flex; }
  .header-cta { display: none; }
}
</style>
