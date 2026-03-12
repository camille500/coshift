<template>
  <div class="cursor-glow" ref="glowRef" aria-hidden="true"></div>
</template>

<script setup lang="ts">
const glowRef = ref<HTMLDivElement | null>(null);

onMounted(() => {
  const glow = glowRef.value;
  if (!glow || !window.matchMedia('(pointer: fine)').matches) return;

  document.addEventListener('mousemove', (e) => {
    glow.style.left = e.clientX + 'px';
    glow.style.top = e.clientY + 'px';
    const opacity = getComputedStyle(document.documentElement).getPropertyValue('--cursor-glow-opacity').trim() || '1';
    glow.style.opacity = opacity;
  });
  document.addEventListener('mouseleave', () => {
    glow.style.opacity = '0';
  });
});
</script>

<style scoped>
.cursor-glow {
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(0, 212, 170, 0.04), transparent 70%);
  pointer-events: none;
  z-index: 1;
  transform: translate(-50%, -50%);
  opacity: 0;
  transition: opacity 0.4s ease;
}
</style>
