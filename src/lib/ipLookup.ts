export interface IpApiResponse {
  status: "success" | "fail";
  message?: string;
  query: string;
  country?: string;
  countryCode?: string;
  region?: string;
  regionName?: string;
  city?: string;
  zip?: string;
  lat?: number;
  lon?: number;
  timezone?: string;
  isp?: string;
  org?: string;
  as?: string;
  asname?: string;
  reverse?: string;
  mobile?: boolean;
  proxy?: boolean;
  hosting?: boolean;
}

const FIELDS =
  "status,message,query,country,countryCode,region,regionName,city,zip,lat,lon,timezone,isp,org,as,asname,reverse,mobile,proxy,hosting";

export async function lookupIp(ip: string): Promise<IpApiResponse> {
  const key = process.env.IP_API_KEY;
  // Use HTTPS endpoint when a Pro key is present, plain HTTP on free tier.
  const protocol = key ? "https" : "http";
  const keyParam = key ? `?key=${encodeURIComponent(key)}&fields=${FIELDS}` : `?fields=${FIELDS}`;
  const url = `${protocol}://ip-api.com/json/${encodeURIComponent(ip)}${keyParam}`;

  const res = await fetch(url, {
    // Cache for 5 minutes — same IP is unlikely to change location mid-session.
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`ip-api.com returned HTTP ${res.status}`);
  }

  return res.json() as Promise<IpApiResponse>;
}
