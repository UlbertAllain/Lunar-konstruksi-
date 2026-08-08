import { getNavigationSettingsWithDefaults } from "@/modules/public-site/server";
import { getSiteSettingsWithDefaults } from "@/modules/public-site/server";
import { ArchiveFooter } from "./redesign/archive/archive-footer";

export async function SiteFooter(){const [navigation,settings]=await Promise.all([getNavigationSettingsWithDefaults(),getSiteSettingsWithDefaults()]);return <ArchiveFooter navigation={navigation} settings={settings}/>}
export default SiteFooter;
