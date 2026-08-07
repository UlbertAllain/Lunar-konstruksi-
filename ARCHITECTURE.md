# Lunar Konstruksi Architecture

## Phase 1 — Feature-first architecture

Phase 1 reorganizes the existing domain implementation without changing website behavior, API contracts, Firestore collection names, authentication rules, or Cloudinary lifecycle behavior.

### Directory responsibilities

```text
app/
  Next.js routes, layouts, pages, and route handlers.

components/
  Shared presentation components and UI primitives.

features/
  Business/content domains. A feature owns its types, validation, service, and repository.

lib/
  Framework/infrastructure integrations such as Firebase and Cloudinary.

repositories/ services/ types/ validators/ utils/
  Phase-1 compatibility paths. Existing imports continue to work while new code uses features/.
```

### Feature layout

```text
features/projects/
  project.types.ts
  project.validator.ts
  project.service.ts
  project.repository.ts
  index.ts      # client-safe/public domain exports
  server.ts     # repository + server business logic
```

The same pattern is used for Services, Team, Testimonials, and FAQ. Media has separate `client.ts` and `server.ts` entrypoints.

### Import rules

Use client-safe domain exports from the feature root:

```ts
import type { Project } from "@/features/projects";
```

Use server-only business/data functions explicitly from `server`:

```ts
import { listProjects } from "@/features/projects/server";
```

Use media browser helpers from:

```ts
import { uploadImage } from "@/features/media/client";
```

Server upload behavior belongs to:

```ts
import { deleteImagesSafely } from "@/features/media/server";
```

### Dependency direction

```text
app / components
       ↓
features
       ↓
features/shared + lib
       ↓
Firebase / Cloudinary
```

Feature domain code must not import route/page components from `app`. Infrastructure code in `lib` must not import feature UI.

### Compatibility strategy

The old paths are intentionally kept as one-line re-export adapters. This makes Phase 1 safe to apply in one operation and prevents dozens of unrelated route/component files from changing at once. Runtime behavior remains the same.

Small local bridge files (`base.repository.ts`, `common.ts`, and `media.ts`) preserve existing relative imports inside moved source files. They are migration-only files, not new business logic. Later phases can remove them after imports are normalized.

### Phase 1 definition of done

- Domain implementations live under `features/`.
- Shared repository, validation, and slug primitives live under `features/shared/`.
- Media upload client/server code lives under `features/media/`.
- Existing import paths remain compatible.
- No database migration is required.
- No dependency installation is required.
- No public UI or CMS behavior is intentionally changed.
