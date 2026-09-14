export default defineEventHandler((event) => {
  const { oauth } = useRuntimeConfig(event);

  return {
    authentik: Boolean(oauth.authentik.clientId),
    keycloak: Boolean(oauth.keycloak.clientId),
  };
});
