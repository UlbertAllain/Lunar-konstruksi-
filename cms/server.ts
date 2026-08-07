import { ensureDefaultNavigationSettings } from "@/features/navigation/server";
import { ensureDefaultSystemPages } from "@/features/pages/server";
import { ensureDefaultSiteSettings } from "@/features/site-settings/server";

export async function ensureCmsFoundation() {
  const [settings, navigation, pages] = await Promise.all([
    ensureDefaultSiteSettings(),
    ensureDefaultNavigationSettings(),
    ensureDefaultSystemPages(),
  ]);

  return {
    settings,
    navigation,
    pages: {
      created: pages.created.map((page) => ({ id: page.id, systemKey: page.systemKey })),
      existing: pages.existing.map((page) => ({
        id: page.id,
        systemKey: page.systemKey,
      })),
    },
  };
}
