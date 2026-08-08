import { getNavigationSettingsWithDefaults } from "@/modules/public-site/server";
import { getSiteSettingsWithDefaults } from "@/modules/public-site/server";
import { ArchiveHeader } from "./redesign/archive/archive-header";

export async function SiteHeader() {
  const [navigation, settings] = await Promise.all([
    getNavigationSettingsWithDefaults(),
    getSiteSettingsWithDefaults(),
  ]);
  return <ArchiveHeader navigation={navigation} settings={settings} />;
}
export default SiteHeader;
