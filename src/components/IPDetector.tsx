"use client";

import { useEffect, useState } from "react";
import type { IpApiResponse } from "@/lib/ipLookup";
import IPInfoCard from "@/components/IPInfoCard";
import AdSlot from "@/components/AdSlot";

export default function IPDetector() {
  const [data, setData] = useState<IpApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [lookupIp, setLookupIp] = useState("");
  const [lookupData, setLookupData] = useState<IpApiResponse | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupError, setLookupError] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/ip")
      .then((r) => r.json())
      .then((d: IpApiResponse) => setData(d))
      .catch(() => setError("Could not detect your IP address."))
      .finally(() => setLoading(false));
  }, []);

  async function handleLookup(e: React.FormEvent) {
    e.preventDefault();
    const ip = lookupIp.trim();
    if (!ip) return;
    setLookupLoading(true);
    setLookupError(null);
    setLookupData(null);
    try {
      const res = await fetch(`/api/ip/${encodeURIComponent(ip)}`);
      const json: IpApiResponse & { error?: string } = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Lookup failed");
      setLookupData(json);
    } catch (err: unknown) {
      setLookupError((err as Error).message);
    } finally {
      setLookupLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Top ad slot */}
      <AdSlot id={101} className="min-h-[90px] w-full" />

      {/* Auto-detected IP */}
      {loading && (
        <div className="flex items-center justify-center py-16">
          <span className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-300 border-t-indigo-600" />
          <span className="ml-3 text-gray-500">Detecting your IP&hellip;</span>
        </div>
      )}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}
      {data && <IPInfoCard data={data} />}

      {/* Mid-page ad slot */}
      <AdSlot id={102} className="min-h-[250px] w-full" />

      {/* Lookup any IP */}
      <section>
        <h2 className="mb-3 text-lg font-semibold">Look Up Any IP Address</h2>
        <form onSubmit={handleLookup} className="flex gap-3">
          <input
            type="text"
            value={lookupIp}
            onChange={(e) => setLookupIp(e.target.value)}
            placeholder="e.g. 8.8.8.8 or 2001:4860:4860::8888"
            className="flex-1 rounded-lg border border-gray-300 px-4 py-2 text-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={lookupLoading}
            className="rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            {lookupLoading ? "Looking up…" : "Look Up"}
          </button>
        </form>
        {lookupError && (
          <p className="mt-2 text-sm text-red-600">{lookupError}</p>
        )}
        {lookupData && (
          <div className="mt-4">
            <IPInfoCard data={lookupData} />
          </div>
        )}
      </section>

      {/* Bottom ad slot */}
      <AdSlot id={103} className="min-h-[90px] w-full" />
    </div>
  );
}
