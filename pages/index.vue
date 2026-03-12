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

const { t } = useI18n();

useSeoMeta({
  title: 'CoShift | AI voor het MKB — Automatisering, custom tools & ISO-compliance',
  description: 'AI-automatisering speciaal voor het MKB. Ontdek hoe AI jouw bedrijfsprocessen slimmer maakt — van factuurverwerking tot klantenservice. Resultaat in weken. Gratis kennismaking.',
});
</script>
