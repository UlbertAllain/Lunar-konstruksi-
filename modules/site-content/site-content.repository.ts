import { FieldValue } from "firebase-admin/firestore";

import { getAdminDb } from "@/lib/firebase/admin";
import { serializeDocument } from "@/lib/firestore";
import type { SiteContentSettings } from "./site-content.types";

const COLLECTION = "siteSettings";
const DOCUMENT = "publicContent";

export const SITE_CONTENT_DEFAULTS: SiteContentSettings = {
  id: "public",
  homeHero: null,
  servicesHero: null,
  projectsHero: null,
  contactHero: null,
  partners: [],
  officeLocation: {
    name: "Kantor Lunar Konstruksi",
    address: "",
    googleMapsUrl: "",
    googleMapsEmbedUrl: "",
    isVisible: false,
  },
  companyProfile: {
    companyName: "Lunar Konstruksi",
    shortDescription:
      "Perencanaan, koordinasi, dan pekerjaan konstruksi dengan proses yang jelas dari awal sampai serah terima.",
    email: "hello@lunarkonstruksi.id",
    phone: "+62 812 0000 0000",
    whatsapp: "",
    instagramUrl: "",
    linkedinUrl: "",
    copyrightText: "Lunar Konstruksi",
  },
};

export async function getSiteContentSettings(): Promise<SiteContentSettings> {
  const snapshot = await getAdminDb()
    .collection(COLLECTION)
    .doc(DOCUMENT)
    .get();

  if (!snapshot.exists) {
    return SITE_CONTENT_DEFAULTS;
  }

  const data = serializeDocument<
    Omit<SiteContentSettings, "id">
  >(snapshot.id, snapshot.data());

  return {
    ...SITE_CONTENT_DEFAULTS,
    ...data,
    id: "public",
    partners: Array.isArray(data.partners)
      ? data.partners
      : [],
    officeLocation: {
      ...SITE_CONTENT_DEFAULTS.officeLocation,
      ...(data.officeLocation ?? {}),
    },
    companyProfile: {
      ...SITE_CONTENT_DEFAULTS.companyProfile,
      ...(data.companyProfile ?? {}),
    },
  };
}

export async function saveSiteContentSettings(
  data: Partial<
    Omit<
      SiteContentSettings,
      "id" | "createdAt" | "updatedAt"
    >
  >,
) {
  const ref = getAdminDb()
    .collection(COLLECTION)
    .doc(DOCUMENT);

  const exists = (await ref.get()).exists;

  await ref.set(
    {
      ...data,
      ...(exists
        ? {}
        : {
            createdAt:
              FieldValue.serverTimestamp(),
          }),
      updatedAt:
        FieldValue.serverTimestamp(),
    },
    { merge: true },
  );

  return getSiteContentSettings();
}
