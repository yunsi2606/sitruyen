# Strapi v4 Data Mapping Guide

This document explains the issue with inconsistent response structures in Strapi v4 when populating relations, and the robust solution we implemented in the frontend.

## 🚨 The Problem

Strapi v4's API response structure changes dynamically based on how you construct your `populate` query:

1.  **Wildcard Population (`populate=*`)**:
    - Returns relations as a **flat array** directly attached to the parent attribute.
    - Example: `categories: [{ id: 1, attributes: {...} }]`

2.  **Specific Field Population (`populate[relation][fields]=...`)**:
    - Returns relations wrapped in a `{ data: [...] }` object.
    - Example: `categories: { data: [{ id: 1, attributes: {...} }] }`

This inconsistency causes frontend crashes (e.g., `map is not a function`, `undefined`) if the query string is modified, making the application fragile.

## ✅ The Solution: Flexible Mapping Pattern

We have implemented a robust mapping pattern that automatically detects and handles both structures. This ensures the frontend never breaks, regardless of how the backend query is constructed.

### Core Logic

```typescript
const safeRelationData = Array.isArray(originalData) 
    ? originalData 
    : (originalData?.data || []);
```

### Implementation Example

In `src/frontend/src/app/manga/[slug]/page.tsx`:

```typescript
// BEFORE: Fragile code that assumes one structure
// genres: attributes.categories.data.map(...) // Crashes on wildcard populate

// AFTER: Robust code that handles both cases
genres: (Array.isArray(attributes.categories) 
    ? attributes.categories 
    : attributes.categories?.data || [])
    .map((c: any) => c.attributes?.name || c.name)
    .filter(Boolean) || [],

chapters: (Array.isArray(attributes.chapters) 
    ? attributes.chapters 
    : attributes.chapters?.data || [])
    .map((c: any) => {
        // Handle both flattened and nested attributes
        const attrs = c.attributes || c; 
        return {
            id: c.id.toString(),
            title: attrs.title, // Works for both structures
            slug: attrs.slug,
            number: attrs.chapter_number,
            view_count: attrs.view_count ? Number(attrs.view_count) : 0,
            // ...
        };
    }) || []
```

## 🔑 Key Takeaways

1.  **Always Check Array**: Never assume a relation is an array or an object. Check `Array.isArray()`.
2.  **Fallback to Empty Array**: Always use `|| []` to prevent `map` errors on null/undefined.
3.  **Handle Attributes**: Strapi sometimes unwraps attributes (in certain plugin responses) and sometimes keeps them nested. Use `const attrs = c.attributes || c;` to be safe.
4.  **Filter Boolean**: Use `.filter(Boolean)` after mapping to remove any `null` or `undefined` entries caused by missing data.

This pattern should be used for **all** Strapi relation mappings in the project to ensure stability.
