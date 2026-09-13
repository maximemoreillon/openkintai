export default defineOAuthAuthentikEventHandler({
  config: {},
  async onSuccess(event, { user, tokens }) {
    // TODO: Upsert user in DB
    // IDEA: could use the DB id in session

    await setUserSession(event, {
      user,
    });

    return sendRedirect(event, "/");
  },
  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("Authentik OAuth error:", error);
    return sendRedirect(event, "/");
  },
});
