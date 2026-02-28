<template>
  <div class="site" @mousemove="onMouse">
    <div class="aurora" aria-hidden="true" />
    <div class="grid-overlay" aria-hidden="true" />
    <div class="glow-spot glow-1" aria-hidden="true" />
    <div class="glow-spot glow-2" aria-hidden="true" />
    <div class="glow-spot glow-3" aria-hidden="true" />
    <div
      class="cursor-glow"
      aria-hidden="true"
      :style="{ left: mouse.x + 'px', top: mouse.y + 'px', opacity: mouse.active ? 1 : 0 }"
    />
    <TheHeader />
    <main class="main">
      <slot />
    </main>
    <TheFooter />
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

const mouse = reactive({ x: 0, y: 0, active: false })

function onMouse (e: MouseEvent) {
  mouse.x = e.clientX
  mouse.y = e.clientY
  mouse.active = true
}
</script>

<style scoped>
.site {
  position: relative;
  z-index: 1;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main {
  flex: 1;
}

.cursor-glow {
  position: fixed;
  width: 600px;
  height: 600px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  transform: translate(-50%, -50%);
  background: radial-gradient(circle, rgba(0, 212, 170, 0.04) 0%, rgba(124, 107, 218, 0.02) 30%, transparent 70%);
  transition: opacity 0.6s ease;
  will-change: left, top;
}

.glow-spot {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
  filter: blur(120px);
}

.glow-1 {
  width: 700px;
  height: 700px;
  background: rgba(0, 212, 170, 0.035);
  top: -200px;
  left: -100px;
  animation: breathe 12s ease-in-out infinite;
}

.glow-2 {
  width: 600px;
  height: 600px;
  background: rgba(124, 107, 218, 0.03);
  bottom: -200px;
  right: -100px;
  animation: breathe 15s ease-in-out infinite;
  animation-delay: -5s;
}

.glow-3 {
  width: 400px;
  height: 400px;
  background: rgba(201, 162, 39, 0.02);
  top: 40%;
  left: 50%;
  transform: translateX(-50%);
  animation: breathe 18s ease-in-out infinite;
  animation-delay: -8s;
}

@keyframes breathe {
  0%, 100% { transform: scale(1); opacity: 0.6; }
  50% { transform: scale(1.12); opacity: 1; }
}
</style>
