import {
  getSingletonDocument,
  setSingletonDocument,
} from "@/features/shared/data/singleton.repository";

import type {
  NavigationSettings,
  NavigationSettingsInput,
} from "./navigation.types";

const COLLECTION = "navigation";
const DOCUMENT_ID = "main";

export function getNavigationSettingsRecord() {
  return getSingletonDocument<NavigationSettings>(COLLECTION, DOCUMENT_ID);
}

export function setNavigationSettingsRecord(data: NavigationSettingsInput) {
  return setSingletonDocument<NavigationSettingsInput>(COLLECTION, DOCUMENT_ID, data);
}
