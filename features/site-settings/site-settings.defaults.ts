import type { SiteSettingsInput } from "./site-settings.types";

export const DEFAULT_SITE_SETTINGS: SiteSettingsInput = {
  identity: {
    siteName: "Lunar Konstruksi",
    companyName: "Lunar Konstruksi",
    tagline: "Build with clarity.",
    description: "",
    logoUrl: "",
    logoDarkUrl: "",
    faviconUrl: "",
  },
  contact: {
    email: "",
    phone: "",
    whatsapp: "",
    address: "",
    city: "",
    province: "",
    postalCode: "",
    mapsUrl: "",
  },
  socialLinks: [],
  footer: {
    shortDescription: "",
    copyrightText: "Lunar Konstruksi. All rights reserved.",
  },
  defaultSeo: {
    title: "Lunar Konstruksi",
    description: "",
    ogImageUrl: "",
    canonicalUrl: "",
    noIndex: false,
    noFollow: false,
  },
};
