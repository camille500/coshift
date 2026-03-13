<template>
  <div
    :style="{
      width: '1200px',
      height: '630px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'flex-start',
      padding: '80px',
      background: 'linear-gradient(135deg, #030306 0%, #0a0a1a 50%, #030306 100%)',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }"
  >
    <!-- Accent orbs -->
    <div
      :style="{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(0, 212, 170, 0.15), transparent)',
        filter: 'blur(60px)',
      }"
    />
    <div
      :style="{
        position: 'absolute',
        bottom: '-80px',
        left: '-80px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(124, 107, 218, 0.12), transparent)',
        filter: 'blur(60px)',
      }"
    />

    <!-- Logo -->
    <div
      :style="{
        fontSize: '28px',
        fontWeight: '700',
        letterSpacing: '-0.02em',
        marginBottom: '40px',
        display: 'flex',
      }"
    >
      <span :style="{ color: '#f4f4f6' }">Co</span>
      <span :style="{ color: '#00d4aa' }">Shift</span>
    </div>

    <!-- Title -->
    <div
      :style="{
        fontSize: '56px',
        fontWeight: '800',
        lineHeight: '1.15',
        letterSpacing: '-0.03em',
        color: '#f4f4f6',
        marginBottom: '24px',
        maxWidth: '900px',
      }"
    >
      {{ title }}
    </div>

    <!-- Description -->
    <div
      :style="{
        fontSize: '24px',
        lineHeight: '1.5',
        color: '#b4b4c0',
        maxWidth: '800px',
      }"
    >
      {{ description }}
    </div>

    <!-- Bottom accent line -->
    <div
      :style="{
        position: 'absolute',
        bottom: '0',
        left: '0',
        right: '0',
        height: '4px',
        background: 'linear-gradient(90deg, #00d4aa, #7c6bda, #c9a227)',
      }"
    />
  </div>
</template>

<script setup lang="ts">
defineProps<{
  title?: string;
  description?: string;
}>();
</script>
