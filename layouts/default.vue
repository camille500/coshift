<template>
  <div>
    <DevBanner @dismissed="bannerDismissed = true" />
    <div class="site" style="position: relative; z-index: 2;">
      <Header :banner-visible="bannerVisible" />
      <main>
        <slot />
      </main>
      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
const { locale, t } = useI18n();

const bannerDismissed = ref(false);
const bannerVisible = computed(() => !bannerDismissed.value);

const siteURL = 'https://coshift.nl';

const props = defineProps<{
  title?: string;
  description?: string;
}>();

const title = computed(() => props.title || 'CoShift');
const description = computed(() => props.description || '');

// canonical and hreflang are handled automatically by @nuxtjs/seo + @nuxtjs/i18n

const nlKeywords = 'AI automatisering, AI consultancy Nederland, procesautomatisering AI, AI implementatie bedrijven, AI advies, chatbot laten maken, AI voor bedrijven, AI voor MKB, private AI omgeving, ISO 42001 compliance, ISO 27001 begeleiding, EU AI Act compliance, AI workshop bedrijven, AI training medewerkers, AI strategie, MCP implementatie, RAG implementatie, AI tools op maat, AI readiness assessment';
const enKeywords = 'AI automation, AI consultancy Netherlands, AI process automation, AI implementation business, AI consulting, custom chatbot, AI for business, AI for SME, private AI environment, ISO 42001 compliance, ISO 27001 guidance, EU AI Act compliance, AI workshop, AI training employees, AI strategy, MCP implementation, RAG implementation, custom AI tools, AI readiness assessment';

const keywords = computed(() => locale.value === 'nl' ? nlKeywords : enKeywords);

const faqItems = computed(() =>
  Array.from({ length: 13 }, (_, i) => ({
    '@type': 'Question',
    name: t(`faq.${i + 1}.q`),
    acceptedAnswer: { '@type': 'Answer', text: t(`faq.${i + 1}.a`) },
  }))
);

const structuredDataJson = computed(() => JSON.stringify([
  { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: faqItems.value },
  {
    '@context': 'https://schema.org', '@type': 'ProfessionalService', name: 'CoShift',
    description: locale.value === 'nl'
      ? 'AI-automatisering, custom AI-tools, private AI-omgevingen en ISO-compliance voor bedrijven in Nederland'
      : 'AI automation, custom AI tools, private AI environments and ISO compliance for businesses in the Netherlands',
    url: siteURL, address: { '@type': 'PostalAddress', addressCountry: 'NL' },
    areaServed: { '@type': 'Country', name: 'Netherlands' },
    serviceType: ['AI Process Automation', 'Custom AI Tools', 'Private AI Environments', 'AI Training & Workshops', 'ISO 27001 Consultancy', 'ISO 42001 Consultancy', 'AI Optimization', 'MCP Implementation', 'RAG Implementation', 'EU AI Act Compliance', 'AI Strategy & Roadmap', 'AI Readiness Assessment', 'Voice AI & Conversational Agents'],
    knowsLanguage: ['nl', 'en'],
  },
  { '@context': 'https://schema.org', '@type': 'Organization', name: 'CoShift', url: siteURL, logo: `${siteURL}/favicon.svg`, sameAs: [], contactPoint: { '@type': 'ContactPoint', contactType: 'customer service', availableLanguage: ['Dutch', 'English'] } },
  { '@context': 'https://schema.org', '@type': 'WebSite', name: 'CoShift', url: siteURL, inLanguage: [locale.value === 'nl' ? 'nl-NL' : 'en-US'], potentialAction: { '@type': 'SearchAction', target: `${siteURL}/blog?q={search_term_string}`, 'query-input': 'required name=search_term_string' } },
]));

useHead(computed(() => ({
  title: title.value,
  meta: [
    { name: 'description', content: description.value },
    { name: 'keywords', content: keywords.value },
    { name: 'author', content: 'Camille — CoShift' },
    { name: 'geo.region', content: 'NL' },
    { name: 'geo.placename', content: 'Nederland' },
  ],
  script: [{ type: 'application/ld+json', innerHTML: structuredDataJson.value }],
})));
</script>
