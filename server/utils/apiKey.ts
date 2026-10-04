export async function validateApiKey(apiKey: string) {
  const config = useRuntimeConfig();
  if (config.apiKey && apiKey !== config.apiKey) return;
  return { isManager: true, id: 0 };
}
