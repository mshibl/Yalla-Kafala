import type { Region } from "@/lib/region";

/**
 * Official Yalla Kafala contact details.
 * Single source of truth for the footer, donate page and policy pages
 * (required by CIB / Paymob for online payment approval).
 */

export const officialContact = {
  email: "info@yallakafala.org",
  /** Official contact phone in E.164 form. Hidden everywhere if left empty. */
  phone: "+201208889506",
  /** Human-friendly rendering of `phone`. */
  phoneDisplay: "+20 120 888 9506",
  /** WhatsApp chat link for the official number (wa.me takes digits only). */
  whatsappUrl: "https://wa.me/201208889506",
} as const;

/** Office address shown on each site: Cairo on eg., Concord (CA) on us. */
export const officeAddresses: Record<
  Region,
  { text: { en: string; ar: string }; mapUrl: string }
> = {
  eg: {
    text: {
      en: "24 Al Lasilki Al Sagheer Street, New Maadi, Cairo, Egypt.",
      ar: "24 شارع اللاسلكي الصغير، المعادي الجديدة، القاهرة، مصر",
    },
    mapUrl: "https://maps.app.goo.gl/d24Rt7cnGfYYkSyq8?g_st=ic",
  },
  us: {
    text: {
      en: "5100 Clayton Rd, Suite B1, Concord, CA 94521, USA",
      ar: "5100 Clayton Rd, Suite B1, Concord, CA 94521, USA",
    },
    mapUrl:
      "https://www.google.com/maps/search/?api=1&query=5100+Clayton+Rd+Suite+B1+Concord+CA+94521",
  },
};

export const hasOfficialPhone = officialContact.phone.trim().length > 0;
