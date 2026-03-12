<script setup lang="ts">
const canvasRef = ref<HTMLCanvasElement | null>(null)

interface Particle {
  x: number; y: number
  vx: number; vy: number
  r: number; color: string
}

let animFrame = 0
let particles: Particle[] = []
let mouse = { x: -1000, y: -1000 }
let observer: IntersectionObserver | null = null
let cleanupFns: (() => void)[] = []
let removeAfterEach: (() => void) | null = null

function initParticles(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  const isMobile = window.innerWidth < 900
  const PARTICLE_COUNT = isMobile ? 18 : 35
  const CONNECTION_DIST = isMobile ? 120 : 160
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark'
  const COLORS = ['0, 212, 170', '124, 107, 218', '201, 162, 39']
  const ALPHA_MULT = isDark ? 1 : 0.5

  function resize() {
    const hero = canvas.parentElement
    if (!hero) return
    canvas.width = hero.offsetWidth
    canvas.height = hero.offsetHeight
  }

  function init() {
    resize()
    particles = []
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 2 + 1,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      })
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x
        const dy = particles[i].y - particles[j].y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < CONNECTION_DIST) {
          const opacity = (1 - dist / CONNECTION_DIST) * 0.15 * ALPHA_MULT
          ctx.strokeStyle = `rgba(${particles[i].color}, ${opacity})`
          ctx.lineWidth = 0.5
          ctx.beginPath()
          ctx.moveTo(particles[i].x, particles[i].y)
          ctx.lineTo(particles[j].x, particles[j].y)
          ctx.stroke()
        }
      }
    }

    // Draw particles
    for (const p of particles) {
      // Mouse repulsion
      const mx = p.x - mouse.x
      const my = p.y - mouse.y
      const mDist = Math.sqrt(mx * mx + my * my)
      if (mDist < 100) {
        const force = (100 - mDist) / 100 * 0.5
        p.vx += (mx / mDist) * force
        p.vy += (my / mDist) * force
      }

      // Damping
      p.vx *= 0.99
      p.vy *= 0.99

      // Move
      p.x += p.vx
      p.y += p.vy

      // Wrap around
      if (p.x < -10) p.x = canvas.width + 10
      if (p.x > canvas.width + 10) p.x = -10
      if (p.y < -10) p.y = canvas.height + 10
      if (p.y > canvas.height + 10) p.y = -10

      // Draw
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${p.color}, ${0.4 * ALPHA_MULT})`
      ctx.fill()

      // Glow
      ctx.beginPath()
      ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(${p.color}, ${0.06 * ALPHA_MULT})`
      ctx.fill()
    }

    animFrame = requestAnimationFrame(draw)
  }

  // Track mouse on hero section
  const hero = canvas.parentElement
  if (hero) {
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onMouseLeave = () => {
      mouse.x = -1000
      mouse.y = -1000
    }
    hero.addEventListener('mousemove', onMouseMove)
    hero.addEventListener('mouseleave', onMouseLeave)
    cleanupFns.push(() => {
      hero.removeEventListener('mousemove', onMouseMove)
      hero.removeEventListener('mouseleave', onMouseLeave)
    })
  }

  // Pause when not visible
  observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      if (!animFrame) animFrame = requestAnimationFrame(draw)
    } else {
      cancelAnimationFrame(animFrame)
      animFrame = 0
    }
  }, { threshold: 0.1 })
  observer.observe(canvas)

  const onResize = () => { resize() }
  window.addEventListener('resize', onResize, { passive: true })
  cleanupFns.push(() => window.removeEventListener('resize', onResize))

  init()
  animFrame = requestAnimationFrame(draw)
}

function cleanup() {
  cancelAnimationFrame(animFrame)
  animFrame = 0
  observer?.disconnect()
  observer = null
  for (const fn of cleanupFns) fn()
  cleanupFns = []
  particles = []
  mouse = { x: -1000, y: -1000 }
}

const router = useRouter()

onMounted(() => {
  const canvas = canvasRef.value
  if (!canvas || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  try {
    initParticles(canvas)
  } catch (err) {
    console.warn('[ParticleNetwork] init failed:', err)
  }

  removeAfterEach = router.afterEach(() => {
    const canvas = canvasRef.value
    if (!canvas) return
    cleanup()
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      nextTick(() => {
        try {
          initParticles(canvas)
        } catch (err) {
          console.warn('[ParticleNetwork] reinit failed:', err)
        }
      })
    }
  })
})

onUnmounted(() => {
  removeAfterEach?.()
  cleanup()
})
</script>

<template>
  <canvas ref="canvasRef" class="particle-network" aria-hidden="true" />
</template>

<style scoped>
.particle-network {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}
</style>
