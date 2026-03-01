# CoShift - Agent Instructions

## Project Identity
- **Name**: CoShift
- **Tagline**: Samen verschuiven naar wat werkt
- **Type**: AI-native technology consulting website/platform
- **Owner**: Camille
- **Stack**: Astro (site), AWS CDK (infrastructure), TypeScript

## Architectural Pillars
1. **Performance first**: Zero JS by default. Islands for interactivity only.
2. **SEO native**: Dutch primary, English secondary. Structured data on every page.
3. **Design consistency**: Dark premium aesthetic. Glass morphism. Aurora effects. Plus Jakarta Sans.
4. **Accessibility**: Semantic HTML, ARIA labels, keyboard navigation.
5. **Progressive enhancement**: Site works without JS. Interactive features enhance, never gate.
6. **Infrastructure as Code**: All AWS resources managed via CDK. No manual console changes.

## Color System
- Accent: #00d4aa (cyan-green)
- Violet: #7c6bda
- Gold: #c9a227
- Backgrounds: #030306 (deep), #0a0a0f (elevated)
- Text: #f4f4f6 (primary), #b4b4c0 (secondary), #787890 (muted)

## Tone of Voice
- Dutch: informal (je/jij), partner-like, practical, confident but not arrogant
- English: professional but warm, action-oriented
- Never salesy. Show, don't tell. Lead with value.
- Core message: "AI maakt je niet overbodig — het maakt je onmisbaar"

## Key Principles
- **Jouw data blijft jouw data** - Data sovereignty is a core promise
- **Samen** - Everything is collaborative, not vendor-client
- **AI as empowerment** - AI augments humans, doesn't replace them

## File Conventions
- Components: PascalCase (Hero.astro, GlassCard.astro)
- Styles: kebab-case CSS classes (.glass-card, .section-label)
- Translations: dot-notation keys (hero.title.1, service.3.desc)
- Infrastructure: kebab-case stack names (static-site-stack)
