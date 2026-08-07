import { getNavigationSettingsWithDefaults } from "@/features/navigation/server";
import { getSiteSettingsWithDefaults } from "@/features/site-settings/server";

import { PublicHeader } from "./redesign/public-header";

export async function SiteHeader() {
  const [navigation, settings] = await Promise.all([
    getNavigationSettingsWithDefaults(),
    getSiteSettingsWithDefaults(),
  ]);

  return <PublicHeader navigation={navigation} settings={settings} />;
}

export default SiteHeader;