import { decodeJwt } from "jose";

export default defineOAuthOidcEventHandler({
  config: {},
  async onSuccess(event, { user, tokens }) {
    const issuer = tokens.id_token && decodeJwt(tokens.id_token).iss;
    if (!issuer) throw new Error("ID token is missing an issuer");

    const dbUser = await upsertUser(issuer, user);

    await setUserSession(event, {
      user: { id: dbUser.id, sub: dbUser.sub, name: dbUser.name },
    });

    return sendRedirect(event, "/");
  },
  onError(event, error) {
    console.error("OIDC error:", error);
    return sendRedirect(event, "/");
  },
});
