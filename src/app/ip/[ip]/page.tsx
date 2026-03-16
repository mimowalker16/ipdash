import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { lookupIp } from "@/lib/ipLookup";
import IPInfoCard from "@/components/IPInfoCard";
import AdSlot from "@/components/AdSlot";
import Link from "next/link";

interface Props {
  params: Promise<{ ip: string }>;
}

const IPV4_RE =
  /^((25[0-5]|2[0-4]\d|[01]?\d\d?)\.){3}(25[0-5]|2[0-4]\d|[01]?\d\d?)$/;
const IPV6_RE = /^[0-9a-fA-F:]{2,39}$/;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { ip } = await params;
  return {
    title: `IP Lookup: ${ip}`,
    description: `Geolocation, ISP, ASN, and network information for IP address ${ip}.`,
    alternates: { canonical: `/ip/${ip}` },
  };
}

export default async function IpDetailPage({ params }: Props) {
  const { ip } = await params;

  if (!IPV4_RE.test(ip) && !IPV6_RE.test(ip)) {
    notFound();
  }

  const data = await lookupIp(ip);

  if (data.status === "fail") {
    notFound();
  }

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-gray-500">
          <Link href="/" className="hover:text-indigo-600">
            IP Lookup
          </Link>{" "}
          &rsaquo; {ip}
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          IP Address: {ip}
        </h1>
        <p className="mt-2 text-gray-500">
          Geolocation, ISP, ASN, and network details for {ip}.
        </p>
      </div>

      <AdSlot id={301} className="min-h-[90px] w-full" />

      <IPInfoCard data={data} />

      <AdSlot id={302} className="min-h-[250px] w-full" />
    </div>
  );
}
