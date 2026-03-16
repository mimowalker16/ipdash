import type { IpApiResponse } from "@/lib/ipLookup";

const flagUrl = (code: string) =>
  `https://flagcdn.com/24x18/${code.toLowerCase()}.png`;

interface Row {
  label: string;
  value: React.ReactNode;
}

export default function IPInfoCard({ data }: { data: IpApiResponse }) {
  if (data.status === "fail") {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
        Could not look up this IP address: {data.message ?? "unknown error"}
      </div>
    );
  }

  const rows: Row[] = [
    { label: "IP Address", value: <span className="font-mono font-semibold">{data.query}</span> },
    {
      label: "Country",
      value: data.countryCode ? (
        <span className="inline-flex items-center gap-2">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={flagUrl(data.countryCode)}
            alt={data.country ?? data.countryCode}
            width={24}
            height={18}
            className="rounded-sm"
          />
          {data.country}
        </span>
      ) : (
        "—"
      ),
    },
    { label: "Region", value: data.regionName ?? "—" },
    { label: "City", value: data.city ?? "—" },
    { label: "ZIP / Postal", value: data.zip || "—" },
    { label: "Timezone", value: data.timezone ?? "—" },
    {
      label: "Coordinates",
      value:
        data.lat != null && data.lon != null
          ? `${data.lat.toFixed(4)}, ${data.lon.toFixed(4)}`
          : "—",
    },
    { label: "ISP", value: data.isp ?? "—" },
    { label: "Organisation", value: data.org ?? "—" },
    { label: "AS Number", value: data.as ?? "—" },
    { label: "AS Name", value: data.asname ?? "—" },
    { label: "Hostname / rDNS", value: data.reverse || "—" },
    {
      label: "Connection",
      value: [
        data.mobile && "Mobile",
        data.proxy && "Proxy / VPN",
        data.hosting && "Data-centre / Hosting",
      ]
        .filter(Boolean)
        .join(", ") || "Residential",
    },
  ];

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-100 bg-indigo-50 px-6 py-4">
        <p className="text-xs font-medium uppercase tracking-widest text-indigo-500">
          Your IP Address
        </p>
        <p className="mt-1 font-mono text-3xl font-bold text-gray-900">
          {data.query}
        </p>
      </div>
      <dl className="divide-y divide-gray-100">
        {rows.map(({ label, value }) => (
          <div key={label} className="flex items-center gap-4 px-6 py-3">
            <dt className="w-40 shrink-0 text-sm text-gray-500">{label}</dt>
            <dd className="text-sm text-gray-900">{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
