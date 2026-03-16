"use client";

import { useState } from "react";
import type { DnsResult } from "@/lib/dnsLookup";
import DNSTable from "@/components/DNSTable";
import AdSlot from "@/components/AdSlot";

const RECORD_TYPES = ["A", "AAAA", "MX", "TXT", "NS", "CNAME", "PTR", "SOA"] as const;

export default function DNSLookupClient() {
  const [domain, setDomain] = useState("");
  const [type, setType] = useState<string>("A");
  const [result, setResult] = useState<DnsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const d = domain.trim();
    if (!d) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(
        `/api/dns?domain=${encodeURIComponent(d)}&type=${encodeURIComponent(type)}`
      );
      const json: DnsResult & { error?: string } = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Lookup failed");
      setResult(json);
    } catch (err: unknown) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <AdSlot id={201} className="min-h-[90px] w-full" />

      <form onSubmit={handleLookup} className="flex flex-wrap gap-3">
        <input
          type="text"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          placeholder="e.g. google.com"
          className="flex-1 min-w-[200px] rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        />
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
        >
          {RECORD_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {loading ? "Looking up…" : "Look Up"}
        </button>
      </form>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
            {type} records for <span className="text-gray-900">{domain}</span>
          </h2>
          <DNSTable result={result} />
        </div>
      )}

      <AdSlot id={202} className="min-h-[250px] w-full" />

      <section className="rounded-xl border border-gray-100 bg-gray-50 p-6">
        <h2 className="mb-3 text-base font-semibold">Common DNS Record Types</h2>
        <dl className="grid gap-2 sm:grid-cols-2">
          {[
            ["A", "Maps a domain to an IPv4 address"],
            ["AAAA", "Maps a domain to an IPv6 address"],
            ["MX", "Mail exchange — where email is delivered"],
            ["TXT", "Arbitrary text (SPF, DKIM, verification)"],
            ["NS", "Authoritative name servers for the domain"],
            ["CNAME", "Alias from one domain to another"],
            ["PTR", "Reverse DNS — IP address to hostname"],
            ["SOA", "Start of Authority — zone metadata"],
          ].map(([type, desc]) => (
            <div key={type} className="flex gap-2 text-sm">
              <dt className="w-12 shrink-0 font-mono font-semibold text-indigo-600">{type}</dt>
              <dd className="text-gray-600">{desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      <AdSlot id={203} className="min-h-[90px] w-full" />
    </div>
  );
}
