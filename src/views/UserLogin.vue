<template>
  <div
    class="min-h-screen bg-[#0d0d0f] text-gray-200 flex items-center justify-center px-4"
  >
    <div
      class="w-full max-w-md bg-[#111116] border border-gray-800 rounded-2xl shadow-xl p-8 space-y-6"
    >
      <div class="text-center">
        <h1 class="text-3xl font-semibold text-white">
          DiscArchive - User Login
        </h1>
        <p class="text-sm text-gray-400 mt-2">
          Backup your DMs, servers, and messages locally using your user
          account.
        </p>
      </div>

      <!-- If token exists and user is not changing -->
      <div v-if="existingToken && !changing" class="space-y-5">
        <div
          @click="goToDashboard"
          class="bg-[#1a1a1e] border border-gray-700 rounded-xl p-4 flex items-center gap-4"
        >
          <img
            :src="
              user.avatar || 'https://cdn.discordapp.com/embed/avatars/0.png'
            "
            alt="avatar"
            class="w-12 h-12 rounded-full border border-gray-600 object-cover"
          />
          <div class="flex-1">
            <p class="text-gray-400 text-sm mb-1">Logged in as:</p>
            <p class="text-white font-medium">
              {{ user.name || "Unknown User" }}
            </p>
            <p class="text-gray-400 text-xs break-all font-mono">
              {{ truncateToken(existingToken.token) }}
            </p>
          </div>
          <span
            class="inline-block px-3 py-1 text-xs font-medium text-black bg-white rounded-full"
          >
            USER
          </span>
        </div>

        <button
          @click="changing = true"
          class="w-full mt-4 flex justify-center items-center gap-2 bg-[#1a1a1e] border border-gray-700 text-white font-medium py-2 rounded-lg hover:bg-gray-800 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
          Change Token
        </button>
        <!-- Switch to Bot Login -->
        <div class="mt-3 text-center">
          <p class="text-gray-400 text-sm">
            Want to login with your bot account instead?
            <button
              @click="switchToBotLogin"
              class="ml-1 text-white font-medium hover:underline transition"
            >
              Switch to Bot Login →
            </button>
          </p>
        </div>
      </div>

      <!-- Token input form -->
      <div v-else class="space-y-5">
        <div>
          <label for="token" class="block text-sm text-gray-400 mb-1">
            Enter User Token
          </label>
          <input
            id="token"
            type="password"
            v-model="token"
            placeholder="Paste your user token here..."
            class="w-full bg-[#1a1a1e] border border-gray-700 focus:border-white rounded-lg px-4 py-2 text-sm text-gray-100 placeholder-gray-500 outline-none transition"
          />
        </div>

        <button
          @click="continueAction"
          class="w-full bg-white hover:bg-gray-200 text-black font-medium py-2 rounded-lg transition disabled:opacity-40"
          :disabled="!token || loading"
        >
          <span v-if="loading">Saving...</span>
          <span v-else>Continue →</span>
        </button>
        <!-- Switch to Bot Login -->
        <div class="mt-3 text-center">
          <p class="text-gray-400 text-sm">
            Want to login with your bot account instead?
            <button
              @click="switchToBotLogin"
              class="ml-1 text-white font-medium hover:underline transition"
            >
              Switch to Bot Login →
            </button>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { toast } from "vue3-toastify";
import { sendPostRequest, sendGetRequest } from "@/apis/config";

const router = useRouter();

const token = ref("");
const loading = ref(false);
const existingToken = ref(null);
const changing = ref(false);
const user = ref({ name: "", avatar: "" });

const goToDashboard = () => {
  if (existingToken.value?.tokenType === "bot") {
    router.push("/dashboard/bot");
  } else if (existingToken.value?.tokenType === "user") {
    router.push("/dashboard/user");
  }
};

const truncateToken = (t) => {
  if (!t) return "";
  const len = t.length;
  if (len <= 10) return t;
  return t.slice(0, 4) + "..." + t.slice(len - 4);
};

const fetchConfig = async () => {
  try {
    const result = await sendGetRequest("config?tokenType=user");

    if (Array.isArray(result?.data) && result.data.length > 0) {
      // Handle user token
      const userToken = result.data.find((item) => item.tokenType === "user");

      if (userToken && userToken.token) {
        existingToken.value = {
          token: userToken.token,
          tokenType: userToken.tokenType,
        };

        // Set isUserLoggedIn = true
        localStorage.setItem("isUserLoggedIn", "true");

        // Only call /users/@me if we got a user token
        try {
          const userResult = await sendGetRequest("users/@me?tokenType=user");
          if (userResult?.data) {
            user.value.name = userResult.data.username;
            user.value.avatar = userResult.data.avatarURL;
          }
        } catch (err) {
          toast.error(err.message || "Failed to fetch user info");
        }
        return; // exit early since user token exists
      }
    }

    // If no user token found, set isUserLoggedIn = false
    localStorage.setItem("isUserLoggedIn", "false");
    existingToken.value = null;
  } catch (error) {
    console.error(error.message);
    localStorage.setItem("isUserLoggedIn", "false");
  }
};

const continueAction = async () => {
  loading.value = true;

  const payload = {
    token: token.value,
    tokenType: "user",
  };

  try {
    const result = await sendPostRequest("config?tokenType=user", payload);

    if (typeof result === "string") {
      toast.error(result);
      loading.value = false;
      localStorage.setItem("isUserLoggedIn", "false");
      return;
    }

    if (result.status === "success") {
      toast.success("User configuration saved successfully!");
      // Set isUserLoggedIn = true
      localStorage.setItem("isUserLoggedIn", "true");

      setTimeout(() => {
        router.push("/dashboard/user");
      }, 2000);
    } else {
      // In case API returned error status
      localStorage.setItem("isUserLoggedIn", "false");
    }
  } catch (err) {
    toast.error(err.message || "Failed to save user configuration");
    localStorage.setItem("isUserLoggedIn", "false");
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchConfig();
});

const switchToBotLogin = () => {
  router.push("/login/bot");
};
</script>
