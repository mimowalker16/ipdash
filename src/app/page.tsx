import type { Metadata } from "next";
import IPDetector from "@/components/IPDetector";

export const metadata: Metadata = {
  title: "What Is My IP Address? — Free IP Lookup",
  description:
    "Find your public IP address instantly. See your location, ISP, ASN, hostname, and more. Look up any IPv4 or IPv6 address for free.",
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          What Is My IP Address?
        </h1>
        <p className="mt-2 text-gray-500">
          Your public IP address, geolocation, ISP, and network info — instantly.
        </p>
      </div>

      {/* JSON-LD structured data for the tool */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            name: "IPDash — IP Address Lookup",
            url: process.env.NEXT_PUBLIC_SITE_URL,
            description:
              "Free tool to find your IP address, location, ISP, ASN, and run DNS lookups.",
            applicationCategory: "UtilitiesApplication",
            operatingSystem: "Any",
            offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          }),
        }}
      />

      <IPDetector />
    </div>
  );
}

