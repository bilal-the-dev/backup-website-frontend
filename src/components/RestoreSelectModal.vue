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
        <h2 class="text-xl font-semibold text-white mb-6">Restore Backup</h2>

        <!-- Tabs -->
        <div class="flex justify-center gap-2 mb-6">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            :class="[
              'px-4 py-2 rounded-lg font-medium text-sm transition',
              activeTab === tab.key
                ? 'bg-white text-black'
                : 'bg-transparent text-gray-400 hover:text-white',
            ]"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- Content -->
        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-4 overflow-y-auto max-h-[320px] px-1"
        >
          <div
            v-for="item in activeItems"
            :key="item.id"
            class="bg-[#111116] border border-gray-800 hover:border-white rounded-xl p-4 flex items-center gap-3 cursor-pointer transition"
            @click="handleSelect(item)"
          >
            <img
              :src="item.iconURL"
              alt="icon"
              class="w-10 h-10 rounded-lg object-cover"
            />

            <div class="flex flex-col text-left">
              <span class="text-sm font-medium text-white">
                {{ item.name }}
              </span>
              <span class="text-xs text-gray-500">
                {{ activeLabel }}
              </span>
            </div>
          </div>

          <!-- Empty state -->
          <div
            v-if="activeItems.length === 0"
            class="col-span-full text-sm text-gray-500 py-10"
          >
            Nothing to restore here.
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  servers: { type: Array, default: () => [] },
  dms: { type: Array, default: () => [] },
  groupDms: { type: Array, default: () => [] },
});

const emit = defineEmits(["select"]);

const visible = ref(false);
const activeTab = ref("servers");

const tabs = [
  { key: "servers", label: "Servers" },
  { key: "dms", label: "DMs" },
  { key: "groupDms", label: "Group DMs" },
];

const activeItems = computed(() => {
  if (activeTab.value === "servers") return props.servers;
  if (activeTab.value === "dms") return props.dms;
  if (activeTab.value === "groupDms") return props.groupDms;
  return [];
});

const activeLabel = computed(() => {
  if (activeTab.value === "servers") return "Server";
  if (activeTab.value === "dms") return "Direct Message";
  if (activeTab.value === "groupDms") return "Group Chat";
  return "";
});

const showModal = () => {
  visible.value = true;
  activeTab.value = "servers";
};

const hideModal = () => {
  visible.value = false;
};

const handleSelect = (item) => {
  hideModal();
  emit("select", { type: activeTab.value, item });
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

/* ============================= */
/* Custom Dark Scrollbar (Modal) */
/* ============================= */

/* Chrome, Edge, Safari */
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

/* Firefox */
* {
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.25) transparent;
}
</style>
