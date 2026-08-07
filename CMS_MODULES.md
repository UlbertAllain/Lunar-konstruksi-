# Lunar Konstruksi — Existing CMS Modules

Phase 3 connects the existing content domains from Phase 1 with the controlled CMS foundation from Phase 2.

## Single source of truth

`features/content/content.registry.ts` is now the canonical description of content collections that can feed CMS page sections.

| Module | Firestore | Lifecycle | Public detail | Media | CMS block |
| --- | --- | --- | --- | --- | --- |
| Services | `services` | activation | yes | yes | `services` |
| Projects | `projects` | publication | yes | yes | `projects` |
| Team | `team` | activation | no | yes | `team` |
| Testimonials | `testimonials` | activation | no | yes | `testimonials` |
| FAQ | `faqs` | activation | no | no | `faq` |

Do not duplicate this metadata in future sidebar, dashboard, page editor, or renderer code. Read it from the registry instead.

## CMS block source contract

Collection-backed CMS blocks have an expected source:

```text
services      -> services
projects      -> projects
team          -> team
testimonials  -> testimonials
faq           -> faqs
```

`resolveCmsBlockSource()` resolves the canonical source. If a payload explicitly provides a different source, validation fails. Missing `content.source` is still accepted for backward compatibility and resolves to the registered source at runtime.

## Admin discovery API

Two authenticated read-only endpoints are available for the future CMS editor UI:

```text
GET /api/admin/cms/modules
GET /api/admin/cms/blocks
```

The first returns the existing content module definitions. The second returns the available controlled section definitions and design variants.

## Architectural rule after Phase 3

- `features/projects`, `features/services`, `features/team`, `features/testimonials`, and `features/faqs` remain the owners of their business data and CRUD logic.
- `features/content` describes how those domains participate in the CMS.
- `cms/blocks` describes page-section behavior and design variants.
- Page documents reference domains through canonical content sources; they do not know repository implementation details.
- Future public rendering must resolve content through these contracts instead of hardcoding collection names in components.

Phase 3 intentionally does not switch the current public pages to the new CMS. That remains Phase 4 so the public migration can be tested independently.
