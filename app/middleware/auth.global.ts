export default defineNuxtRouteMiddleware((to, from) => {
  const { path } = to;
  if (path === "/login" || path.startsWith("/auth")) return;

  const session = useUserSession();
  if (!session.user.value) return navigateTo("/login");
});
