<script setup lang="ts">
import { Moon, Sun } from 'lucide-vue-next'

const colorMode = useColorMode()

const isDarkMode = computed(() => colorMode.value === 'dark')

function toggleTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <BaseButton
    id="theme-toggle"
    class="theme-toggle"
    :aria-pressed="isDarkMode"
    @click="toggleTheme"
  >
    <Transition name="slide" mode="out-in">
      <span :key="isDarkMode ? 'dark' : 'light'" class="font-semibold">
        {{ isDarkMode ? 'Light Mode' : 'Dark Mode' }}
      </span>
    </Transition>
    <div class="icon-container">
      <Sun class="sun" :size="22" aria-hidden="true" />
      <Moon class="moon" :size="22" aria-hidden="true" />
    </div>
  </BaseButton>
</template>

<style scoped>
.slide-enter-active, .slide-leave-active {
  transition: all 0.15s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.theme-toggle {
  width: 100%;
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  --icon-stroke-default: #2A2A2A;
  --icon-stroke-hover: #121212;
}

/* dark mode color */
html.dark .theme-toggle {
  --icon-stroke-default: #CCCCCC;
  --icon-stroke-hover: #DDDDDD;
}

.icon-container {
  position: relative;
  width: 1.5rem;
  height: 1.5rem;
}

.icon-container svg {
  position: absolute;
  inset: 0;
  stroke: var(--icon-stroke-default);
  pointer-events: none;
}

.theme-toggle:is(:hover, :focus-visible) .icon-container svg {
  stroke: var(--icon-stroke-hover);
}

.sun {
  opacity: 0;
  transform: rotate(-90deg) scale(0.5);
}

.moon {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

html.dark .sun {
  opacity: 1;
  transform: rotate(0deg) scale(1);
}

html.dark .moon {
  opacity: 0;
  transform: rotate(90deg) scale(0.5);
}

@media (prefers-reduced-motion: no-preference) {
  .sun,
  .moon {
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                stroke 200ms ease-in-out;
  }
}

@media (hover: hover) {
  .theme-toggle:hover .sun {
    transform: rotate(-15deg) scale(1);
  }
  .theme-toggle:hover .moon {
    transform: rotate(15deg) scale(1);
  }
  html.dark .theme-toggle:hover .sun {
    transform: rotate(15deg) scale(1);
  }
  html.dark .theme-toggle:hover .moon {
    transform: rotate(105deg) scale(0.5);
  }
}
</style>
