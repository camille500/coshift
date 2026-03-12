<template>
  <div>
    <!-- Persistent background & interactive elements (client-only to avoid hydration mismatches) -->
    <ClientOnly>
      <Aurora />
      <GridOverlay />
      <CursorGlow />
      <ScrollProgress />
      <SmoothScroll />
      <GSAPAnimations />
    </ClientOnly>

    <!-- Page content with layout -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
onErrorCaptured((err, _instance, info) => {
  console.error('[app.vue] Error captured:', err, 'info:', info);
  return false;
});
</script>
