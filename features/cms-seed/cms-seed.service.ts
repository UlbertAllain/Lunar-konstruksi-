import { saveNavigationSettings } from "@/features/navigation/server";
import {
  ensureDefaultSystemPages,
  getCmsPageRecordBySystemKey,
  updateCmsPage,
} from "@/features/pages/server";
import {
  getSiteSettingsWithDefaults,
  saveSiteSettings,
} from "@/features/site-settings/server";

import { LUNAR_NAVIGATION_SEED, LUNAR_PAGE_SEED } from "./cms-seed.data";

export async function seedLunarCms() {
  await ensureDefaultSystemPages();

  const updatedPages = [] as string[];
  for (const systemKey of ["home", "about", "services", "projects", "contact"] as const) {
    const current = await getCmsPageRecordBySystemKey(systemKey);
    if (!current) continue;

    await updateCmsPage(current.id, LUNAR_PAGE_SEED[systemKey]);
    updatedPages.push(systemKey);
  }

  await saveNavigationSettings(LUNAR_NAVIGATION_SEED);

  const currentSettings = await getSiteSettingsWithDefaults();
  await saveSiteSettings({
    identity: {
      ...currentSettings.identity,
      siteName: currentSettings.identity.siteName || "Lunar Konstruksi",
      companyName: currentSettings.identity.companyName || "Lunar Konstruksi",
      tagline: "Architecture · Interior · Construction",
      description:
        "Lunar Konstruksi menangani perancangan, interior, renovasi, pembangunan, dan koordinasi proyek melalui proses yang terukur dari konsep sampai penyelesaian.",
    },
    contact: currentSettings.contact,
    socialLinks: currentSettings.socialLinks,
    footer: {
      ...currentSettings.footer,
      shortDescription:
        "Architecture, interior, renovation, construction, dan project coordination dengan proses kerja yang jelas dan terukur.",
      copyrightText:
        currentSettings.footer.copyrightText || "Lunar Konstruksi. All rights reserved.",
    },
    defaultSeo: {
      ...currentSettings.defaultSeo,
      title: "Lunar Konstruksi | Architecture, Interior & Construction",
      description:
        "Lunar Konstruksi menyediakan layanan architecture, interior, renovation, construction, dan project coordination dengan proses kerja yang terukur.",
      noIndex: false,
      noFollow: false,
    },
  });

  return {
    seeded: true,
    pages: updatedPages,
    navigation: true,
    siteSettings: true,
    note:
      "Seed mengisi dan mem-publish struktur semua halaman CMS. Data Services, Projects, Team, Testimonials, dan FAQ tidak ditimpa karena merupakan koleksi konten terpisah.",
  };
}
