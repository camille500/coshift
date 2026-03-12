<template>
  <div>
    <div class="site" style="position: relative; z-index: 2;">
      <Header />

      <article class="blog-article">
        <div class="blog-article-inner">
          <NuxtLink :to="localePath('/blog')" class="blog-back reveal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
            {{ t('blog.back') }}
          </NuxtLink>

          <header class="blog-header reveal">
            <div class="blog-meta">
              <time v-if="date" :datetime="date.toISOString()">{{ formattedDate }}</time>
              <span class="blog-meta-sep">·</span>
              <span>{{ author }}</span>
            </div>
            <h1 class="blog-title">{{ title }}</h1>
            <p class="blog-description">{{ description }}</p>
            <div v-if="tags?.length" class="blog-tags">
              <span v-for="tag in tags" :key="tag" class="blog-tag">{{ tag }}</span>
            </div>
          </header>

          <div class="blog-content reveal reveal-delay-1">
            <slot />
          </div>
        </div>
      </article>

      <Footer />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t, locale } = useI18n();
const localePath = useLocalePath();
const route = useRoute();
const siteURL = 'https://coshift.nl';

// Pages inject post data via provide('blogPost', { title, description, date, tags, author })
const blogPost = inject<{
  title?: string;
  description?: string;
  date?: Date;
  tags?: string[];
  author?: string;
}>('blogPost', {});

const pageTitle = computed(() => blogPost.title ? `${blogPost.title} | CoShift` : 'CoShift Blog');
const title = computed(() => blogPost.title || '');
const description = computed(() => blogPost.description || '');
const author = computed(() => blogPost.author || 'Camille');
const tags = computed(() => blogPost.tags || []);
const date = computed(() => blogPost.date);

const formattedDate = computed(() =>
  date.value?.toLocaleDateString(locale.value === 'nl' ? 'nl-NL' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  })
);

const articleSchemaJson = computed(() => JSON.stringify({
  '@context': 'https://schema.org', '@type': 'Article',
  headline: title.value, description: description.value,
  datePublished: date.value?.toISOString(),
  author: { '@type': 'Person', name: author.value },
  publisher: { '@type': 'Organization', name: 'CoShift', url: siteURL },
  mainEntityOfPage: `${siteURL}${route.path}`,
  keywords: tags.value.join(', '),
}));

const breadcrumbSchemaJson = computed(() => JSON.stringify({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: locale.value === 'nl' ? siteURL : `${siteURL}/en/` },
    { '@type': 'ListItem', position: 2, name: t('blog.label'), item: `${siteURL}${localePath('/blog')}` },
    { '@type': 'ListItem', position: 3, name: title.value },
  ],
}));

useHead(computed(() => ({
  title: pageTitle.value,
  meta: [
    { name: 'description', content: description.value },
    { property: 'og:type', content: 'article' },
    { property: 'article:published_time', content: date.value?.toISOString() },
    { property: 'article:author', content: author.value },
    ...(tags.value?.map(tag => ({ property: 'article:tag', content: tag })) ?? []),
  ],
  script: [
    { type: 'application/ld+json', innerHTML: articleSchemaJson.value },
    { type: 'application/ld+json', innerHTML: breadcrumbSchemaJson.value },
  ],
})));
</script>

<style scoped>
.blog-article { padding: 120px 24px 80px; }
.blog-article-inner { max-width: 680px; margin: 0 auto; }

.blog-back {
  display: inline-flex; align-items: center; gap: 8px;
  font-size: 0.85rem; font-weight: 500; color: var(--text-muted);
  margin-bottom: 40px; transition: color 0.2s ease, gap 0.2s ease;
}
.blog-back:hover { color: var(--accent); gap: 12px; }

.blog-header { margin-bottom: 48px; padding-bottom: 32px; border-bottom: 1px solid var(--border-glass); }

.blog-meta {
  font-size: 0.8rem; color: var(--text-muted); margin-bottom: 16px;
  display: flex; align-items: center; gap: 8px; font-weight: 500;
}
.blog-meta-sep { opacity: 0.4; }

