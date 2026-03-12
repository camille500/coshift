<template>
  <div>
    <BlogPostList />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' });

provide('adminTitle', 'Blog Posts');
</script>
