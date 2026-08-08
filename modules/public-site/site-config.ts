import { getAdminDb } from "@/lib/firebase/admin";
import { serializeDocument } from "@/lib/firestore";

import type { NavigationItem, NavigationSettings, SiteSettings } from "./public-site.types";

function navigationItem(id: string, label: string, href: string, order: number): NavigationItem {
  return {
    id,
    label,
    href,
    target: "internal",
    openInNewTab: false,
    isVisible: true,
    order,
    children: [],
  };
}

const DEFAULT_NAVIGATION: NavigationSettings = {
  id: "main",
  header: [
    navigationItem("nav-services", "Layanan", "/services", 10),
    navigationItem("nav-projects", "Portfolio", "/projects", 20),
    navigationItem("nav-about", "Tentang", "/about", 30),
    navigationItem("nav-contact", "Kontak", "/contact", 40),
  ],
  footerPrimary: [
    navigationItem("footer-home", "Beranda", "/", 10),
    navigationItem("footer-services", "Layanan", "/services", 20),
    navigationItem("footer-projects", "Portfolio", "/projects", 30),
    navigationItem("footer-about", "Tentang", "/about", 40),
    navigationItem("footer-contact", "Kontak", "/contact", 50),
  ],
  footerSecondary: [],
};

const DEFAULT_SETTINGS: SiteSettings = {
  id: "general",
  identity: {
    siteName: "Lunar Konstruksi",
    companyName: "Lunar Konstruksi",
    tagline: "",
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

async function readSingleton<T>(collection: string, documentId: string) {
  const snapshot = await getAdminDb().collection(collection).doc(documentId).get();
  if (!snapshot.exists) return null;
  return serializeDocument<T>(snapshot.id, snapshot.data());
}

export async function getNavigationSettingsWithDefaults(): Promise<NavigationSettings> {
  return (await readSingleton<NavigationSettings>("navigation", "main")) ?? DEFAULT_NAVIGATION;
}

export async function getSiteSettingsWithDefaults(): Promise<SiteSettings> {
  const saved = await readSingleton<SiteSettings>("siteSettings", "general");
  if (!saved) return DEFAULT_SETTINGS;

  return {
    ...DEFAULT_SETTINGS,
    ...saved,
    identity: { ...DEFAULT_SETTINGS.identity, ...saved.identity },
    contact: { ...DEFAULT_SETTINGS.contact, ...saved.contact },
    footer: { ...DEFAULT_SETTINGS.footer, ...saved.footer },
    defaultSeo: { ...DEFAULT_SETTINGS.defaultSeo, ...saved.defaultSeo },
    socialLinks: Array.isArray(saved.socialLinks) ? saved.socialLinks : [],
  };
}
