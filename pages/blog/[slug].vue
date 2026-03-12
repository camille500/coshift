<template>
  <div v-if="post" v-html="post.contentHtml" />
</template>

<script setup lang="ts">
definePageMeta({ layout: 'blog' });

const route = useRoute();
const { locale } = useI18n();
const slug = route.params.slug as string;

const { data: post, error } = await useFetch<any>(`/api/blog-public/${slug}`, {
  query: { locale: locale.value },
});

if (error.value || !post.value) {
  throw createError({ statusCode: 404, statusMessage: 'Post not found' });
}

const p = post.value;

provide('blogPost', {
  title: p.title,
  description: p.description,
  date: new Date(p.publishedAt || p.createdAt),
  tags: p.tags,
  author: p.author,
});
</script>
