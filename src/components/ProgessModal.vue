<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
    >
      <div
        class="bg-[#141418] border border-gray-800 rounded-2xl p-8 w-[380px] text-center shadow-lg"
      >
        <!-- Title -->
        <h2 class="text-xl font-semibold text-white mb-6">
          {{ titleText }}
        </h2>

        <!-- Progress / Result -->
        <div v-if="status === 'loading'" class="space-y-4">
          <div class="w-full h-3 bg-gray-800 rounded-full overflow-hidden">
            <div
              class="h-full bg-white rounded-full transition-all duration-300 ease-linear"
              :style="{ width: percent + '%' }"
            ></div>
          </div>
          <p class="text-sm text-gray-400">{{ percent }}%</p>
        </div>

        <div v-else-if="status === 'success'" class="flex flex-col items-center gap-3">
          <div
            class="w-14 h-14 rounded-full flex items-center justify-center bg-green-500/20 text-green-400 text-3xl"
          >
            ✓
          </div>
          <p class="text-gray-300 font-medium">{{ actionName }} completed!</p>
        </div>

        <div v-else-if="status === 'error'" class="flex flex-col items-center gap-3">
          <div
            class="w-14 h-14 rounded-full flex items-center justify-center bg-red-500/20 text-red-400 text-3xl"
          >
            ✕
          </div>
          <p class="text-gray-300 font-medium">{{ actionName }} failed</p>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  actionName: { type: String, default: 'Processing' },
})

const visible = ref(false)
const percent = ref(0)
const status = ref('loading') // 'loading' | 'success' | 'error'
const titleText = ref('')

/**
 * Show modal and handle the API logic.
 * @param {Function} apiCall - async function that performs the action.
 */
const showModal = async (apiCall) => {
  visible.value = true
  percent.value = 0
  status.value = 'loading'
  titleText.value = `${props.actionName}...`

  // Fake percentage loading
  const progressInterval = setInterval(() => {
    if (percent.value < 98) {
      percent.value += Math.floor(Math.random() * 4) + 1
    }
  }, 200)

  try {
    await apiCall() // actual API call
    clearInterval(progressInterval)
    percent.value = 100
    status.value = 'success'
    titleText.value = `${props.actionName} Done!`
  } catch (err) {
    clearInterval(progressInterval)
    status.value = 'error'
    titleText.value = `${props.actionName} Failed`
  }

  // Auto-close after 10s
  setTimeout(() => {
    visible.value = false
    percent.value = 0
    status.value = 'loading'
  }, 5000)
}

defineExpose({ showModal })
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
