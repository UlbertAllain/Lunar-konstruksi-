import { DomainError } from "@/features/shared/errors/domain-error";

import { DEFAULT_NAVIGATION_SETTINGS } from "./navigation.defaults";
import {
  getNavigationSettingsRecord,
  setNavigationSettingsRecord,
} from "./navigation.repository";
import type {
  NavigationItem,
  NavigationSettingsInput,
} from "./navigation.types";
import { navigationSettingsSchema } from "./navigation.validator";

function normalizeItems(items: NavigationItem[]) {
  return [...items]
    .sort((a, b) => a.order - b.order)
    .map((item) => ({
      ...item,
      children: [...item.children].sort((a, b) => a.order - b.order),
    }));
}

function assertUniqueNavigationIds(input: NavigationSettingsInput) {
  const ids = new Set<string>();

  const visit = (item: NavigationItem) => {
    if (ids.has(item.id)) {
      throw new DomainError(
        `ID navigasi \"${item.id}\" digunakan lebih dari sekali.`,
        400,
        "DUPLICATE_NAVIGATION_ID",
      );
    }

    ids.add(item.id);

    for (const child of item.children) {
      if (ids.has(child.id)) {
        throw new DomainError(
          `ID navigasi \"${child.id}\" digunakan lebih dari sekali.`,
          400,
          "DUPLICATE_NAVIGATION_ID",
        );
      }
      ids.add(child.id);
    }
  };

  input.header.forEach(visit);
  input.footerPrimary.forEach(visit);
  input.footerSecondary.forEach(visit);
}

export async function getNavigationSettings() {
  return getNavigationSettingsRecord();
}

export async function getNavigationSettingsWithDefaults() {
  return (await getNavigationSettingsRecord()) ?? {
    id: "main",
    ...DEFAULT_NAVIGATION_SETTINGS,
  };
}

export async function saveNavigationSettings(input: NavigationSettingsInput) {
  const data = navigationSettingsSchema.parse(input) as NavigationSettingsInput;
  assertUniqueNavigationIds(data);

  return setNavigationSettingsRecord({
    header: normalizeItems(data.header),
    footerPrimary: normalizeItems(data.footerPrimary),
    footerSecondary: normalizeItems(data.footerSecondary),
  });
}

export async function ensureDefaultNavigationSettings() {
  const current = await getNavigationSettingsRecord();
  if (current) {
    return { created: false, navigation: current };
  }

  return {
    created: true,
    navigation: await saveNavigationSettings(DEFAULT_NAVIGATION_SETTINGS),
  };
}
