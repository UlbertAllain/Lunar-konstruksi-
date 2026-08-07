import type {
  NavigationItem,
  NavigationSettingsInput,
} from "./navigation.types";

function item(id: string, label: string, href: string, order: number): NavigationItem {
  return {
    id,
    label,
    href,
    target: "internal",
    openInNewTab: false,
    isVisible: true,
    order,
    children: [],
  };
}

export const DEFAULT_NAVIGATION_SETTINGS: NavigationSettingsInput = {
  header: [
    item("nav-services", "Layanan", "/services", 10),
    item("nav-projects", "Portfolio", "/projects", 20),
    item("nav-about", "Tentang", "/about", 30),
    item("nav-contact", "Kontak", "/contact", 40),
  ],
  footerPrimary: [
    item("footer-home", "Beranda", "/", 10),
    item("footer-services", "Layanan", "/services", 20),
    item("footer-projects", "Portfolio", "/projects", 30),
    item("footer-about", "Tentang", "/about", 40),
    item("footer-contact", "Kontak", "/contact", 50),
  ],
  footerSecondary: [],
};
