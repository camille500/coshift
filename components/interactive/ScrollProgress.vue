<template>
  <div class="scroll-progress" ref="barRef" aria-hidden="true"></div>
</template>

<script setup lang="ts">
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const barRef = ref<HTMLDivElement | null>(null);
const router = useRouter();

function initScrollProgress() {
  const bar = barRef.value;
  if (!bar) return;

  ScrollTrigger.getAll().filter(t => t.vars.id === 'scroll-progress').forEach(t => t.kill());

  gsap.set(bar, { scaleX: 0 });
  gsap.to(bar, {
    scaleX: 1,
    ease: 'none',
    scrollTrigger: {
      id: 'scroll-progress',
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.3,
    },
  });
}

onMounted(() => {
  nextTick(initScrollProgress);
  router.afterEach(() => nextTick(initScrollProgress));
});
</script>

<style scoped>
.scroll-progress {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 3px;
  background: linear-gradient(90deg, var(--accent), var(--accent-violet), var(--accent-gold));
  transform-origin: left;
  transform: scaleX(0);
  z-index: 999;
  pointer-events: none;
}
</style>
