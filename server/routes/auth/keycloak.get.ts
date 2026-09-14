export default defineOAuthKeycloakEventHandler({
  config: {},
  async onSuccess(event, { user, tokens }) {
    const dbUser = await upsertUser("keycloak", user);

    await setUserSession(event, {
      user: { id: dbUser.id, sub: dbUser.sub, name: dbUser.name },
    });

    return sendRedirect(event, "/");
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("Authentik OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
