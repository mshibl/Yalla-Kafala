/**
 * Site regions. The Egyptian site (eg.) is EGP-only — no USD donation channels —
 * as required by CIB/Paymob. The international site (us.) keeps Givebutter,
 * stock donations, etc. Edge-safe: imported by middleware.
 */
export const REGIONS = ["eg", "us"] as const;
export type Region = (typeof REGIONS)[number];

export const DEFAULT_REGION: Region = "us";
export const REGION_COOKIE = "yk_region";
export const REGION_QUERY_PARAM = "region";

/**
 * Kill switch for the eg./us. subdomains. Leave unset until both subdomains are added in
 * Vercel and their DNS is live; then set NEXT_PUBLIC_REGION_SUBDOMAINS=on and redeploy.
 * While off, the apex keeps serving the site itself (international version by default,
 * `?region=eg` for the Egyptian one) and the region switch uses the query param.
 */
export const REGION_SUBDOMAINS_ENABLED =
  process.env.NEXT_PUBLIC_REGION_SUBDOMAINS === "on";

/** Production root domain. Visitors to the apex are redirected to eg./us. */
export const ROOT_DOMAIN = "yallakafala.org";
const APEX_HOSTS = [ROOT_DOMAIN, `www.${ROOT_DOMAIN}`];

export function isRegion(value: unknown): value is Region {
  return (
    typeof value === "string" && (REGIONS as readonly string[]).includes(value)
  );
}

/** "eg.yallakafala.org" -> "eg". Returns null for apex, previews and localhost. */
export function regionFromHost(host: string): Region | null {
  const h = host.toLowerCase();
  for (const region of REGIONS) {
    if (h === `${region}.${ROOT_DOMAIN}`) return region;
  }
  return null;
}

export function isApexHost(host: string): boolean {
  return APEX_HOSTS.includes(host.toLowerCase());
}

export function isProductionHost(host: string): boolean {
  const h = host.toLowerCase();
  return h === ROOT_DOMAIN || h.endsWith(`.${ROOT_DOMAIN}`);
}

export function regionOrigin(region: Region): string {
  return `https://${region}.${ROOT_DOMAIN}`;
}

/** Country (ISO code from x-vercel-ip-country) -> region. */
export function regionFromCountry(country: string | null | undefined): Region {
  return country?.toUpperCase() === "EG" ? "eg" : "us";
}
