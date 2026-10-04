export default defineEventHandler(async (event) => {
  const { pathname: path } = getRequestURL(event);

  if (!path.startsWith("/api/")) return;

  const apiKey = getHeader(event, "x-api-key");
  if (apiKey) {
    const user = await validateApiKey(apiKey);
    if (!user)
      throw createError({ statusCode: 401, statusMessage: "Unauthorized" });

    event.context.user = user;
    return;
  }

  const { user } = await requireUserSession(event);
  event.context.user = user;
});
