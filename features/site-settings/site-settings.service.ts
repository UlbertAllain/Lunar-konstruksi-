import { DEFAULT_SITE_SETTINGS } from "./site-settings.defaults";
import {
  getSiteSettingsRecord,
  setSiteSettingsRecord,
} from "./site-settings.repository";
import type { SiteSettingsInput } from "./site-settings.types";
import { siteSettingsSchema } from "./site-settings.validator";

export async function getSiteSettings() {
  return getSiteSettingsRecord();
}

export async function getSiteSettingsWithDefaults() {
  return (await getSiteSettingsRecord()) ?? {
    id: "general",
    ...DEFAULT_SITE_SETTINGS,
  };
}

export async function saveSiteSettings(input: SiteSettingsInput) {
  const data = siteSettingsSchema.parse(input) as SiteSettingsInput;

  return setSiteSettingsRecord({
    ...data,
    socialLinks: [...data.socialLinks].sort((a, b) => a.order - b.order),
  });
}

export async function ensureDefaultSiteSettings() {
  const current = await getSiteSettingsRecord();
  if (current) {
    return { created: false, settings: current };
  }

  return {
    created: true,
    settings: await saveSiteSettings(DEFAULT_SITE_SETTINGS),
  };
}
