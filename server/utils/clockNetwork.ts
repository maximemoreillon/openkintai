import { BlockList, isIP } from "node:net";
import type { H3Event } from "h3";

// Rejects clock in/out from outside the networks listed in
// `clockAllowedNetworks` (comma-separated IPs/CIDRs). Disabled when empty.
export function assertClockNetwork(event: H3Event) {
  const config = useRuntimeConfig();
  const networks = config.clockAllowedNetworks
    .split(",")
    .map((n) => n.trim())
    .filter(Boolean);
  if (!networks.length) return;

  const allowed = new BlockList();
  for (const network of networks) {
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
