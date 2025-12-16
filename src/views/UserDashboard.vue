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

      <div class="flex items-center gap-3">
        <!-- Download Queue Icon -->
        <img
          :src="user.avatar"
          alt="avatar"
          class="w-9 h-9 rounded-full border border-gray-700 object-cover shadow-md hidden sm:inline-block"
        />
        <span class="text-sm font-medium text-gray-200 hidden sm:inline-block">
          {{ user.name }}
        </span>
        <div
          class="relative cursor-pointer"
          title="Pending Downloads"
          @click="openDownloads"
        >
          <!-- Icon -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-6 h-6 text-gray-300 hover:text-white transition"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
            />
          </svg>

          <!-- Badge -->
          <span
            v-if="user.processes > 0"
            class="absolute -top-2 -right-2 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center shadow"
          >
            {{ user.processes }}
          </span>
        </div>
        <button
          @click="switchToUserDashboard"
          class="ml-3 p-2 text-white bg-[#1a1a1e] border border-gray-700 rounded-lg shadow-sm hover:bg-gray-800 hover:scale-105 transition transform duration-200 flex items-center justify-center"
          title="Switch to User Dashboard"
        >
          <!-- You can use any icon you like, here is a swap/refresh style icon from Heroicons -->
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v6h6M20 20v-6h-6M4 14a9 9 0 0113.86-7.36M20 10a9 9 0 01-13.86 7.36"
            />
          </svg>
        </button>
        <button
          @click="handleChangeToken"
          class="ml-3 p-2 text-white bg-[#1a1a1e] border border-gray-700 rounded-lg shadow-sm hover:bg-gray-800 hover:scale-105 transition transform duration-200 flex items-center justify-center"
          title="Logout"
        >
          <ArrowRightOnRectangleIcon class="w-5 h-5" />
        </button>
      </div>
    </nav>

    <!-- Main content -->
    <div class="flex-1 px-6 py-8 space-y-10 overflow-y-auto">
      <!-- PAGE HEADER -->
      <div class="mb-10">
        <div
          class="relative overflow-hidden rounded-3xl border border-gray-800 bg-gradient-to-br from-[#1b1b22] via-[#121216] to-[#0d0d0f] shadow-2xl"
        >
          <!-- Soft glow -->
          <div
            class="absolute inset-0 bg-gradient-to-r from-white/10 via-transparent to-transparent opacity-50 pointer-events-none"
          ></div>

          <div class="relative px-10 py-10 flex flex-col gap-4">
            <div class="flex flex-wrap gap-3 mt-4">
              <span
                class="px-3 py-1.5 text-sm rounded-md bg-white/20 text-gray-200 border border-white/10"
              >
                🤖 User Dashboard
              </span>
            </div>
            <h1
              class="text-4xl md:text-5xl font-extrabold text-white tracking-tight drop-shadow"
            >
              User Backup Dashboard
            </h1>

            <p
              class="text-gray-400 max-w-2xl text-base md:text-lg leading-relaxed"
            >
              Securely backup your Discord servers, private conversations, and
              group chats. Everything stays local — fast, private, and under
              your control.
            </p>

            <div class="flex flex-wrap gap-3 mt-4">
              <span
                class="px-3 py-1.5 text-sm rounded-full bg-white/10 text-gray-200 border border-white/10"
              >
                🛡️ Local & Private
              </span>
              <span
                class="px-3 py-1.5 text-sm rounded-full bg-white/10 text-gray-200 border border-white/10"
              >
                ⚡ Fast Backups
              </span>
              <span
                class="px-3 py-1.5 text-sm rounded-full bg-white/10 text-gray-200 border border-white/10"
              >
                💾 Servers · DMs · Groups
              </span>
            </div>
          </div>
        </div>
      </div>
      <section class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        <div class="bg-[#141418] border border-gray-800 rounded-xl p-5">
          <p class="text-gray-400 text-sm">Servers</p>
          <p class="text-2xl font-bold text-white">{{ servers.length }}</p>
        </div>

        <div class="bg-[#141418] border border-gray-800 rounded-xl p-5">
          <p class="text-gray-400 text-sm">DMs</p>
          <p class="text-2xl font-bold text-white">{{ dms.length }}</p>
        </div>

        <div class="bg-[#141418] border border-gray-800 rounded-xl p-5">
          <p class="text-gray-400 text-sm">Group DMs</p>
          <p class="text-2xl font-bold text-white">{{ groupDms.length }}</p>
        </div>

        <div class="bg-[#141418] border border-gray-800 rounded-xl p-5">
          <p class="text-gray-400 text-sm">Last Backup</p>
          <p class="text-sm text-white">Just now</p>
        </div>
      </section>

      <!-- Servers -->
      <section>
        <div class="mt-10 mb-10">
          <div
            class="px-6 py-5 bg-[#16161b] border border-gray-800 rounded-2xl flex items-center justify-between shadow-xl"
          >
            <h2 class="text-3xl font-semibold text-white tracking-wide">
              Servers
            </h2>
          </div>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          <div
            v-for="server in servers"
            :key="server.id"
            class="bg-[#141418] border border-gray-800 rounded-xl p-5 flex flex-col items-start gap-4 cursor-pointer transition-all duration-300 hover:border-white hover:shadow-lg hover:shadow-white/10 hover:-translate-y-1"
          >
            <div class="flex items-center gap-4 w-full">
              <img
                :src="server.iconURL"
                alt="server iconURL"
                class="w-12 h-12 rounded-lg object-cover shadow-sm"
              />
              <div class="flex flex-col">
                <span class="text-base font-medium text-white">{{
                  server.name
                }}</span>
                <span class="text-xs text-gray-500 mt-0.5">Server</span>
                <div class="flex flex-col">
                  <span
                    class="text-xs mt-0.5"
                    :class="server.isLeft ? 'text-red-400' : 'text-green-400'"
                  >
                    {{ server.isLeft ? "Left the server" : "Active in server" }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-2 mt-auto w-full">
              <button
                v-if="!server.isLeft"
                class="flex-1 bg-white text-black text-sm font-medium py-1.5 rounded-lg hover:bg-gray-200 transition"
                @click.stop="backup(server)"
              >
                Backup
              </button>
              <button
                class="flex-1 bg-[#1a1a1e] text-white text-sm font-medium py-1.5 rounded-lg border border-gray-700 hover:bg-gray-800 transition"
                @click.stop="restore(server)"
              >
                Restore
              </button>
              <button
                v-if="server.backupId"
                class="p-2 rounded-lg border border-gray-700 bg-[#1a1a1e] hover:bg-gray-800 transition"
                title="Download"
                @click.stop="download(server)"
              >
                <ArrowDownTrayIcon class="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Divider -->
      <div class="border-t border-gray-800 my-4 opacity-50"></div>

      <section v-if="dms.length > 0">
        <div class="mt-10 mb-10">
          <div
            class="px-6 py-5 bg-[#16161b] border border-gray-800 rounded-2xl flex items-center justify-between shadow-xl"
          >
            <h2 class="text-3xl font-semibold text-white tracking-wide">
              Direct Messages
            </h2>
          </div>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          <div
            v-for="dm in dms"
            :key="dm.id"
            class="bg-[#141418] border border-gray-800 rounded-xl p-5 flex flex-col items-start gap-4 cursor-pointer transition-all duration-300 hover:border-white hover:shadow-lg hover:shadow-white/10 hover:-translate-y-1"
          >
            <div class="flex items-center gap-4 w-full">
              <img
                :src="dm.iconURL"
                class="w-12 h-12 rounded-full object-cover shadow-sm"
              />
              <div class="flex flex-col">
                <span class="text-base font-medium text-white">{{
                  dm.name
                }}</span>
                <span class="text-xs text-gray-500 mt-0.5">DM</span>
              </div>
            </div>

            <div class="flex gap-2 mt-auto w-full">
              <button
                class="flex-1 bg-white text-black text-sm font-medium py-1.5 rounded-lg hover:bg-gray-200 transition"
                @click.stop="backup(dm, `dm`)"
              >
                Backup
              </button>
              <button
                class="flex-1 bg-[#1a1a1e] text-white text-sm font-medium py-1.5 rounded-lg border border-gray-700 hover:bg-gray-800 transition"
                @click.stop="restore(dm)"
              >
                Restore
              </button>
              <button
                v-if="dm.backupId"
                class="p-2 rounded-lg border border-gray-700 bg-[#1a1a1e] hover:bg-gray-800 transition"
                title="Download"
                @click.stop="download(dm)"
              >
                <ArrowDownTrayIcon class="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- GROUP DMS -->
      <section v-if="groupDms.length > 0">
        <div class="mt-10 mb-10">
          <div
            class="px-6 py-5 bg-[#16161b] border border-gray-800 rounded-2xl flex items-center justify-between shadow-xl"
          >
            <h2 class="text-3xl font-semibold text-white tracking-wide">
              Group DMs
            </h2>
          </div>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5"
        >
          <div
            v-for="dm in groupDms"
            :key="dm.id"
            class="bg-[#141418] border border-gray-800 rounded-xl p-5 flex flex-col items-start gap-4 cursor-pointer transition-all duration-300 hover:border-white hover:shadow-lg hover:shadow-white/10 hover:-translate-y-1"
          >
            <div class="flex items-center gap-4 w-full">
              <img
                :src="dm.iconURL"
                class="w-12 h-12 rounded-lg object-cover shadow-sm"
              />
              <div class="flex flex-col">
                <span class="text-base font-medium text-white">{{
                  dm.name
                }}</span>
                <span class="text-xs text-gray-500 mt-0.5">Group DM</span>
              </div>
            </div>

            <div class="flex gap-2 mt-auto w-full">
              <button
                class="flex-1 bg-white text-black text-sm font-medium py-1.5 rounded-lg hover:bg-gray-200 transition"
                @click.stop="backup(dm, `groupdm`)"
              >
                Backup
              </button>
              <button
                class="flex-1 bg-[#1a1a1e] text-white text-sm font-medium py-1.5 rounded-lg border border-gray-700 hover:bg-gray-800 transition"
                @click.stop="restore(dm)"
              >
                Restore
              </button>
              <button
                v-if="dm.backupId"
                class="p-2 rounded-lg border border-gray-700 bg-[#1a1a1e] hover:bg-gray-800 transition"
                title="Download"
                @click.stop="download(dm)"
              >
                <ArrowDownTrayIcon class="w-5 h-5 text-gray-300" />
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>

    <ProgessModal ref="progressModal" actionName="Backup" />
    <ProgessModal ref="progressModal" actionName="Restoring" />
    <RestoreSelectModal
      ref="restoreSelectModal"
      :servers="servers"
      :dms="dms"
      :groupDms="groupDms"
      @select="handleRestoreSelect"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { toast } from "vue3-toastify";
import ProgessModal from "@/components/ProgessModal.vue";
import RestoreSelectModal from "@/components/RestoreSelectModal.vue";
import { sendGetRequest, sendPostRequest } from "@/apis/config";
import { useRouter } from "vue-router";
import {
  ArrowRightOnRectangleIcon,
  ArrowDownTrayIcon,
} from "@heroicons/vue/24/outline";
const router = useRouter();
const progressModal = ref(null);
const restoreSelectModal = ref(null);
const loading = ref(false);

const servers = ref([]);
const dms = ref([]);

const groupDms = ref([]);
const user = ref({
  name: "Backup Bot",
  avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
  bot: true,
  processes: 0,
});

// ---------------------------
// FETCH USER
// ---------------------------
const fetchUser = async () => {
  try {
    const result = await sendGetRequest("users/@me?tokenType=user");

    if (result?.data) {
      user.value.name = result.data.username;
      user.value.avatar = result.data.avatarURL;
      user.value.bot = result.data.bot; // IMPORTANT
      user.value.processes = result.data.processes;
    }
  } catch (err) {
    toast.error("Failed to load user");
  }
};

// ---------------------------
// FETCH SERVERS
// ---------------------------
const fetchServers = async () => {
  loading.value = true;
  try {
    const result = await sendGetRequest("data?tokenType=user");
    if (result?.data) {
      servers.value = result.data.guilds;
      const formattedDms = result.data.dms.map((dm) => formatDM(dm));
      const formattedGroupDms = result.data.groupDms.map((dm) => formatDM(dm));
      dms.value = formattedDms;
      groupDms.value = formattedGroupDms;
    } else {
      toast.error("No servers found");
    }
  } catch (err) {
    toast.error(err.message || "Failed to fetch servers");
  } finally {
    loading.value = false;
  }
};

const formatDM = (dm) => {
  const defaultAvatar = "https://cdn.discordapp.com/embed/avatars/1.png";
  // Build avatar URL if avatar hash exists

  const avatarURL = dm.iconURL ? dm.iconURL : defaultAvatar;
  const truncate = (text, max = 13) => {
    if (!text) return "";
    return text.length > max ? text.slice(0, max) + "..." : text;
  };

  const displayName =
    dm.name ||
    (dm.type === "DM"
      ? "Unknown User"
      : dm.type === "GROUP_DM"
      ? "Unnamed Group"
      : "Unknown");

  return {
    ...dm,
    name: displayName,
    iconURL: avatarURL,
  };
};

// ---------------------------
// ON PAGE LOAD
// ---------------------------
onMounted(async () => {
  await fetchUser(); // First fetch user
  await fetchServers(); // Always fetch servers
});

// ---------------------------
// Backups
// ---------------------------
const fakeApiCall = () => new Promise((resolve) => setTimeout(resolve, 1500));

const backup = async (item, type) => {
  try {
    // Construct endpoint with itemId and query parameter token
    const endpoint = `/backup/${item.id}?tokenType=user`;

    // Prepare payload for the API
    const payload = {
      itemType: type, // fixed type
      itemName: item.name, // send the item name
      iconURL: item.iconURL,
    };

    // Send POST request
    const result = await sendPostRequest(endpoint, payload);
    toast.success("Backup Started Successfully, Check on Downloads Page");
    return result;
  } catch (err) {
    console.error("Backup error:", err);
    return err;
  }
};

const restore = async (item) => {
  restoreSelectModal.value.showModal();
};

const handleRestoreSelect = async ({ type, item }) => {
  await progressModal.value.showModal(fakeApiCall);
};

async function download(server) {
  try {
    if (!server.backupId) {
      toast.error("No backup available to download");
      return;
    }

    // Send GET request to /backup/:backupId
    const response = await sendGetRequest(
      `/backup/${server.backupId}?tokenType=user`
    );

    // Convert JSON object to a Blob
    const dataStr = JSON.stringify(response, null, 2); // formatted JSON
    const blob = new Blob([dataStr], { type: "application/json" });

    // Create a temporary link to trigger download
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `backup_${server.backupId}.json`; // filename
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url); // clean up

    toast.success("Backup download started");
    console.log("Backup response:", response);
  } catch (error) {
    toast.error(error.message || "Failed to start backup download");
    console.error(error);
  }
}
// ---------------------------
// CHANGE TOKEN
// ---------------------------

// Click handler

const openDownloads = () => {
  router.push("/downloads");
};
const handleChangeToken = () => {
  router.push("/login/user");
};
const switchToUserDashboard = () => {
  router.push("/dashboard/bot");
};
</script>
