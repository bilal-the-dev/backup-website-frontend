<template>
  <div
    class="min-h-screen bg-[#0d0d0f] text-gray-100 flex flex-col relative overflow-hidden"
  >
    <!-- Background glow -->
    <div
      class="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"
    ></div>

    <!-- Navbar -->
    <nav
      class="w-full flex justify-between items-center px-8 py-4 bg-[#111116]/70 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50"
    >
      <h1 class="text-2xl font-semibold tracking-tight text-white">
        DiscArchive
      </h1>
    </nav>

    <!-- Page Container -->
    <div class="w-full max-w-6xl mx-auto px-8">
      <!-- Header -->
      <div class="px-6 py-8">
        <div
          class="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-white/5 via-transparent to-transparent backdrop-blur-xl"
        >
          <div class="relative px-8 py-8 flex items-center gap-6">
            <button
              @click="goBack"
              class="p-3 rounded-2xl bg-white/5 border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition"
              title="Go Back"
            >
              <ArrowLeftIcon class="w-5 h-5" />
            </button>

            <div>
              <h1 class="text-4xl font-bold text-white tracking-tight mb-1">
                Download Queue
              </h1>
              <p class="text-gray-400 text-sm">
                Active, completed & errored processes
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Process List -->
      <div class="px-4 sm:px-6 pb-14">
        <!-- Active Processes Section -->
        <div class="mb-10">
          <h2 class="text-xl font-semibold text-white mb-4 px-2">
            Active Processes
          </h2>
          <div class="space-y-4">
            <div
              v-for="job in activeProcesses"
              :key="job.id"
              class="rounded-xl border border-gray-700 bg-[#121216] shadow-lg"
            >
              <div
                class="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-5 py-4"
              >
                <!-- Icon -->
                <img
                  :src="job.icon"
                  class="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border border-gray-700 shrink-0"
                />

                <!-- Info -->
                <div class="flex-1 w-full">
                  <div class="flex items-center gap-3 flex-wrap">
                    <span class="text-white font-medium">
                      {{ job.name }}
                      <span
                        class="text-xs px-2 py-1 rounded-md border border-gray-700 text-gray-400"
                      >
                        {{ job.processType.toUpperCase() }}
                      </span>
                    </span>
                  </div>

                  <!-- Status / Meta -->
                  <div class="mt-3 flex flex-wrap items-center gap-2">
                    <!-- Status -->
                    <span
                      class="text-xs px-2 py-1 rounded-md border flex items-center gap-2"
                      :class="STATUS_STYLES[job.status]"
                    >
                      <!-- Pulsing dot when active -->
                      <span
                        v-if="job.status === 'active'"
                        class="relative flex h-2 w-2"
                      >
                        <span
                          class="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"
                        ></span>
                        <span
                          class="relative inline-flex rounded-full h-2 w-2 bg-blue-500"
                        ></span>
                      </span>

                      {{ getStatusText(job) }}
                    </span>

                    <!-- Token Type -->
                    <span
                      class="text-xs px-2 py-1 rounded-md border border-gray-700 text-gray-300 uppercase"
                    >
                      {{ job.tokenType }} token
                    </span>

                    <!-- Item Type -->
                    <span
                      class="text-xs px-2 py-1 rounded-md border border-gray-700 text-gray-400"
                    >
                      {{ job.type }}
                    </span>
                  </div>
                </div>

                <!-- Actions -->
                <button
                  v-if="job.status !== 'active'"
                  @click.stop="handleCancelNotification(job)"
                  class="p-2 rounded-lg border border-gray-700 bg-[#1a1a1e] hover:bg-gray-800 transition"
                  title="Cancel (soon)"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Empty State for Active -->
            <div
              v-if="!activeProcesses.length"
              class="text-center text-gray-500 py-12 bg-[#121216]/50 rounded-xl border border-gray-800"
            >
              No active processes
            </div>
          </div>
        </div>

        <!-- Errored Processes Section -->
        <div class="mb-10">
          <h2 class="text-xl font-semibold text-white mb-4 px-2">
            Errored Processes
          </h2>
          <div class="space-y-4">
            <div
              v-for="job in erroredProcesses"
              :key="job.id"
              class="rounded-xl border border-red-900/30 bg-[#121216] shadow-lg"
            >
              <div
                class="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-5 py-4"
              >
                <!-- Icon -->
                <img
                  :src="job.icon"
                  class="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border border-gray-700 shrink-0"
                />

                <!-- Info -->
                <div class="flex-1 w-full">
                  <div class="flex items-center gap-3 flex-wrap">
                    <span class="text-white font-medium">
                      {{ job.name }}
                      <span
                        class="text-xs px-2 py-1 rounded-md border border-gray-700 text-gray-400"
                      >
                        {{ job.processType.toUpperCase() }}
                      </span>
                    </span>
                  </div>

                  <div v-if="job.errorMessage" class="mt-3">
                    <p class="text-red-400 text-sm">
                      Error: {{ job.errorMessage }}
                    </p>
                  </div>

                  <!-- Status / Meta -->
                  <div class="mt-3 flex flex-wrap items-center gap-2">
                    <!-- Status -->
                    <span
                      class="text-xs px-2 py-1 rounded-md border flex items-center gap-2"
                      :class="STATUS_STYLES[job.status]"
                    >
                      {{ getStatusText(job) }}
                    </span>

                    <!-- Token Type -->
                    <span
                      class="text-xs px-2 py-1 rounded-md border border-gray-700 text-gray-300 uppercase"
                    >
                      {{ job.tokenType }} token
                    </span>

                    <!-- Item Type -->
                    <span
                      class="text-xs px-2 py-1 rounded-md border border-gray-700 text-gray-400"
                    >
                      {{ job.type }}
                    </span>
                  </div>

                  <!-- Error Message -->
                </div>

                <!-- Actions -->
                <button
                  @click.stop="handleCancelNotification(job)"
                  class="p-2 rounded-lg border border-gray-700 bg-[#1a1a1e] hover:bg-gray-800 transition"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Empty State for Errored -->
            <div
              v-if="!erroredProcesses.length"
              class="text-center text-gray-500 py-12 bg-[#121216]/50 rounded-xl border border-gray-800"
            >
              No errored processes
            </div>
          </div>
        </div>

        <!-- Completed Processes Section -->
        <div>
          <h2 class="text-xl font-semibold text-white mb-4 px-2">
            Completed Processes
          </h2>
          <div class="space-y-4">
            <div
              v-for="job in completedProcesses"
              :key="job.id"
              class="rounded-xl border border-gray-700 bg-[#121216] shadow-lg"
            >
              <div
                class="flex flex-col sm:flex-row items-start sm:items-center gap-4 px-5 py-4"
              >
                <!-- Icon -->
                <img
                  :src="job.icon"
                  class="w-14 h-14 sm:w-16 sm:h-16 rounded-lg object-cover border border-gray-700 shrink-0"
                />

                <!-- Info -->
                <div class="flex-1 w-full">
                  <div class="flex items-center gap-3 flex-wrap">
                    <span class="text-white font-medium">
                      {{ job.name }}
                      <span
                        class="text-xs px-2 py-1 rounded-md border border-gray-700 text-gray-400"
                      >
                        {{ job.processType.toUpperCase() }}
                      </span>
                    </span>
                  </div>

                  <!-- Status / Meta -->
                  <div class="mt-3 flex flex-wrap items-center gap-2">
                    <!-- Status -->
                    <span
                      class="text-xs px-2 py-1 rounded-md border flex items-center gap-2"
                      :class="STATUS_STYLES[job.status]"
                    >
                      {{ getStatusText(job) }}
                    </span>

                    <!-- Token Type -->
                    <span
                      class="text-xs px-2 py-1 rounded-md border border-gray-700 text-gray-300 uppercase"
                    >
                      {{ job.tokenType }} token
                    </span>

                    <!-- Item Type -->
                    <span
                      class="text-xs px-2 py-1 rounded-md border border-gray-700 text-gray-400"
                    >
                      {{ job.type }}
                    </span>
                  </div>
                </div>

                <!-- Actions -->
                <button
                  @click.stop="handleCancelNotification(job)"
                  class="p-2 rounded-lg border border-gray-700 bg-[#1a1a1e] hover:bg-gray-800 transition"
                  title="Remove"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Empty State for Completed -->
            <div
              v-if="!completedProcesses.length"
              class="text-center text-gray-500 py-12 bg-[#121216]/50 rounded-xl border border-gray-800"
            >
              No completed processes
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import {
  ArrowLeftIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/vue/24/outline";
import { sendGetRequest, sendPostRequest } from "@/apis/config";

const getStatusText = (job) => {
  // Only special text while active
  if (job.status === "active") {
    const isRestore = job.processType === "restore";
    const isBackup = job.processType === "backup";

    // SERVER
    if (job.type === "SERVER") {
      const progressText = `(${job.processedChannels} / ${job.totalChannels} channels Left)`;

      if (isRestore) return `Restoring server ${progressText}`;
      if (isBackup) return `Backing up server ${progressText}`;
    }

    // DM
    if (job.type === "DM") {
      if (isRestore) return "Restoring DM...";
      if (isBackup) return "Backing up DM...";
    }

    // GROUP DM
    if (job.type === "GROUP DM") {
      if (isRestore) return "Restoring group chat...";
      if (isBackup) return "Backing up group chat...";
    }

    return isRestore ? "Restoring..." : "Processing...";
  }

  // Finished states
  if (job.status === "completed") return "Completed";
  if (job.status === "errored") return "Error";
  if (job.status === "failed") return "Failed";

  return job.status;
};

const router = useRouter();

const user = ref({
  name: "Backup Bot",
  avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
});

const activeProcesses = ref([]);
const erroredProcesses = ref([]);
const completedProcesses = ref([]);

const DEFAULT_ICON = "https://cdn.discordapp.com/embed/avatars/0.png";

const ITEM_TYPE_LABELS = {
  guild: "SERVER",
  dm: "DM",
  group_dm: "GROUP DM",
};

const STATUS_STYLES = {
  active: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  completed: "bg-green-500/10 text-green-400 border-green-500/20",
  errored: "bg-red-500/10 text-red-400 border-red-500/20",
  failed: "bg-red-500/10 text-red-400 border-red-500/20",
};

const handleChangeToken = () => {
  router.push("/");
};

const goBack = () => {
  router.back();
};

onMounted(async () => {
  try {
    const res = await sendGetRequest("processes/");

    if (Array.isArray(res?.data)) {
      const allProcesses = res.data.map((item, index) => ({
        id: item.processId,
        backupId: item.backupId,
        name: item.itemName,
        status: item.status,
        tokenType: item.tokenType,
        type: ITEM_TYPE_LABELS[item.itemType] || item.itemType?.toUpperCase(),
        icon: item.iconURL || DEFAULT_ICON,
        errorMessage: item.errorMsg || item.errorMsg || null,
        processType: item.processType,
        totalChannels: item.totalChannels,
        processedChannels: item.processedChannels,
      }));

      // Separate into active, errored, and completed
      activeProcesses.value = allProcesses.filter((p) => p.status === "active");
      erroredProcesses.value = allProcesses.filter(
        (p) => p.status === "errored" || p.status === "failed"
      );
      completedProcesses.value = allProcesses.filter(
        (p) => p.status === "completed"
      );
    }
  } catch (err) {
    toast.error("Failed to load processes");
  }
});

async function handleCancelNotification(process) {
  try {
    await sendPostRequest(`/processes/${process.id}`);

    // Remove from active processes
    activeProcesses.value = activeProcesses.value.filter(
      (p) => p.id !== process.id
    );

    // Remove from errored processes
    erroredProcesses.value = erroredProcesses.value.filter(
      (p) => p.id !== process.id
    );

    // Remove from completed processes
    completedProcesses.value = completedProcesses.value.filter(
      (p) => p.id !== process.id
    );

    toast.success("Notification removed successfully");
  } catch (error) {
    toast.error(error.message || "Failed to cancel notification");
  }
}
</script>
