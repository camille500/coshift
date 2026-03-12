<template>
  <div>
    <BlogEditor />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin' });

provide('adminTitle', 'Nieuw artikel');
</script>
