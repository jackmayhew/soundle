<script setup lang="ts">
import type { AudioStatus } from '~/types/ui/audio.types'
import { Pause, Volume2 } from 'lucide-vue-next'

const props = defineProps<{
  src?: string
  status?: AudioStatus
}>()

const emit = defineEmits<{
  'ready': []
  'update:status': [status: AudioStatus]
}>()

const uiStore = useUiStore()
const gameStore = useGameStore()

const { trackException } = useTrackException()
const buttonRef = ref<HTMLElement | null>(null)
const audio = ref<HTMLAudioElement | null>(null)

const isPlaying = ref(false)
const isBuffering = ref(false)
const hasError = ref(false)
const showPopover = ref(false)

const isLoading = computed(() => isBuffering.value)

const soundBtnAriaLabel = computed(() => {
  if (props.status === 'loading')
    return 'Loading sound'
  if (props.status === 'error')
    return 'Sound failed to load'
  return isPlaying.value ? 'Pause sound' : 'Play sound'
})

function initAudio(url: string) {
  cleanup()
  hasError.value = false
  isBuffering.value = true

  const newAudio = new Audio(url)

  const onReady = () => {
    if (isBuffering.value) {
      isBuffering.value = false
      emit('ready')
    }
  }

  const onError = async () => {
    console.error('Audio stream error:', newAudio.error)
    // Small delay to prevent flickering
    await delay(500)
    isBuffering.value = false
    isPlaying.value = false
    hasError.value = true
  }

  const onPlay = () => isPlaying.value = true
  const onPause = () => isPlaying.value = false
  const onEnd = () => {
    gameStore.incrementListenCount()
    isPlaying.value = false
  }

  newAudio.addEventListener('loadedmetadata', onReady)
  newAudio.addEventListener('canplay', onReady)

  newAudio.addEventListener('error', onError)
  newAudio.addEventListener('play', onPlay)
  newAudio.addEventListener('pause', onPause)
  newAudio.addEventListener('ended', onEnd)

  audio.value = newAudio
}

function cleanup() {
  if (audio.value) {
    audio.value.pause()
    audio.value = null
  }
  isPlaying.value = false
  isBuffering.value = false
}

watch(() => props.src, (newUrl) => {
  if (newUrl) {
    initAudio(newUrl)
  }
}, { immediate: true })

onUnmounted(cleanup)

watch(() => uiStore.activeModal, (val) => {
  if (val && audio.value)
    audio.value.pause()
})

watchEffect(() => {
  if (isLoading.value) {
    emit('update:status', 'loading')
  }
  else if (hasError.value) {
    emit('update:status', 'error')
  }
  else {
    emit('update:status', 'ready')
  }
})

function handleClick() {
  if (isLoading.value)
    return

  if (hasError.value) {
    showPopover.value = !showPopover.value
    return
  }

  if (audio.value) {
    const playPromise = isPlaying.value ? audio.value.pause() : audio.value.play()
    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        if (error.name !== 'AbortError') {
          trackException('AudioPlaybackError', error)
          console.error('Audio playback failed:', error)
          hasError.value = true
          showPopover.value = true
        }
      })
    }
  }
}

function handleRetry() {
  showPopover.value = false
  if (props.src) {
    initAudio(props.src)
    audio.value?.load()
  }
}
</script>

<template>
  <div class="relative inline-flex flex-col items-center">
    <div ref="buttonRef" :class="{ 'cursor-progress': isLoading }">
      <BaseButton
        class="p-2 border-3 border-black-primary rounded-full bg-white-primary
        transition-all duration-300 ease-in-out dark:bg-dark-game-background
        dark:text-dark-text-secondary dark:border-dark-border-primary hover:enabled:bg-blue-primary
        dark:hover:enabled:bg-blue-primary dark:hover:enabled:text-black-primary"
        :class="{
          'opacity-50 pointer-events-none': isLoading,
          'opacity-50': hasError,
          '!bg-blue-secondary dark:!text-black-primary': isPlaying,
        }"
        :aria-label="soundBtnAriaLabel"
        @click="handleClick"
      >
        <div :class="{ 'animate-pulse': isLoading }">
          <BaseIcon v-if="!isPlaying" :icon="Volume2" :size="56" />
          <BaseIcon v-else :icon="Pause" :size="56" />
        </div>
      </BaseButton>
    </div>
    <Popover
      :show="showPopover"
      :ignore-refs="buttonRef ? [buttonRef] : []"
      position="top-center"
      width="w-[200px]"
      @close="showPopover = false"
    >
      <div class="text-center p-1">
        <p class="text-sm mb-2 font-medium text-light-text-primary dark:text-dark-text-primary">
          Failed to load audio.
        </p>
        <BaseButton
          class="px-4 py-1 bg-green-primary hover:bg-green-secondary dark:hover:bg-green-tertiary text-black-primary border-3 border-black-primary rounded-md text-sm font-bold transition-all duration-300 ease-in-out"
          @click="handleRetry"
        >
          Retry
        </BaseButton>
      </div>
    </Popover>
  </div>
</template>
