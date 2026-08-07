import type { CmsSystemPageKey } from "@/features/pages/page.types";
import type { SeoMetadata } from "@/features/seo/seo.types";
import type { SiteSettings } from "@/features/site-settings/site-settings.types";

const PAGE_TITLE_FALLBACKS: Record<CmsSystemPageKey, string> = {
  home: "Lunar Konstruksi",
  about: "Tentang",
  services: "Layanan",
  projects: "Project",
  contact: "Kontak",
};

export function resolvePublicSeo(
  systemKey: CmsSystemPageKey,
  settings: SiteSettings,
  pageSeo?: SeoMetadata,
): SeoMetadata {
  const siteSeo = settings.defaultSeo;
  const siteName = settings.identity.siteName || settings.identity.companyName;
  const fallbackTitle =
    systemKey === "home"
      ? siteName || PAGE_TITLE_FALLBACKS.home
      : `${PAGE_TITLE_FALLBACKS[systemKey]}${siteName ? ` | ${siteName}` : ""}`;

  return {
    title: pageSeo?.title || siteSeo.title || fallbackTitle,
    description:
      pageSeo?.description ||
      siteSeo.description ||
      settings.identity.description ||
      settings.identity.tagline,
    ogImageUrl: pageSeo?.ogImageUrl || siteSeo.ogImageUrl || undefined,
    canonicalUrl: pageSeo?.canonicalUrl || siteSeo.canonicalUrl || undefined,
    noIndex: pageSeo?.noIndex ?? siteSeo.noIndex ?? false,
    noFollow: pageSeo?.noFollow ?? siteSeo.noFollow ?? false,
  };
}
