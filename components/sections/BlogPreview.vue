<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

const { data: latestPosts } = useLazyFetch('/api/blog-public')
</script>

<template>
  <section v-if="latestPosts && latestPosts.length > 0" class="section section-blog-preview">
    <p class="section-label reveal">{{ t('blog.label') }}</p>
    <h2 class="section-title reveal reveal-delay-1">{{ t('blog.title.1') }} <span class="gradient-text">{{ t('blog.title.2') }}</span>.</h2>
    <p class="section-desc reveal reveal-delay-2">{{ t('blog.desc') }}</p>
    <div class="blog-preview-grid">
      <div
        v-for="(post, i) in latestPosts"
        :key="post.id"
        :class="`reveal reveal-delay-${i + 1}`"
      >
        <BlogCard
          :title="post.title"
          :description="post.description"
          :date="new Date(post.publishedAt ?? new Date())"
          :tags="post.tags"
          :slug="post.slug"
        />
      </div>
    </div>
    <div class="blog-preview-cta reveal">
      <NuxtLink :to="localePath('/blog')" class="btn-ghost-sm">
        {{ t('blog.allposts') }}
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.section-blog-preview { padding-bottom: 40px; }
.blog-preview-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  margin-bottom: 32px;
}
.blog-preview-cta {
  text-align: center;
}
.btn-ghost-sm {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  font-size: 0.88rem;
  font-weight: 500;
  color: var(--text-primary);
  border: 1px solid var(--border-glass);
  border-radius: 8px;
  transition: border-color 0.3s ease, color 0.3s ease, gap 0.2s ease;
}
.btn-ghost-sm:hover {
  border-color: var(--card-border);
  color: var(--accent);
  gap: 12px;
}

@media (max-width: 900px) {
  .blog-preview-grid {
    grid-template-columns: 1fr;
    max-width: 520px;
    margin: 0 auto 32px;
  }
}
</style>
