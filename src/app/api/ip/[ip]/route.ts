import { type NextRequest, NextResponse } from "next/server";
import { lookupIp } from "@/lib/ipLookup";

// Basic IPv4 and IPv6 validation — prevents injection into the ip-api.com URL.
const IPV4_RE =
  /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
const IPV6_RE = /^[0-9a-fA-F:]{2,39}$/;

function isValidIp(ip: string): boolean {
  return IPV4_RE.test(ip) || IPV6_RE.test(ip);
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ ip: string }> }
) {
  const { ip } = await params;

  if (!isValidIp(ip)) {
    return NextResponse.json({ error: "Invalid IP address" }, { status: 400 });
  }

  try {
    const data = await lookupIp(ip);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[/api/ip/[ip]]", err);
    return NextResponse.json({ error: "Failed to resolve IP" }, { status: 500 });
  }
}
