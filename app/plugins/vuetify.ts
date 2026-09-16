// import this after install `@mdi/font` package
import "@mdi/font/css/materialdesignicons.css";

import "vuetify/styles";
import { createVuetify } from "vuetify";

export default defineNuxtPlugin((app) => {
  // useCookie (rather than localStorage) so the server-rendered HTML and the
  // client hydration agree on the theme, avoiding a flash/mismatch on load.
  const theme = useCookie<"light" | "dark">("theme", { default: () => "dark" });

  const vuetify = createVuetify({
    theme: {
      defaultTheme: theme.value,
    },
  });
  app.vueApp.use(vuetify);
});
