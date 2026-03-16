import { type NextRequest, NextResponse } from "next/server";
import { lookupIp } from "@/lib/ipLookup";

/** Returns true for loopback and RFC-1918/private IPv4 and IPv6 addresses. */
function isPrivateIp(ip: string): boolean {
  // Strip IPv4-mapped IPv6 prefix (::ffff:1.2.3.4 → 1.2.3.4) before checking.
  const normalized = ip.replace(/^::ffff:/i, "");
  return /^(127\.|10\.|172\.(1[6-9]|2\d|3[01])\.|192\.168\.|::1$|0\.0\.0\.0|fc|fd|fe80)/i.test(normalized);
}

/** Extract the real client IP from headers set by Nginx or other proxies. */
function extractIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    // x-forwarded-for can be a comma-separated list; leftmost is the original client.
    const first = xff.split(",")[0].trim();
    if (first && !isPrivateIp(first)) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp && !isPrivateIp(realIp.trim())) return realIp.trim();
  // Fallback — private/loopback IP in dev, or no header set.
  return "8.8.8.8";
}

export async function GET(req: NextRequest) {
  try {
    const ip = extractIp(req);
    const data = await lookupIp(ip);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/ip]", err);
    return NextResponse.json({ error: "Failed to resolve IP" }, { status: 500 });
  }
}
