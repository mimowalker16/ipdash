import { type NextRequest, NextResponse } from "next/server";
import { lookupIp } from "@/lib/ipLookup";

/** Extract the real client IP from headers set by Nginx or other proxies. */
function extractIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) {
    // x-forwarded-for can be a comma-separated list; leftmost is the original client.
    const first = xff.split(",")[0].trim();
    if (first) return first;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  // Fallback — works in local dev via Next.js internal request object.
  return "8.8.8.8"; // safe default for local dev; in prod Nginx will always set the header
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
