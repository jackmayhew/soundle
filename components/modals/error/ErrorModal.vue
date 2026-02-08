<script setup lang="ts">
const { currentErrorComponent } = useErrorComponent()
</script>

<template>
  <component :is="currentErrorComponent" />
</template>
