# Changelog

All notable changes to CoShift will be documented in this file.

## [0.2.0] - 2026-02-28

### Added
- **Astro View Transitions** for SPA-like page navigation between NL↔EN
- **GSAP + ScrollTrigger** animation system (replaced IntersectionObserver ScrollReveal)
  - Parallax hero (content/visual layers at different speeds)
  - Staggered card reveals for Services, Use Cases, Impact grids
  - Animated counters (85%, 3x, 100% count up on scroll)
  - Process steps sequential reveal with connecting line animation
  - Features strip stagger animation
- **Lenis smooth scroll** with GSAP ticker sync
- **Scroll progress bar** (gradient accent→violet→gold, scrub-linked)
- **Micro-interactions**: 3D tilt on cards, magnetic buttons with elastic snap-back, cursor-following glow on glass elements
- **Hero typewriter effect** — rotating phrases in terminal style (4 phrases NL+EN)
- **Particle network** canvas behind hero (35 particles, mouse repulsion, IntersectionObserver pause)
- **Manifesto cinematic word-reveal** — word-by-word animation with rotateX
- **FAQ section** — 8 Q&A's in NL+EN, native `<details>`/`<summary>` accordion, FAQ Schema JSON-LD for SEO
- **React integration** via `@astrojs/react` island architecture
- **AI Chat Widget** (React island with `client:idle`)
  - Demo mode with smart keyword matching (cost, duration, AI models, ISO, privacy, small companies)
  - Bilingual translations (NL/EN)
  - Message bubbles, typing indicator, quick suggestion chips
  - CTA link to contact section after responses
  - Rate limiting (10 messages per session)
  - Glass morphism styling matching site design
  - Tooltip after 8s idle
- **Active nav section tracking** via IntersectionObserver on scrolling
- 18 new i18n keys for FAQ content (NL+EN)
- 4 new i18n keys for typewriter phrases (NL+EN)

### Changed
- Replaced `ScrollReveal.astro` (IntersectionObserver) with `GSAPAnimations.astro`
- Removed CSS `scroll-behavior: smooth` (Lenis handles scrolling)
- Simplified CSS reveal classes (GSAP handles timing, removed CSS transition-based system)
- All scripts migrated to `astro:page-load` event for View Transitions compatibility
- Impact counters now start at 0 and animate up (was static values)

### Fixed
- GSAP ticker callback leak on View Transitions navigation (stored function reference for cleanup)
- ScrollProgress bar not resetting on page transition (explicit `gsap.set(bar, { scaleX: 0 })`)
- ScrollTrigger position calculation race with Lenis (custom `lenis:ready` event for re-refresh)

### Performance
- Total added client JS: ~80KB gzipped (GSAP 45KB, Lenis 5KB, React 59KB, Chat 5KB)
- All interactive JS deferred via `client:idle` / async modules
- ParticleNetwork pauses when off-screen via IntersectionObserver
- `prefers-reduced-motion` respected — all animations disabled

## [0.1.0] - 2026-02-28

### Added
- Initial Astro site with all sections (Hero, Services, Impact, Manifesto, Use Cases, Features, Process, Contact)
- Bilingual support (NL/EN) via file-based routing
- Dark premium design with glass morphism, aurora effects, and sparkle animations
- WhatsApp floating action button for low-barrier contact
- Quick Scan widget (pre-fill contact form based on challenge type)
- Mobile hamburger menu (fixing missing mobile nav from original design)
- AWS CDK infrastructure (S3 + CloudFront + Route53 + ACM)
- Self-hosted Plus Jakarta Sans fonts
- SEO setup: structured data, sitemap, robots.txt, hreflang
- 404 page with on-brand design
- Scroll reveal animations via IntersectionObserver
- Mouse-following cursor glow effect

### Changed
- Rebranded from "Nova Delta" to "CoShift"
- Tone shifted from formal "u" to informal "je/jij"
- Updated positioning from team-based to personal partnership (Camille)
- Impact metrics updated to reflect data sovereignty messaging

### Migration
- Migrated from Nuxt 3 to Astro for better SEO and performance
- Split monolithic index.vue into 9 individual section components
- Converted reactive i18n composable to build-time translations
- Replaced Google Fonts CDN with self-hosted woff2 files
