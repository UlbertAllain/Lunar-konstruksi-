# Lunar Konstruksi — CMS Foundation

Phase 2 adds the data and API foundation for a controlled full CMS. It does not redesign the public website and does not replace the existing Services, Projects, Team, Testimonials, or FAQ modules yet.

## Collections

```text
cmsPages/{autoId}
siteSettings/general
navigation/main
```

`cmsPages` stores system/custom pages, publication status, SEO metadata, and ordered page sections. `siteSettings/general` stores global company identity/contact/footer/SEO settings. `navigation/main` stores header and footer navigation.

Existing Firebase Admin server access remains the only database write path. No browser-side Firestore access is introduced.

## Controlled section model

Each page contains ordered sections:

```ts
{
  id: "home-projects",
  type: "projects",
  variant: "las-grid",
  isVisible: true,
  order: 40,
  content: {
    source: "projects",
    featuredOnly: true,
    limit: 6
  }
}
```

Section types and allowed design variants are registered in `cms/blocks/registry.ts`. Invalid variants are rejected by the service layer. This prevents the CMS from storing layout variants the frontend does not know how to render.

## Protected system pages

The following routes are treated as system pages:

| Key | Slug |
| --- | --- |
| home | `` |
| about | `about` |
| services | `services` |
| projects | `projects` |
| contact | `contact` |

A system page cannot be deleted, converted to a custom page, or moved to a different slug. It can be kept as draft/unpublished.

## Admin API

All endpoints require the existing Firebase admin bearer token through `requireAdmin()`.

```text
GET    /api/admin/cms/pages
POST   /api/admin/cms/pages
GET    /api/admin/cms/pages/:id
PATCH  /api/admin/cms/pages/:id
DELETE /api/admin/cms/pages/:id

GET    /api/admin/cms/settings
PUT    /api/admin/cms/settings

GET    /api/admin/cms/navigation
PUT    /api/admin/cms/navigation

POST   /api/admin/cms/bootstrap
```

`POST /api/admin/cms/bootstrap` is idempotent. It creates the default site settings, navigation, and five draft system pages only when they do not already exist.

## What Phase 2 intentionally does not do

- It does not switch public pages to the new CMS yet. That belongs to the public data architecture phase.
- It does not migrate hardcoded homepage copy into Firestore yet.
- It does not replace the existing content modules yet.
- It does not add the CMS editor UI yet.
- It does not add new npm dependencies.

This separation keeps the rollout reversible and prevents the current public website from breaking while the CMS foundation is introduced.

## Phase 3: content module registry

Existing CRUD domains are now registered as controlled CMS content sources through `features/content/content.registry.ts`. Collection-backed block definitions also expose their canonical source, so future page editors and public renderers do not need to duplicate collection mapping rules.

Authenticated discovery endpoints:

```text
GET /api/admin/cms/modules
GET /api/admin/cms/blocks
```

See `CMS_MODULES.md` for the module contract.
