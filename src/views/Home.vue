<template>
  <div
    class="min-h-screen bg-[#0d0d0f] text-gray-200 flex items-center justify-center px-4"
  >
    <div
      class="w-full max-w-lg bg-[#111116] border border-gray-800 rounded-2xl shadow-xl p-8 space-y-8"
    >
      <div class="text-center">
        <h1 class="text-3xl font-semibold text-white">
          Welcome to DiscArchive
        </h1>
        <p class="text-gray-400 mt-2">
          Backup your DMs, servers, and messages locally using your bot or
          account.
        </p>
      </div>

      <!-- Selection buttons -->
      <div class="space-y-4">
        <button
          @click="goToBotLogin"
          class="w-full flex items-center justify-center gap-2 bg-[#1a1a1e] border border-gray-700 text-white font-medium py-3 rounded-xl hover:bg-gray-800 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
          Login with Bot Token
        </button>

        <button
          @click="goToUserLogin"
          class="w-full flex items-center justify-center gap-2 bg-white border border-gray-700 text-black font-medium py-3 rounded-xl hover:bg-gray-200 transition"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5.121 17.804A9 9 0 1118.804 5.12M12 7v5l3 3"
            />
          </svg>
          Login with User Token
        </button>
      </div>

      <p class="text-gray-400 text-center text-sm">
        Choose one of the options to continue.
      </p>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

const goToBotLogin = () => {
  router.push("/login/bot");
};

const goToUserLogin = () => {
  router.push("/login/user");
};
</script>
