<script setup lang="ts">
const uiStore = useUiStore()
const { currentModalComponent } = useModalState()

const isModalActive = computed({
  get: () => uiStore.activeModal !== null,
  set: (value) => { !value && uiStore.hideModal() },
})
</script>

<template>
  <Transition name="modal-fade">
    <ModalFrame v-if="isModalActive" v-model="isModalActive">
      <ModalPanel v-model="isModalActive">
        <component
          :is="currentModalComponent"
          v-if="currentModalComponent"
        />
      </ModalPanel>
    </ModalFrame>
  </Transition>
</template>

<style scoped>
.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-active .relative,
.modal-fade-leave-active .relative {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}
.modal-fade-enter-from .relative,
.modal-fade-leave-to .relative {
  transform: translateY(20px);
}
</style>
