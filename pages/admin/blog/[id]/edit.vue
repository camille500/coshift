<template>
  <div>
    <div v-if="pending" class="loading">Laden...</div>
    <div v-else-if="error" class="error">Kon post niet laden.</div>
    <BlogEditor v-else :post="post" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' });

provide('adminTitle', 'Post bewerken');

const route = useRoute();
const id = route.params.id as string;

const { data: post, pending, error } = await useFetch<any>(`/api/blog/${id}`);
</script>

<style scoped>
.loading, .error {
  color: var(--text-muted);
  padding: 40px 0;
  font-size: 0.9rem;
}
.error { color: #ff6b6b; }
</style>
