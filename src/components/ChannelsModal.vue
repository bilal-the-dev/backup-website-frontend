<template>
  <transition name="fade">
    <div
      v-if="visible"
      class="fixed inset-0 flex items-center justify-center bg-black/70 backdrop-blur-sm z-50"
    >
      <div
        class="bg-[#141418] border border-gray-800 rounded-2xl p-8 w-[520px] text-center shadow-xl flex flex-col relative"
      >
        <!-- Close Icon -->
        <button
          @click="hideModal"
          class="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl leading-none transition"
        >
          &times;
        </button>

        <!-- Title -->
        <h2 class="text-xl font-semibold text-white mb-6">
          Channels in {{ server?.name || "" }}
        </h2>

        <!-- Channel List -->
        <div class="overflow-y-auto max-h-[320px] px-1 space-y-2">
          <div
            v-for="channel in channels"
            :key="channel.id"
            class="bg-[#1a1a1e] border border-gray-700 hover:border-white rounded-lg p-3 cursor-pointer transition text-left text-sm text-gray-300 flex justify-between items-center"
            @click="handleSelectChannel(channel)"
          >
            <span># {{ channel.name }}</span>
            <span class="text-xs text-gray-500"
              >{{ channel.messages?.length || 0 }} messages</span
            >
          </div>

          <div v-if="channels.length === 0" class="text-sm text-gray-500 py-10">
            No channels available.
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  server: { type: Object, default: null }, // server info
  channels: { type: Array, default: () => [] }, // channels array
});

const emit = defineEmits(["select"]);

const visible = ref(false);

const showModal = () => {
  visible.value = true;
};

const hideModal = () => {
  visible.value = false;
};

const handleSelectChannel = (channel) => {
  hideModal();
  emit("select", channel); // emit the selected channel
};

defineExpose({ showModal, hideModal });
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Custom Dark Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.15);
  border-radius: 999px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
::-webkit-scrollbar-thumb:hover {
  background-color: rgba(255, 255, 255, 0.35);
}
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
}
</style>
