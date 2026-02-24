# Type Safety Strategy: Eliminating `any` in Frontend API Layer

## Problem

The frontend `services/api.ts` file used `any` extensively for:
- API response types (`Promise<any>`)
- Request options (`const options: any = {}`)
- Error types (`error?: any`)

This caused:
1. **No IntelliSense** — Developers had zero autocomplete or type checking when consuming API results.
2. **Silent runtime errors** — Property access on `any` never fails at compile time, only at runtime.
3. **Poor maintainability** — No way to know what shape the data is without reading the Strapi admin panel.

## Strategy

### Layer 1: Shared Interfaces in `services/api.ts`

We introduced typed interfaces at the service layer boundary:

```typescript
// Strapi error shape — replaces error?: any
interface StrapiError {
    status: number;
    name: string;
    message: string;
    details?: Record<string, unknown>;
}

// Fetch options — replaces options: any
interface FetchOptions {
    method?: string;
    headers?: Record<string, string>;
    body?: string;
}

// Generic Strapi entity — replaces Promise<any> on service methods
export interface StrapiItem {
    id: number;
    documentId?: string;
    attributes?: Record<string, any>;
    [key: string]: any;  // index signature for dynamic Strapi fields
}
```

**Why `StrapiItem` uses `[key: string]: any`:**

Strapi returns dynamic content types that vary per collection (stories have `chapters`, chapters have `images`, etc.). A strict interface per entity would be ideal but impractical given:
- Strapi v4/v5 response format differences (flat vs `{ attributes: {...} }`)
- Multiple content types sharing the same `fetchAPI` call
- Frequent schema changes during development

The `StrapiItem` interface is a **pragmatic middle ground**: it enforces that `id` always exists (which is guaranteed by Strapi), while allowing dynamic field access for collection-specific properties. This is far better than raw `any` because:
- `id` is typed as `number` — no accidental `.id.toString()` on undefined
- `documentId` is typed as `string | undefined` — explicit optionality
- The `any` is **scoped** to the index signature, not spread across every variable

### Layer 2: Typed Consumers (Page Components)

Each page that consumes API data defines its own stricter interfaces:

```typescript
// In page.tsx (Home)
interface ContentItem {
    id: number;
    title: string;
    slug: string;
    cover?: { url: string };
    chapters?: { chapter_number: number; updatedAt: string; title?: string }[];
    // ...
}
```

The API result is cast through `unknown` to the expected shape:
```typescript
return result as unknown as {
    heroSlider: ContentItem[];
    trending: ContentItem[];
    // ...
};
```

**Why cast through `unknown`?** TypeScript requires this when the source and target types don't overlap. `StrapiItem` (from the API) has an index signature; `ContentItem[]` is a strict shape. The double cast `as unknown as T` is the standard TypeScript pattern for this.

### Layer 3: Explicit Populate (Fixing 400 Bad Request)

The `populate=*` wildcard was causing **400 Bad Request** errors on Strapi v5 because it attempts to populate `related` fields on media types, which is disallowed by default.

**Before (broken):**
```typescript
const query = `?filters[slug][$eq]=${slug}&populate=*`;
```

**After (working):**
```typescript
const query = `?filters[slug][$eq]=${slug}`
    + `&populate[cover][fields][0]=url`
    + `&populate[categories][fields][0]=name&populate[categories][fields][1]=slug`
    + `&populate[chapters][fields][0]=title&populate[chapters][fields][1]=slug`
    + `&populate[chapters][fields][2]=chapter_number&populate[chapters][fields][3]=createdAt`;
```

**Benefits:**
1. No more 400 errors — only explicitly listed relations are populated
2. Smaller payloads — we only fetch fields we actually use
3. Self-documenting — the query tells you exactly what data the component needs

### Layer 4: Backend `entityService` Constraints

Strapi's `entityService.findMany()` does **not** support nested populate options like `sort`, `limit`, or `fields` inside populate objects. Only the REST API query string supports those (and even then, `limit` inside populate is not supported in all Strapi versions).

**Broken (entityService):**
```typescript
populate: {
    chapters: {
        sort: 'chapter_number:desc',
        limit: 3,
        fields: ['chapter_number', 'updatedAt']
    }
}
```

**Working (entityService):**
```typescript
populate: ['cover', 'categories', 'chapters']
```

When you need sorted/limited relations, do it in JavaScript after fetching:
```typescript
[...item.chapters]
    .sort((a, b) => b.chapter_number - a.chapter_number)
    .slice(0, 3)
```

## Files Modified

| File | Changes |
|------|---------|
| `src/frontend/src/services/api.ts` | Added `StrapiError`, `FetchOptions`, `StrapiItem` interfaces. Replaced all `any` return types and options types. Replaced `populate=*` with explicit field-level populate. |
| `src/frontend/src/app/page.tsx` | Added typed `ContentItem.chapters` with `updatedAt`. Added `getTranslations` for i18n. Sort chapters client-side before slicing. |
| `src/frontend/src/app/browse/page.tsx` | Replaced `populate=*` with explicit populate. Sort chapters client-side. Added `useFormatter` for relative time. Added `view_count` and `total_chapters` display. |
| `src/frontend/src/app/manga/[slug]/page.tsx` | No changes needed — already consumed `StrapiItem` correctly. |
| `src/backend/src/api/story/services/story.ts` | Reverted complex populate objects to simple arrays for `entityService` compatibility. |
| `src/frontend/src/types/index.ts` | Added `total_chapters` to `Manga` interface. |

## Future Improvements

1. **Per-collection interfaces** — Define `StoryResponse`, `ChapterResponse`, etc. that extend `StrapiItem` with known fields. This would eliminate the index signature `any` for specific endpoints.
2. **Strapi SDK types** — Use `@strapi/types` or auto-generated types from the Strapi schema for full end-to-end type safety.
3. **Zod validation** — Add runtime validation at the API boundary to catch schema mismatches early.
