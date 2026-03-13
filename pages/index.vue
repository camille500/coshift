<template>
  <div>
    <Hero />
    <Services />
    <GlowSeparator />
    <Impact />
    <ProcessScanner />
    <Manifesto />
    <GlowSeparator />
    <UseCases />
    <Features />
    <Process />
    <GlowSeparator />
    <BlogPreview />
    <FAQ />
    <GlowSeparator />
    <Contact />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' });

const { t, locale } = useI18n();

const seoTitle = computed(() =>
  locale.value === 'nl'
    ? 'CoShift | AI voor het MKB — Automatisering, custom tools & compliance'
    : 'CoShift | AI for SMBs — Automation, custom tools & compliance',
);

const seoDescription = computed(() =>
  locale.value === 'nl'
    ? 'AI-automatisering speciaal voor het MKB. Ontdek hoe AI jouw bedrijfsprocessen slimmer maakt — van factuurverwerking tot klantenservice. Resultaat in weken. Gratis kennismaking.'
    : 'AI automation designed for SMBs. Discover how AI makes your business processes smarter — from invoice processing to customer service. Results in weeks. Free consultation.',
);

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
});

defineOgImage({
  component: 'OgImageDefault',
  title: seoTitle,
  description: seoDescription,
});
</script>
