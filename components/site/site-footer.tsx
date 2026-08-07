import { getNavigationSettingsWithDefaults } from "@/features/navigation/server";
import { getSiteSettingsWithDefaults } from "@/features/site-settings/server";
import { ArchiveFooter } from "./redesign/archive/archive-footer";

export async function SiteFooter(){const [navigation,settings]=await Promise.all([getNavigationSettingsWithDefaults(),getSiteSettingsWithDefaults()]);return <ArchiveFooter navigation={navigation} settings={settings}/>}
export default SiteFooter;
