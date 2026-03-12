<template></template>

<script setup lang="ts">
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let tickerFn: ((time: number) => void) | null = null;
let removeAfterEach: (() => void) | null = null;
let scrollSpyObserver: IntersectionObserver | null = null;
let hashDebounceTimer: ReturnType<typeof setTimeout> | null = null;
const router = useRouter();

function initLenis() {
  console.log('[SmoothScroll] initLenis() called');
  try {
    if (tickerFn) { gsap.ticker.remove(tickerFn); tickerFn = null; }
    if (lenis) { lenis.destroy(); lenis = null; }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    });

    lenis.on('scroll', ScrollTrigger.update);
    tickerFn = (time: number) => { lenis?.raf(time * 1000); };
    gsap.ticker.add(tickerFn);
    gsap.ticker.lagSmoothing(0);

    (window as any).__lenis = lenis;

    document.dispatchEvent(new CustomEvent('lenis:ready'));
    console.log('[SmoothScroll] initLenis() completed successfully');
  } catch (err) {
    console.warn('[SmoothScroll] initLenis() failed:', err);
  }
}

function scrollToHash(hash: string) {
  if (!hash || !lenis) return;
  const target = document.querySelector(hash);
  if (!target) return;
  lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.4 });
}

function handleHashClick(e: MouseEvent) {
  const link = (e.target as HTMLElement).closest('a[href*="#"]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (!href) return;

  const hash = href.includes('#') ? '#' + href.split('#')[1] : null;
  if (!hash || hash === '#') return;

  const target = document.querySelector(hash);
  if (!target || !lenis) return;

  e.preventDefault();
  e.stopPropagation();
  history.pushState(null, '', hash);
  lenis.scrollTo(target as HTMLElement, { offset: -80, duration: 1.4 });
}

onMounted(() => {
  initLenis();
  // Use capture phase to intercept before NuxtLink's router navigation
  document.addEventListener('click', handleHashClick, true);

  removeAfterEach = router.afterEach((to, from) => {
    // Only reinit Lenis on actual page changes, not hash-only changes
    if (to.path !== from.path) {
      nextTick(initLenis);
    }
  });

  // Handle initial hash on page load
  if (window.location.hash) {
    nextTick(() => scrollToHash(window.location.hash));
  }

  // Scroll-spy: update URL hash as user scrolls past sections
  nextTick(() => {
    const sections = document.querySelectorAll('section[id]');
    if (!sections.length) return;

    const visibleSections = new Set<string>();

    scrollSpyObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          visibleSections.add(entry.target.id);
        } else {
          visibleSections.delete(entry.target.id);
        }
      }

      if (hashDebounceTimer) clearTimeout(hashDebounceTimer);
      hashDebounceTimer = setTimeout(() => {
        if (visibleSections.size === 0) {
          // No sections visible — user is at the top, clear hash
          if (window.location.hash) {
            history.replaceState(null, '', window.location.pathname);
          }
        } else {
          // Use the first visible section in DOM order
          for (const s of sections) {
            if (visibleSections.has(s.id)) {
              const newHash = '#' + s.id;
              if (window.location.hash !== newHash) {
                history.replaceState(null, '', newHash);
              }
              break;
            }
          }
        }
      }, 300);
    }, { threshold: 0.3, rootMargin: '-80px 0px -50% 0px' });

    sections.forEach(s => scrollSpyObserver!.observe(s));
  });
});

onUnmounted(() => {
  removeAfterEach?.();
  document.removeEventListener('click', handleHashClick, true);
  if (hashDebounceTimer) clearTimeout(hashDebounceTimer);
  if (scrollSpyObserver) { scrollSpyObserver.disconnect(); scrollSpyObserver = null; }
  if (tickerFn) {
    gsap.ticker.remove(tickerFn);
    tickerFn = null;
  }
  if (lenis) {
    lenis.destroy();
    lenis = null;
    (window as any).__lenis = null;
  }
});
</script>
