export default defineNuxtRouteMiddleware((to, from) => {
  const { path } = to;
  if (path === "/login" || path.startsWith("/auth")) return;

  // TODO: deal with /api

  const session = useUserSession();
  if (!session.user.value) return navigateTo("/login");
});
