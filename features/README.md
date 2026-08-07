# Feature Modules

`features/` is the primary home for Lunar Konstruksi business domains.

## Entry points

- `@/features/<domain>`: types and client-safe validation.
- `@/features/<domain>/server`: repositories and server business logic.
- `@/features/media/client`: browser upload helper.
- `@/features/media/server`: Cloudinary/server media operations.
- `@/features/shared`: generic shared domain utilities.

Avoid importing internal feature files from unrelated features. Prefer the documented entrypoint.

The tiny compatibility bridge files are temporary structural adapters for Phase 1. They contain no business logic.
