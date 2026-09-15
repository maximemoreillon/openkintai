// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";
import { VDateRangePicker } from "vuetify/labs/VDateRangePicker";

export default defineNuxtPlugin((app) => {
  const vuetify = createVuetify({
    theme: {
      defaultTheme: "dark", // 'system' | 'light' | 'dark'
    },
  });
  app.vueApp.use(vuetify);

  // Still a labs component, so vite-plugin-vuetify's autoImport doesn't
  // pick it up like the rest of the (stable) components used in templates.
  app.vueApp.component("VDateRangePicker", VDateRangePicker);
});