.blog-title { font-size: clamp(1.75rem, 4vw, 2.5rem); font-weight: 700; line-height: 1.2; letter-spacing: -0.03em; margin-bottom: 16px; }
.blog-description { font-size: 1.1rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 20px; }
.blog-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.blog-tag {
  font-size: 0.7rem; padding: 3px 8px; border-radius: 4px;
  background: rgba(0, 212, 170, 0.08); color: var(--accent);
  border: 1px solid rgba(0, 212, 170, 0.12); font-weight: 600; letter-spacing: 0.04em;
}

.blog-content :deep(h2) { font-size: 1.5rem; font-weight: 700; margin: 48px 0 16px; letter-spacing: -0.02em; }
.blog-content :deep(h3) { font-size: 1.2rem; font-weight: 600; margin: 32px 0 12px; }
.blog-content :deep(p) { color: var(--text-secondary); font-size: 1rem; line-height: 1.75; margin-bottom: 20px; }
.blog-content :deep(strong) { color: var(--text-primary); font-weight: 600; }
.blog-content :deep(a) { color: var(--accent); text-decoration: underline; text-underline-offset: 3px; transition: opacity 0.2s ease; }
.blog-content :deep(a:hover) { opacity: 0.8; }
.blog-content :deep(ul), .blog-content :deep(ol) { color: var(--text-secondary); margin-bottom: 20px; padding-left: 24px; }
.blog-content :deep(li) { line-height: 1.75; margin-bottom: 8px; }
.blog-content :deep(blockquote) { border-left: 3px solid var(--accent); padding-left: 20px; margin: 24px 0; color: var(--text-muted); font-style: italic; }
.blog-content :deep(code) { font-size: 0.88em; padding: 2px 6px; background: var(--code-bg); border-radius: 4px; color: var(--accent); }
.blog-content :deep(pre) { padding: 20px; background: var(--pre-bg); border: 1px solid var(--border-glass); border-radius: 8px; overflow-x: auto; margin-bottom: 20px; }
.blog-content :deep(pre code) { padding: 0; background: none; }
.blog-content :deep(hr) { border: none; border-top: 1px solid var(--border-glass); margin: 40px 0; }
.blog-content :deep(mark) { background: rgba(0, 212, 170, 0.2); color: inherit; border-radius: 2px; padding: 1px 2px; }
.blog-content :deep(img) { max-width: 100%; height: auto; border-radius: 8px; margin: 16px 0; }
.blog-content :deep(table) { width: 100%; border-collapse: collapse; margin: 24px 0; }
.blog-content :deep(th), .blog-content :deep(td) { border: 1px solid var(--border-glass); padding: 10px 14px; text-align: left; color: var(--text-secondary); }
.blog-content :deep(th) { background: rgba(255, 255, 255, 0.04); font-weight: 600; color: var(--text-primary); }
.blog-content :deep(sup) { font-size: 0.75em; vertical-align: super; }
.blog-content :deep(sub) { font-size: 0.75em; vertical-align: sub; }

/* Syntax highlighting */
.blog-content :deep(.hljs-comment), .blog-content :deep(.hljs-quote) { color: #636d83; font-style: italic; }
.blog-content :deep(.hljs-keyword), .blog-content :deep(.hljs-selector-tag) { color: #c678dd; }
.blog-content :deep(.hljs-number), .blog-content :deep(.hljs-string), .blog-content :deep(.hljs-literal), .blog-content :deep(.hljs-regexp) { color: var(--accent); }
.blog-content :deep(.hljs-title), .blog-content :deep(.hljs-section), .blog-content :deep(.hljs-name) { color: #e5c07b; }
.blog-content :deep(.hljs-built_in) { color: #e06c75; }
.blog-content :deep(.hljs-symbol), .blog-content :deep(.hljs-bullet), .blog-content :deep(.hljs-meta), .blog-content :deep(.hljs-link) { color: #61aeee; }

@media (max-width: 600px) { .blog-article { padding: 100px 20px 60px; } }
</style>
