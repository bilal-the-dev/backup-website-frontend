import { createRouter, createWebHistory } from "vue-router";

const routes = [
  {
    path: "/",
    name: "home",
    component: () => import("../views/Home.vue"),
    meta: { requiresGuest: true }, // only accessible if NOT logged in
  },
  {
    path: "/login/bot",
    name: "botLogin",
    component: () => import("../views/BotLogin.vue"),
    meta: { requiresGuest: true }, // only accessible if NOT logged in
  },
  {
    path: "/login/user",
    name: "selfuserLogin",
    component: () => import("../views/UserLogin.vue"),
    meta: { requiresGuest: true }, // only accessible if NOT logged in
  },
  {
    path: "/dashboard/bot",
    name: "dashboardBot",
    component: () => import("../views/BotDashboard.vue"),
    meta: { requiresAuthBot: true }, // only accessible if logged in as bot
  },
  {
    path: "/dashboard/user",
    name: "dashboardUser",
    component: () => import("../views/UserDashboard.vue"),
    meta: { requiresAuthUser: true }, // only accessible if logged in as user
  },
  {
    path: "/downloads",
    name: "downloads",
    component: () => import("../views/Downloads.vue"),
    meta: { requiresAuthAny: true }, // accessible if logged in as either
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

// Navigation guard
router.beforeEach((to, from, next) => {
  const isBotLoggedIn = localStorage.getItem("botLoggedIn") === "true";
  const isUserLoggedIn = localStorage.getItem("isUserLoggedIn") === "true";

  // Login pages are always accessible
  const loginPages = ["/login/bot", "/login/user", "/"];
  if (loginPages.includes(to.path)) {
    return next();
  }

  // Bot-protected routes
  if (to.meta.requiresAuthBot) {
    if (isBotLoggedIn) return next();
    return next("/login/bot"); // redirect to bot login if not logged in
  }

  // User-protected routes
  if (to.meta.requiresAuthUser) {
    if (isUserLoggedIn) return next();
    return next("/login/user"); // redirect to user login if not logged in
  }

  // Downloads page accessible by any logged in (bot or user)
  if (to.meta.requiresAuthAny) {
    if (isBotLoggedIn || isUserLoggedIn) return next();
    // Redirect based on preference, here redirect to bot login
    return next("/");
  }

  // Default fallback
  next();
});

export default router;
