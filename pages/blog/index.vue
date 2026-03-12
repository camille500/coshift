<template>
  <section class="blog-listing">
    <div class="blog-listing-inner">
      <p class="section-label reveal">{{ t('blog.label') }}</p>
      <h1 class="section-title reveal reveal-delay-1">{{ t('blog.title.1') }} <span class="gradient-text">{{ t('blog.title.2') }}</span>.</h1>
      <p class="section-desc reveal reveal-delay-2">{{ t('blog.desc') }}</p>

      <div class="blog-grid">
        <div
          v-for="(post, i) in posts"
          :key="post.id"
          :class="`reveal reveal-delay-${Math.min(i + 1, 3)}`"
        >
          <BlogCard
            :title="post.title"
            :description="post.description"
            :date="new Date(post.publishedAt || post.createdAt)"
            :tags="post.tags"
            :slug="post.slug"
          />
        </div>
      </div>

      <p v-if="posts.length === 0" class="blog-empty">Nog geen artikelen. Binnenkort meer!</p>
    </div>
  </section>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'default' });

const { t, locale } = useI18n();

useSeoMeta({
  title: computed(() => locale.value === 'nl'
    ? 'Blog | CoShift — AI, Automatisering & Compliance'
    : 'Blog | CoShift — AI, Automation & Compliance'),
  description: computed(() => locale.value === 'nl'
    ? 'Praktische kennis over AI-integratie, procesautomatisering, MCP-implementatie en ISO-compliance. Uit de praktijk, voor de praktijk.'
    : 'Practical knowledge on AI integration, process automation, MCP implementation and ISO compliance.'),
});

const { data } = await useFetch('/api/blog-public', { query: computed(() => ({ locale: locale.value })) });
const posts = computed(() => (data.value as any[]) || []);
</script>

<style scoped>
.blog-listing { padding: 120px 24px 80px; }
.blog-listing-inner { max-width: 1280px; margin: 0 auto; }

.blog-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.blog-empty {
  text-align: center;
  color: var(--text-muted);
  font-size: 1rem;
  padding: 60px 0;
}

@media (max-width: 900px) {
  .blog-grid { grid-template-columns: 1fr; max-width: 520px; margin: 0 auto; }
  .blog-listing { padding: 100px 20px 60px; }
}
</style>
