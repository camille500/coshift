<template></template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const router = useRouter();
const cleanupFns: Array<() => void> = [];
let removeAfterEach: (() => void) | null = null;

function addCleanup(fn: () => void) {
  cleanupFns.push(fn);
}

function cleanup() {
  while (cleanupFns.length) {
    const fn = cleanupFns.pop();
    fn?.();
  }
  ScrollTrigger.getAll().forEach(t => t.kill());
}

function isBelowFold(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  // 200px buffer — only consider truly off-screen elements
  return rect.top >= window.innerHeight + 200;
}

async function init() {
  cleanup();
  console.log('[GSAPAnimations] init() called');

  try {
  // Wait for layout to be fully computed before measuring positions
  await new Promise(r => requestAnimationFrame(r));

  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // --- REVEAL ANIMATIONS ---
  gsap.utils.toArray<HTMLElement>('.reveal').forEach((el) => {
    if (reducedMotion) {
      el.classList.add('visible');
      return;
    }
    // Only hide elements well below the fold — leave everything else visible
    if (!isBelowFold(el)) {
      return;
    }
    gsap.set(el, { opacity: 0, y: 40 });
    gsap.to(el, {
      opacity: 1,
      y: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });

  if (reducedMotion) return;

  // --- STAGGERED GRID REVEALS ---
  document.querySelectorAll('.services-grid, .cases-grid, .impact-grid').forEach(grid => {
    if (!isBelowFold(grid as HTMLElement)) return;
    const cards = grid.querySelectorAll('.service-card, .case-card, .impact-card');
    if (!cards.length) return;
    gsap.set(cards, { opacity: 0, y: 50, scale: 0.95 });
    gsap.to(cards, {
      opacity: 1, y: 0, scale: 1, duration: 0.7, ease: 'power3.out', stagger: 0.1,
      scrollTrigger: { trigger: grid, start: 'top 85%', once: true },
    });
  });

  // --- PARALLAX HERO ---
  const heroVisual = document.querySelector('.hero-visual');
  if (heroVisual) {
    gsap.to(heroVisual, {
      y: 120, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 },
    });
  }

  const heroContent = document.querySelector('.hero-content');
  if (heroContent) {
    gsap.to(heroContent, {
      y: 50, ease: 'none',
      scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: 0.5 },
    });
  }

  // --- ANIMATED COUNTERS ---
  document.querySelectorAll('[data-counter-value]').forEach(el => {
    const target = parseFloat(el.getAttribute('data-counter-value') || '0');
    const suffix = el.getAttribute('data-counter-suffix') || '';
    const prefix = el.getAttribute('data-counter-prefix') || '';
    const duration = parseFloat(el.getAttribute('data-counter-duration') || '2');
    const counter = { val: 0 };
    gsap.to(counter, {
      val: target, duration, ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 85%', once: true },
      onUpdate() {
        const display = target % 1 === 0 ? Math.round(counter.val) : counter.val.toFixed(1);
        (el as HTMLElement).textContent = prefix + display + suffix;
      },
    });
  });

  // --- PROCESS STEPS SEQUENTIAL ---
  const processGrid = document.querySelector('.process-grid');
  const processSteps = document.querySelectorAll('.process-step');
  if (processSteps.length && processGrid && isBelowFold(processGrid as HTMLElement)) {
    gsap.set(processSteps, { opacity: 0, y: 40, scale: 0.9 });
    gsap.to(processSteps, {
      opacity: 1, y: 0, scale: 1, duration: 0.6, ease: 'back.out(1.7)', stagger: 0.2,
      scrollTrigger: { trigger: '.process-grid', start: 'top 80%', once: true },
    });
    const processLine = document.querySelector('.process-line');
    if (processLine) {
      gsap.set(processLine, { scaleX: 0 });
      gsap.to(processLine, {
        scaleX: 1, duration: 1, ease: 'power2.inOut', delay: 0.3,
        scrollTrigger: { trigger: '.process-grid', start: 'top 80%', once: true },
      });
    }
  }

  // --- FEATURES STRIP STAGGER ---
  const featuresStrip = document.querySelector('.features-strip');
  const featureItems = document.querySelectorAll('.feature-item');
  if (featureItems.length && featuresStrip && isBelowFold(featuresStrip as HTMLElement)) {
    gsap.set(featureItems, { opacity: 0, y: 30 });
    gsap.to(featureItems, {
      opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.15,
      scrollTrigger: { trigger: '.features-strip', start: 'top 85%', once: true },
    });
  }

  // --- MANIFESTO WORD REVEAL ---
  document.querySelectorAll('.manifesto-word-inner').forEach((word, i) => {
    const trigger = word.closest('.manifesto-line') || word;
    if (!isBelowFold(trigger as HTMLElement)) return;
    gsap.set(word, { y: '110%', rotateX: -80 });
    gsap.to(word, {
      y: '0%', rotateX: 0, duration: 0.8, ease: 'power3.out',
      scrollTrigger: { trigger, start: 'top 85%', once: true },
      delay: (i % 8) * 0.06,
    });
  });

  // --- 3D TILT ON CARDS ---
  const tiltCards = document.querySelectorAll('.service-card, .case-card, .impact-card');
  tiltCards.forEach(card => {
    const el = card as HTMLElement;
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      gsap.to(el, {
        rotateY: x * 8,
        rotateX: -y * 8,
        transformPerspective: 800,
        duration: 0.3,
        ease: 'power2.out',
      });
    };
    const onMouseLeave = () => {
      gsap.to(el, { rotateY: 0, rotateX: 0, duration: 0.5, ease: 'power2.out' });
    };
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
    addCleanup(() => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
    });
  });

  // --- MAGNETIC BUTTONS ---
  const magneticBtns = document.querySelectorAll('.btn-hero, .btn-submit, .header-cta');
  magneticBtns.forEach(btn => {
    const el = btn as HTMLElement;
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(el, { x: x * 0.15, y: y * 0.15, duration: 0.3, ease: 'power2.out' });
    };
    const onMouseLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.4, ease: 'elastic.out(1, 0.5)' });
    };
    el.addEventListener('mousemove', onMouseMove);
    el.addEventListener('mouseleave', onMouseLeave);
    addCleanup(() => {
      el.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
    });
  });

  // --- CARD HOVER GLOW ---
  document.querySelectorAll('.glass').forEach(card => {
    const el = card as HTMLElement;
    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
      el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    };
    el.addEventListener('mousemove', onMouseMove);
    addCleanup(() => el.removeEventListener('mousemove', onMouseMove));
  });

  // --- MARQUEE PARALLAX SPEED ---
  const marquee = document.querySelector('.marquee-track');
  if (marquee) {
    gsap.to(marquee, {
      x: -100, ease: 'none',
      scrollTrigger: { trigger: '.marquee-wrap', start: 'top bottom', end: 'bottom top', scrub: 1 },
    });
  }

  ScrollTrigger.refresh();
  const onLenisReady = () => ScrollTrigger.refresh();
  document.addEventListener('lenis:ready', onLenisReady, { once: true });
  addCleanup(() => document.removeEventListener('lenis:ready', onLenisReady));
  console.log('[GSAPAnimations] init() completed successfully');
  } catch (err) {
    console.warn('[GSAPAnimations] init() failed:', err);
  }
}

onMounted(async () => {
  // Wait for next frame so all ClientOnly siblings (including Lenis) are mounted
  await nextTick();
  await new Promise(r => requestAnimationFrame(r));
  init();

  removeAfterEach = router.afterEach(() => nextTick(init));
});

onUnmounted(() => {
  removeAfterEach?.();
  cleanup();
});
</script>
