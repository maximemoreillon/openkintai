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
    db: {
      dialect: "postgresql",
      // No DATABASE_URL is available inside `docker build`, so don't let
      // NuxtHub silently migrate a throwaway pglite instance instead. Run
      // `npx nuxt db migrate` against the real database as a deploy step.
      applyMigrationsDuringBuild: false,
    },
  },
  runtimeConfig: {
    managerGroup: "",
    oauth: {
      oidc: {
        clientId: "",
        clientSecret: "",
        openidConfig: "",
        // Explicit override for the OIDC callback URL. Without this,
        // nuxt-auth-utils infers scheme/host from the request (trusting
        // X-Forwarded-Proto), which breaks behind proxies/tunnels that
        // don't set that header correctly (e.g. Cloudflare Tunnel).
        redirectURL: "",
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
