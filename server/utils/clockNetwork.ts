import { BlockList, isIP } from "node:net";
import type { H3Event } from "h3";

// Rejects clock in/out from outside the networks listed in
// `clockAllowedNetworks` (comma-separated IPs/CIDRs). Disabled when empty.
// "self" stands for this server's own public IP, for deployments hosted on
// the office network whose public IP is dynamic.
export async function assertClockNetwork(event: H3Event) {
  const config = useRuntimeConfig();
  const networks = config.clockAllowedNetworks
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);
  if (!networks.length) return;

  const allowed = new BlockList();
  for (const network of networks) {
    if (network === "self") {
      const address = await getOwnPublicIp();
      allowed.addAddress(address, isIP(address) === 6 ? "ipv6" : "ipv4");
      continue;
    }
    const [address, prefix] = network.split("/");
    const type = isIP(address!) === 6 ? "ipv6" : "ipv4";
    if (prefix) allowed.addSubnet(address!, Number(prefix), type);
    else allowed.addAddress(address!, type);
  }

  // Behind a proxy the socket address is the proxy's, so the real client IP
  // has to come from a header the outermost proxy sets (e.g. Cloudflare's
  // cf-connecting-ip). Only trustworthy if the app is unreachable except
  // through that proxy.
  const ip = config.clientIpHeader
    ? getHeader(event, config.clientIpHeader)?.trim()
    : getRequestIP(event)?.replace(/^::ffff:/, "");

  const type = ip && isIP(ip);
  if (!type || !allowed.check(ip, type === 6 ? "ipv6" : "ipv4")) {
    throw createError({
      statusCode: 403,
      statusMessage: "Clocking in/out is only allowed from the office network",
    });
  }
}

// Looked up on every call rather than cached: clock in/out is infrequent, and
// this way a change of the office's IP takes effect immediately.
async function getOwnPublicIp() {
  try {
    const trace = await $fetch<string>(
      "https://www.cloudflare.com/cdn-cgi/trace",
      { responseType: "text", timeout: 5000 },
    );
    const ip = trace.match(/^ip=(.+)$/m)?.[1]?.trim();
    if (ip && isIP(ip)) return ip;
  } catch (error) {
    console.error(error);
  }
  throw createError({
    statusCode: 503,
    statusMessage: "Could not determine the office network's public IP",
  });
}
