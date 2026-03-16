import type { Metadata } from "next";
import DNSLookupClient from "./DNSLookupClient";

export const metadata: Metadata = {
  title: "DNS Lookup — Check DNS Records for Any Domain",
  description:
    "Free online DNS lookup tool. Query A, AAAA, MX, TXT, NS, CNAME, PTR, and SOA records for any domain name.",
  alternates: { canonical: "/dns-lookup" },
};

export default function DNSLookupPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">DNS Lookup</h1>
        <p className="mt-2 text-gray-500">
          Query DNS records for any domain — A, AAAA, MX, TXT, NS, CNAME, PTR, SOA.
        </p>
      </div>
      <DNSLookupClient />
    </div>
  );
}
