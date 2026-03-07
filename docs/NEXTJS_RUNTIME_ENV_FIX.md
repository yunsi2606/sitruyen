# Fix: Client-Side API Calls Falling Back to `localhost` After Azure Deployment

## Problem Statement

After deploying the Next.js frontend to **Azure Container Apps**, API calls on the **home page** worked correctly, but all other pages (Browse, SearchBar, etc.) were sending API requests to `http://localhost:1337` instead of the correct production API URL (`https://api-sitruyen.nhatcuong.io.vn`).

---

## Root Cause Analysis

### The Core Issue: Next.js `NEXT_PUBLIC_*` Build-Time Inlining

Next.js has a specific behavior with environment variables prefixed with `NEXT_PUBLIC_`:

> **All occurrences of `process.env.NEXT_PUBLIC_*` are replaced with their literal values at build time by the Next.js compiler (via Webpack's DefinePlugin), regardless of whether the code runs on the server or the client.**

This means:

```typescript
// What you write:
const url = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";

// What Next.js compiles it to (at build time):
const url = "http://localhost:1337" || "http://localhost:1337";
```

Because the Docker image was built without passing the correct `NEXT_PUBLIC_STRAPI_URL` build argument (or it defaulted to `http://localhost:1337`), **every client-side reference** to this variable was permanently hardcoded to `localhost`.

### Why the Home Page Worked

The home page used **Server Components** (no `"use client"` directive), which called `getStrapiURL()` on the server side. Server-side code correctly used the `STRAPI_INTERNAL_URL` environment variable, which was set at runtime via Docker environment variables and read correctly because:

- Non-`NEXT_PUBLIC_` prefixed variables are **not** inlined by Next.js
- Server-side `process.env` reads the actual runtime environment

### Why Other Pages Failed

Pages like `/browse` and components like `SearchBar` were **Client Components** (`"use client"`). When `getStrapiURL()` ran in the browser:

1. `process.env.NEXT_PUBLIC_STRAPI_URL` had been replaced with `"http://localhost:1337"` at build time
2. The fallback chain also resolved to `localhost`
3. All client-side `fetch()` calls went to `http://localhost:1337` → **network error** in production

### The Trap: Even Server Components Are Affected

A critical and counter-intuitive detail:

> **`process.env.NEXT_PUBLIC_*` is inlined at build time even inside Server Components.**

This means that a Server Component reading `process.env.NEXT_PUBLIC_STRAPI_URL` will still get the build-time value, not the runtime value. This is by design in Next.js — the `NEXT_PUBLIC_` prefix signals to the compiler that this variable should be available on the client, so it inlines it everywhere.

---

## Solution Analysis: Approaches Considered

### ❌ Approach 1: Hardcoded Domain Mapping

```typescript
function getStrapiURL() {
    if (window.location.hostname.includes("nhatcuong.io.vn")) {
        return "https://api-sitruyen.nhatcuong.io.vn";
    }
    // more domains...
}
```

**Why rejected:**
- Not flexible — every new domain requires a code change and rebuild
- Violates the principle of separating configuration from code
- Doesn't scale for multi-environment deployments

### ❌ Approach 2: Pass Correct Build Args

```dockerfile
ARG NEXT_PUBLIC_STRAPI_URL
ENV NEXT_PUBLIC_STRAPI_URL=${NEXT_PUBLIC_STRAPI_URL}
RUN npm run build
```

**Why rejected:**
- Requires rebuilding the Docker image for every environment/domain change
- The same image can't be used across staging and production
- Violates the [12-factor app](https://12factor.net/config) principle of strict separation of config from code

### ❌ Approach 3: Next.js API Route (`/api/config`)

```typescript
// app/api/config/route.ts
export function GET() {
    return Response.json({ strapiUrl: process.env.STRAPI_PUBLIC_URL });
}
```

**Why rejected:**
- Introduces an **async dependency** — `getStrapiURL()` is called synchronously throughout the codebase
- Would require refactoring all consumers to handle async initialization
- Adds an extra network request on every page load
- Race condition risk: API calls might fire before config is fetched

### ✅ Approach 4: Runtime Config via `<script>` Tag Injection (Selected)

Inject runtime environment variables into `window.__ENV__` via a Server Component that renders a `<script>` tag in the HTML `<head>`.

**Why selected:**
- **Synchronous** — `window.__ENV__` is available immediately when client JS runs
- **Runtime configurable** — change env var, restart container, done (no rebuild)
- **Zero refactoring** — `getStrapiURL()` stays synchronous, all consumers unchanged
- **Standard pattern** — widely used in production React/Next.js applications (e.g., GitLab, Grafana)
- **Environment-agnostic images** — same Docker image works in dev, staging, and production

---

## Implementation Details

### Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Container                         │
│                                                             │
│  Environment Variables (runtime):                           │
│    STRAPI_PUBLIC_URL = https://api-sitruyen.nhatcuong.io.vn │
│    STRAPI_INTERNAL_URL = http://strapi:1337                 │
│                                                             │
│  ┌─────────────────────────────────────────────────────┐    │
│  │              Next.js Server (Node.js)               │    │
│  │                                                     │    │
│  │  RuntimeConfig (Server Component)                   │    │
│  │    reads: process.env.STRAPI_PUBLIC_URL              │    │
│  │    outputs: <script>window.__ENV__ = {...}</script>  │    │
│  │                                                     │    │
│  │  Server Components / SSR:                           │    │
│  │    reads: process.env.STRAPI_INTERNAL_URL            │    │
│  └─────────────────┬───────────────────────────────────┘    │
│                     │ HTML response                          │
└─────────────────────┼───────────────────────────────────────┘
                      ▼
┌─────────────────────────────────────────────────────────────┐
│                    Browser (Client)                          │
│                                                             │
│  1. Parse HTML → execute <script> → window.__ENV__ is set   │
│  2. React hydrates → client components mount                │
│  3. getStrapiURL() → reads window.__ENV__.STRAPI_URL        │
│  4. API calls go to correct URL ✅                          │
└─────────────────────────────────────────────────────────────┘
```

### Files Changed

#### 1. `src/components/RuntimeConfig.tsx` (New)

Server Component that injects runtime config into the client. Uses `STRAPI_PUBLIC_URL` instead of `NEXT_PUBLIC_*` to avoid compiler inlining.

#### 2. `src/app/layout.tsx` (Modified)

Added `<RuntimeConfig />` inside `<head>`.

#### 3. `src/lib/api.ts` (Modified)

Updated the URL resolution logic to priority chain: `window.__ENV__.STRAPI_URL` -> process.env fallback -> localhost.

#### 4. `docker/docker-compose.yml` (Modified)

Added `STRAPI_PUBLIC_URL` to the frontend service.

---

## Key Takeaway

> **Never rely on `NEXT_PUBLIC_*` environment variables for runtime configuration in containerized deployments.**
> 
> Next.js inlines all `process.env.NEXT_PUBLIC_*` references at build time. If you need true runtime configuration that can change without rebuilding the image, use a non-prefixed env var and inject it into the client via a Server Component `<script>` tag pattern.
