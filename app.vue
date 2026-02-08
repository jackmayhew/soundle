<script setup lang="ts">
const { initializeUrlHandlers } = useUrlHandlers()

onMounted(() => {
  initializeUrlHandlers()
})
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
