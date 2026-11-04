/**
 * Official Yalla Kafala contact details.
 * Single source of truth for the footer, donate page and policy pages
 * (required by CIB / Paymob for online payment approval).
 */

export const officialContact = {
  email: "info@yallakafala.org",
  /**
   * Official contact phone in E.164 form (e.g. "+201XXXXXXXXX").
   * TODO: fill in the official YK number — it is hidden everywhere while empty.
   */
  phone: "",
  address: {
    en: "24 Al Lasilki Al Sagheer Street, New Maadi, Cairo, Egypt.",
    ar: "٢٤ شارع اللاسلكي الصغير، المعادي الجديدة، القاهرة، مصر",
  },
  mapUrl: "https://maps.app.goo.gl/d24Rt7cnGfYYkSyq8?g_st=ic",
} as const;

export const hasOfficialPhone = officialContact.phone.trim().length > 0;
