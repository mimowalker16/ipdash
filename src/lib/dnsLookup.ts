import dns from "dns";

export type DnsRecordType =
  | "A"
  | "AAAA"
  | "CNAME"
  | "MX"
  | "NS"
  | "TXT"
  | "PTR"
  | "SOA";

export type DnsResult =
  | { type: "A"; records: string[] }
  | { type: "AAAA"; records: string[] }
  | { type: "CNAME"; records: string[] }
  | { type: "NS"; records: string[] }
  | { type: "PTR"; records: string[] }
  | { type: "MX"; records: dns.MxRecord[] }
  | { type: "TXT"; records: string[][] }
  | { type: "SOA"; records: dns.SoaRecord };

export async function resolveDns(
  domain: string,
  type: DnsRecordType
): Promise<DnsResult> {
  const r = dns.promises;

  switch (type) {
    case "A":
      return { type, records: await r.resolve4(domain) };
    case "AAAA":
      return { type, records: await r.resolve6(domain) };
    case "CNAME":
      return { type, records: await r.resolveCname(domain) };
    case "MX":
      return { type, records: await r.resolveMx(domain) };
    case "NS":
      return { type, records: await r.resolveNs(domain) };
    case "TXT":
      return { type, records: await r.resolveTxt(domain) };
    case "PTR":
      return { type, records: await r.resolvePtr(domain) };
    case "SOA":
      return { type, records: await r.resolveSoa(domain) };
  }
}
