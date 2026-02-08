import Step1Welcome from '~/components/modals/tutorial/steps/Step1Welcome.vue'
import Step2Audio from '~/components/modals/tutorial/steps/Step2Audio.vue'
import Step3Guess from '~/components/modals/tutorial/steps/Step3Guess.vue'
import Step4Results from '~/components/modals/tutorial/steps/Step4Results.vue'
import Step5Tools from '~/components/modals/tutorial/steps/Step5Tools.vue'
import Step6Final from '~/components/modals/tutorial/steps/Step6Final.vue'

/**
 * Resolves the correct tutorial step component based on the current index.
 */
export function useTutorialComponent(currentStep: Ref<number>) {
  const currentStepComponent = computed(() => {
    switch (currentStep.value) {
      case 1:
        return Step1Welcome
      case 2:
        return Step2Audio
      case 3:
        return Step3Guess
      case 4:
        return Step4Results
      case 5:
        return Step5Tools
      case 6:
        return Step6Final
      default:
        return Step1Welcome
    }
  })

  return { currentStepComponent }
}
