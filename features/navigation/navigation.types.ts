export type NavigationTarget = "internal" | "external";

export interface NavigationChildItem {
  id: string;
  label: string;
  href: string;
  target: NavigationTarget;
  openInNewTab: boolean;
  isVisible: boolean;
  order: number;
}

export interface NavigationItem extends NavigationChildItem {
  children: NavigationChildItem[];
}

export interface NavigationSettings {
  id: string;
  header: NavigationItem[];
  footerPrimary: NavigationItem[];
  footerSecondary: NavigationItem[];
  createdAt?: string;
  updatedAt?: string;
}

export type NavigationSettingsInput = Omit<
  NavigationSettings,
  "id" | "createdAt" | "updatedAt"
>;
