import { type NextRequest, NextResponse } from "next/server";
import { resolveDns, type DnsRecordType } from "@/lib/dnsLookup";

const ALLOWED_TYPES: DnsRecordType[] = [
  "A",
  "AAAA",
  "CNAME",
  "MX",
  "NS",
  "TXT",
  "PTR",
  "SOA",
];

// Allow only valid domain/hostname characters to prevent abuse.
const DOMAIN_RE = /^[a-zA-Z0-9._-]{1,253}$/;

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const domain = searchParams.get("domain")?.trim() ?? "";
  const typeParam = (searchParams.get("type") ?? "A").toUpperCase() as DnsRecordType;

  if (!domain || !DOMAIN_RE.test(domain)) {
    return NextResponse.json({ error: "Invalid domain" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.includes(typeParam)) {
    return NextResponse.json(
      { error: `Unsupported record type. Allowed: ${ALLOWED_TYPES.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const result = await resolveDns(domain, typeParam);
    return NextResponse.json(result);
  } catch (err: unknown) {
    // dns.promises throws a NodeJS.ErrnoException with a code property.
    const code = (err as NodeJS.ErrnoException).code ?? "UNKNOWN";
    if (code === "ENOTFOUND" || code === "ENODATA" || code === "ESERVFAIL") {
      return NextResponse.json(
        { error: `No ${typeParam} records found for "${domain}"` },
        { status: 404 }
      );
    }
    console.error("[/api/dns]", err);
    return NextResponse.json({ error: "DNS lookup failed" }, { status: 500 });
  }
}
