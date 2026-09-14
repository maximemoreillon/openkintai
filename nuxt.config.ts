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
      // Force the real driver instead of letting NuxtHub silently fall back
      // to an embedded `pglite` database when DATABASE_URL isn't present at
      // build time (docker build intentionally never sees it — it's runtime
      // config only). With the driver forced, the generated production
      // client reads DATABASE_URL live at server startup instead of baking
      // a value in at build time.
      driver: "postgres-js",
      // DATABASE_URL isn't available inside `docker build`, so don't let
      // NuxtHub try to apply migrations against a throwaway pglite instance
      // at build time either. Run `npx nuxt db migrate` as a deploy step.
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
