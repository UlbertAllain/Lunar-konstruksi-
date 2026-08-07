import { getNavigationSettingsWithDefaults } from "@/features/navigation/server";
import { getSiteSettingsWithDefaults } from "@/features/site-settings/server";

import { PublicFooter } from "./redesign/public-footer";

export async function SiteFooter() {
  const [navigation, settings] = await Promise.all([
    getNavigationSettingsWithDefaults(),
    getSiteSettingsWithDefaults(),
  ]);

  return <PublicFooter navigation={navigation} settings={settings} />;
}

export default SiteFooter;