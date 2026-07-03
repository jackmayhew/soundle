<script setup lang="ts">
const { currentShareComponent } = useShareComponent()
</script>

<template>
  <component :is="currentShareComponent" />
</template>
