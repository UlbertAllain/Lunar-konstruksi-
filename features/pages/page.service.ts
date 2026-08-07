import { isCmsBlockVariantAllowed } from "@/cms";
import { DomainError } from "@/features/shared/errors/domain-error";

import { DEFAULT_SYSTEM_PAGES, SYSTEM_PAGE_SLUGS } from "./page.defaults";
import {
  createCmsPageRecord,
  deleteCmsPageRecord,
  getCmsPageRecordById,
  getCmsPageRecordBySlug,
  getCmsPageRecordBySystemKey,
  listCmsPageRecords,
  updateCmsPageRecord,
} from "./page.repository";
import type {
  CmsPage,
  CreateCmsPageInput,
  UpdateCmsPageInput,
} from "./page.types";
import { createCmsPageSchema, updateCmsPageSchema } from "./page.validator";

function normalizeSlug(slug: string) {
  return slug.trim().toLowerCase().replace(/^\/+|\/+$/g, "");
}

function normalizeSections(sections: CreateCmsPageInput["sections"]) {
  const ids = new Set<string>();

  const normalized = [...sections]
    .sort((a, b) => a.order - b.order)
    .map((section) => {
      if (ids.has(section.id)) {
        throw new DomainError(
          `ID section \"${section.id}\" digunakan lebih dari sekali.`,
          400,
          "DUPLICATE_SECTION_ID",
        );
      }

      ids.add(section.id);

      if (!isCmsBlockVariantAllowed(section.type, section.variant)) {
        throw new DomainError(
          `Variant \"${section.variant}\" tidak tersedia untuk section ${section.type}.`,
          400,
          "INVALID_SECTION_VARIANT",
        );
      }

      return section;
    });

  return normalized;
}

function enforceSystemRoute(data: CreateCmsPageInput) {
  if (data.pageType === "system") {
    if (!data.systemKey) {
      throw new DomainError(
        "Halaman sistem wajib memiliki systemKey.",
        400,
        "SYSTEM_KEY_REQUIRED",
      );
    }

    const expectedSlug = SYSTEM_PAGE_SLUGS[data.systemKey];
    if (data.slug !== expectedSlug) {
      throw new DomainError(
        `Slug halaman sistem ${data.systemKey} harus \"${expectedSlug}\".`,
        400,
        "SYSTEM_SLUG_LOCKED",
      );
    }
  }

  if (data.pageType === "custom" && data.systemKey) {
    throw new DomainError(
      "Halaman custom tidak boleh memiliki systemKey.",
      400,
      "CUSTOM_PAGE_SYSTEM_KEY",
    );
  }

  if (data.pageType === "custom" && data.slug === "") {
    throw new DomainError(
      "Slug kosong hanya boleh digunakan oleh halaman Home.",
      400,
      "CUSTOM_PAGE_SLUG_REQUIRED",
    );
  }
}

async function assertUniqueRoute(data: CreateCmsPageInput, ignoreId?: string) {
  const slugOwner = await getCmsPageRecordBySlug(data.slug);
  if (slugOwner && slugOwner.id !== ignoreId) {
    throw new DomainError(
      `Slug \"${data.slug || "/"}\" sudah digunakan.`,
      409,
      "PAGE_SLUG_CONFLICT",
    );
  }

  if (data.systemKey) {
    const systemOwner = await getCmsPageRecordBySystemKey(data.systemKey);
    if (systemOwner && systemOwner.id !== ignoreId) {
      throw new DomainError(
        `Halaman sistem ${data.systemKey} sudah tersedia.`,
        409,
        "SYSTEM_PAGE_CONFLICT",
      );
    }
  }
}

function normalizeCreateInput(input: CreateCmsPageInput): CreateCmsPageInput {
  const parsed = createCmsPageSchema.parse({
    ...input,
    slug: normalizeSlug(input.slug),
  }) as CreateCmsPageInput;

  const normalized: CreateCmsPageInput = {
    ...parsed,
    sections: normalizeSections(parsed.sections),
  };

  enforceSystemRoute(normalized);
  return normalized;
}

export async function listCmsPages() {
  return listCmsPageRecords();
}

export async function getCmsPage(id: string) {
  const page = await getCmsPageRecordById(id);
  if (!page) {
    throw new DomainError("Halaman tidak ditemukan.", 404, "PAGE_NOT_FOUND");
  }

  return page;
}

export async function getPublishedCmsPageBySlug(slug: string) {
  const page = await getCmsPageRecordBySlug(normalizeSlug(slug));
  return page?.status === "published" ? page : null;
}

export async function createCmsPage(input: CreateCmsPageInput) {
  const data = normalizeCreateInput(input);
  await assertUniqueRoute(data);
  return createCmsPageRecord(data);
}

export async function updateCmsPage(id: string, input: UpdateCmsPageInput) {
  const current = await getCmsPage(id);
  const parsed = updateCmsPageSchema.parse(input) as UpdateCmsPageInput;

  const merged = normalizeCreateInput({
    title: parsed.title ?? current.title,
    slug: parsed.slug ?? current.slug,
    pageType: parsed.pageType ?? current.pageType,
    systemKey:
      parsed.systemKey !== undefined ? parsed.systemKey : current.systemKey,
    status: parsed.status ?? current.status,
    sections: parsed.sections ?? current.sections,
    seo: parsed.seo ? { ...current.seo, ...parsed.seo } : current.seo,
  });

  if (current.pageType === "system") {
    if (merged.pageType !== "system" || merged.systemKey !== current.systemKey) {
      throw new DomainError(
        "Jenis dan identitas halaman sistem tidak dapat diubah.",
        400,
        "SYSTEM_PAGE_IDENTITY_LOCKED",
      );
    }
  }

  await assertUniqueRoute(merged, id);
  return updateCmsPageRecord(id, merged);
}

export async function deleteCmsPage(id: string) {
  const current = await getCmsPage(id);

  if (current.pageType === "system") {
    throw new DomainError(
      "Halaman sistem tidak dapat dihapus. Nonaktifkan publikasinya jika diperlukan.",
      400,
      "SYSTEM_PAGE_DELETE_BLOCKED",
    );
  }

  return deleteCmsPageRecord(id);
}

export async function ensureDefaultSystemPages() {
  const created: CmsPage[] = [];
  const existing: CmsPage[] = [];

  for (const defaultPage of DEFAULT_SYSTEM_PAGES) {
    const page = defaultPage.systemKey
      ? await getCmsPageRecordBySystemKey(defaultPage.systemKey)
      : null;

    if (page) {
      existing.push(page);
      continue;
    }

    created.push(await createCmsPage(defaultPage));
  }

  return { created, existing };
}
