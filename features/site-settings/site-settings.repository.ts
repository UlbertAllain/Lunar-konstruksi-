import {
  getSingletonDocument,
  setSingletonDocument,
} from "@/features/shared/data/singleton.repository";

import type { SiteSettings, SiteSettingsInput } from "./site-settings.types";

const COLLECTION = "siteSettings";
const DOCUMENT_ID = "general";

export function getSiteSettingsRecord() {
  return getSingletonDocument<SiteSettings>(COLLECTION, DOCUMENT_ID);
}

export function setSiteSettingsRecord(data: SiteSettingsInput) {
  return setSingletonDocument<SiteSettingsInput>(COLLECTION, DOCUMENT_ID, data);
}
