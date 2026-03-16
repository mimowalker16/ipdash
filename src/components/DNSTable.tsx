import type { DnsResult } from "@/lib/dnsLookup";
import type dns from "dns";

export default function DNSTable({ result }: { result: DnsResult }) {
  const { type, records } = result;

  // Normalise every record type into an array of display rows.
  function renderRows(): React.ReactNode {
    switch (type) {
      case "A":
      case "AAAA":
      case "CNAME":
      case "NS":
      case "PTR":
        return (records as string[]).map((r, i) => (
          <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-2 font-mono text-sm text-gray-900">{r}</td>
          </tr>
        ));

      case "MX":
        return (records as dns.MxRecord[]).map((r, i) => (
          <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-2 text-sm text-gray-500">{r.priority}</td>
            <td className="px-4 py-2 font-mono text-sm text-gray-900">{r.exchange}</td>
          </tr>
        ));

      case "TXT":
        return (records as string[][]).map((chunks, i) => (
          <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-2 font-mono text-sm text-gray-900 break-all">
              {chunks.join("")}
            </td>
          </tr>
        ));

      case "SOA": {
        const soa = records as dns.SoaRecord;
        return Object.entries(soa).map(([k, v]) => (
          <tr key={k} className="border-t border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-2 text-sm text-gray-500 font-medium">{k}</td>
            <td className="px-4 py-2 font-mono text-sm text-gray-900">{String(v)}</td>
          </tr>
        ));
      }
    }
  }

  const headers =
    type === "MX"
      ? ["Priority", "Mail Server"]
      : type === "SOA"
      ? ["Field", "Value"]
      : ["Value"];

  return (
    <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full">
        <thead className="bg-gray-50 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{renderRows()}</tbody>
      </table>
    </div>
  );
}
