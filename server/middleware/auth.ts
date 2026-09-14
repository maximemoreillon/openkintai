export default defineEventHandler(async (event) => {
  const { pathname: path } = getRequestURL(event);

  if (!path.startsWith("/api/")) return;

  await requireUserSession(event);
});
