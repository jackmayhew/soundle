<script setup lang="ts">
withDefaults(defineProps<{
  title: string
  subtitle: string
  size?: 'default' | 'lg'
  marginClass?: string
  blurPosition?: string
}>(), {
  size: 'default',
  blurPosition: '-bottom-[15px] h-[15px]',
})

const titleClasses = {
  default: 'text-3xl xs-350:text-4xl',
  lg: 'text-4xl xs-350:text-4.5xl poo',
}
</script>

<template>
  <header
    class="text-center sticky top-0 bg-light-game-background dark:bg-dark-game-background py-4 -mx-1 z-[100]"
    :class="marginClass"
  >
    <div class="flex justify-center">
      <h1
        class="main-title-ref font-coop font-bold text-center text-light-text-primary dark:text-dark-text-primary"
        :class="titleClasses[size]"
        tabindex="-1"
      >
        {{ title }}
      </h1>
      <CloseButton
        class="absolute right-1 top-4 h-6 w-6"
        @click="useUiStore().setView('menu')"
      />
    </div>
    <p v-if="subtitle" class="text-light-text-secondary dark:text-dark-text-secondary" v-html="subtitle" />
    <slot />
    <HeaderBlur :blur-position="blurPosition" />
  </header>
</template>
