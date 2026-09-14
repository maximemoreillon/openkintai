import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  build: {
    transpile: ["vuetify"],
  },

  vite: {
    plugins: [vuetify({ autoImport: true })],
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },

  modules: ["@nuxthub/core", "nuxt-auth-utils"],
  hub: {
    db: "postgresql",
  },
  runtimeConfig: {
    managerGroup: "",
    oauth: {
      oidc: {
        clientId: "",
        clientSecret: "",
        openidConfig: "",
      },
    },
    public: {
      locale: "ja-JP",
      userManagementUrl: "",
    },
  },
  app: {
    head: {
      title: "OpenKintai",
      link: [{ rel: "icon", type: "image/x-icon", href: "/icon.png" }],
    },
  },
});
