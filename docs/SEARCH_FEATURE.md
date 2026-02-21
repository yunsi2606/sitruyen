# 🔍 Advanced Search Engine – SiTruyen

> **Commit:** `feat: implement supercharged search system with Meilisearch & Redis`
> **Date:** 2026-02-21
> **Author:** SiTruyen Team

---

## 📋 Table of Contents

1. [Why a New Search Engine?](#why-a-new-search-engine)
2. [High-Level Architecture](#high-level-architecture)
3. [Key Features](#key-features)
4. [Backend API Reference](#backend-api-reference)
5. [Frontend Components](#frontend-components)
6. [Installation & Setup](#installation--setup)
7. [Advanced Configuration](#advanced-configuration)
8. [Fallback & Fault Tolerance](#fallback--fault-tolerance)

---

## Why a New Search Engine?

### The Legacy Issues
- **Static Search Input**: The header search was purely decorative with no actual logic.
- **Basic Filtering**: The browse page relied on Strapi's `$containsi` operator—limited to exact substring matching, lacking fuzzy search or typo tolerance.
- **No Suggestions**: Users had to type titles exactly; no real-time autocomplete was available.
- **No Insights**: No way to track what users were searching for or what's currently trending.
- **Suboptimal SEO**: Manga page titles only showed the story name, missing crucial "latest chapter" information.

### The Solution
A 3-tier search infrastructure designed for speed and reliability:

| Tier | Technology | Role |
|------|-----------|---------|
| **Full-text Search** | Meilisearch | Lightning-fast, fuzzy, typo-tolerant, with smart ranking. |
| **Hot Search** | Redis Sorted Set | Real-time tracking and display of trending keywords. |
| **Fault Tolerance** | Strapi DB (PostgreSQL) | Automatic fallback when Meilisearch or Redis is unavailable. |

---

## High-Level Architecture

```
┌──────────────────────────────────────────────────────────────┐
│                        USER (Browser)                        │
│                                                              │
│  ┌─────────────────────────────────────────────────────────┐ │
│  │  SearchBar Component (Header / Hero)                    │ │
│  │  - Typing → 280ms debounce → calls /autocomplete        │ │
│  │  - Focus → calls /hot-searches                         │ │
│  │  - Enter/Click → navigates to /browse?q=...            │ │
│  │  - Fire-and-forget → POST /search-log                   │ │
│  └──────────────────────┬──────────────────────────────────┘ │
└─────────────────────────┼────────────────────────────────────┘
                          │ HTTP
                          ▼
┌──────────────────────────────────────────────────────────────┐
│                    Strapi Backend (API)                       │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────────────┐  │
│  │ /search      │  │ /autocomplete│  │ /hot-searches     │  │
│  │              │  │              │  │                   │  │
│  │ Full-text    │  │ Quick suggest│  │ Top keywords      │  │
│  │ + Filters    │  │ sort by views│  │ from Redis        │  │
│  └──────┬───────┘  └──────┬───────┘  └────────┬──────────┘  │
│         │                 │                    │             │
│         ▼                 ▼                    ▼             │
│  ┌─────────────┐   ┌─────────────┐      ┌──────────┐       │
│  │ Meilisearch │   │ Meilisearch │      │  Redis   │       │
│  │ (Primary)   │   │ (Primary)   │      │ ZSET     │       │
│  └──────┬──────┘   └──────┬──────┘      └──────────┘       │
│         │ fail?           │ fail?                            │
│         ▼                 ▼                                  │
│  ┌─────────────┐   ┌─────────────┐                          │
│  │ Strapi DB   │   │ Strapi DB   │   ← Automatic Fallback  │
│  │ $containsi  │   │ $containsi  │                          │
│  └─────────────┘   └─────────────┘                          │
└──────────────────────────────────────────────────────────────┘
```

---

## Key Features

### 1️⃣ Autocomplete (Search Suggestions)

Triggered when the user types ≥ 2 characters, returning the top 8 matches.

**Example:** Typing `"nar"` → Suggestions:
- Naruto (10M views)
- Naruto Shippuden (5M views)
- Naruto Gaiden (2M views)

**Specifications:**
- **Debounced**: 280ms delay to prevent API spamming.
- **Popularity-based**: Results are sorted by `view_count` descending.
- **Rich Display**: Includes cover thumbnails, titles, view counts, and ratings.
- **UX**: Fully supports keyboard navigation (`↑`, `↓`, `Enter`, `Escape`).

### 2️⃣ Hot Search (Trending Keywords)

Displays trending search keywords when the user focuses on the search bar (before typing).

**Mechanism:**
- On every search → `ZINCRBY hot_searches:24h keyword 1` in Redis.
- On focus → `ZREVRANGE hot_searches:24h 0 7` to get the top 8.
- Two sliding windows: `24h` and `7d` (utilizing Redis TTL).

**UI Design:**
- Top 3 keywords feature ranking badges: 🥇 `#1` (Gold), 🥈 `#2` (Silver), 🥉 `#3` (Bronze).
- Clicking a keyword navigates to `/browse?q=keyword`.

### 3️⃣ Full Search (Browse Page)

Submitting a search (Enter or Search button) redirects to `/browse?q=keyword` with complete results.

**Combined Filtering Support:**
- `q`: Search keyword.
- `genre`: Filter by category slug.
- `status`: Lọc by status (`Ongoing` / `Completed`).
- `sort`: Order by views, updatedAt, createdAt, or title.
- `page` / `limit`: Dynamic pagination.

### 4️⃣ SEO Optimization: Dynamic Titles

The `manga/[slug]` page now features a dynamic title format:
```
Naruto [Up to Chapter 720] - SiTruyen
```
**Benefits:**
- **Higher CTR**: Google indexes chapters, attracting users looking for the latest updates.
- **Better Social Sharing**: Meta tags include full story status and cover images.

---

## Backend API Reference

### `GET /api/stories/search`

Full-text search with pagination and filters.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | string | required | Search keyword |
| `page` | number | `1` | Current page |
| `limit` | number | `20` | Results per page |
| `sort` | string | `view_count:desc` | Sorting order |
| `genre` | string | — | Filter by genre slug |
| `status` | string | — | Filter: `ongoing` or `completed` |

---

### `GET /api/stories/autocomplete`

Fast suggestions optimized for low latency.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `q` | string | required | Keyword (≥ 2 chars) |
| `limit` | number | `8` | Maximum suggestions |

---

### `GET /api/stories/hot-searches`

Retrieves trending keywords from Redis.

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | number | `10` | Number of keywords |
| `window` | string | `24h` | `24h` or `7d` |

---

### `POST /api/stories/search-log`

Logs search keywords (fire-and-forget).

**Body:** `{ "keyword": "naruto" }`

---

## Frontend Components

### `SearchBar.tsx`

The core search component, supporting two main variants:

```tsx
// Header variant (compact)
<SearchBar variant="inline" />

// Hero variant (center search for home page)
<SearchBar variant="hero" placeholder="Find your favorite manga..." />
```

**Props:**
- `variant` (`"inline"` | `"hero"`): The visual style.
- `placeholder`: Custom placeholder text.
- `className`: Additional CSS classes.

---

## Installation & Setup

### Step 1: Create Docker Network

```bash
docker network create tools_network
```

### Step 2: Launch Meilisearch & Redis

```bash
cd docker
docker compose -f docker-compose.search.yml up -d
```

### Step 3: Configure .env

**Backend (`src/backend/.env`):**
```env
# If using Docker (internal service names)
MEILISEARCH_HOST=http://meilisearch:7700
MEILISEARCH_KEY=your_master_key_here
REDIS_URL=redis://redis:6379
```

### Step 4: Sync Data

Run the Meilisearch sync script periodically:
`src/backend/src/scripts/sync-meilisearch.ts`

---

## Fallback & Fault Tolerance

Designed to be resilient—the search feature will **never crash** even if Meilisearch or Redis is offline.

| Scenario | Behavior |
|----------|----------|
| Meili ❌ + Redis ❌ | Uses Strapi DB search; Hot Search returns `[]`. |
| Meili ✅ + Redis ❌ | Uses Meilisearch highlights; Hot Search returns `[]`. |
| Meili ❌ + Redis ✅ | Uses Strapi DB search; Hot Search works normally. |
| Meili ✅ + Redis ✅ | Fully optimized high-speed experience. ⚡ |

---

## File Structure

```
src/
├── backend/
│   └── src/
│       ├── api/story/
│       │   ├── controllers/story.ts    ← Autocomplete & Logic
│       │   └── routes/
│       │       └── 02-search-story.ts  ← Search API Routes
│       └── scripts/
│           └── sync-meilisearch.ts     ← Meilisearch Sync Utility
│
├── frontend/
│   └── src/
│       ├── components/
│       │   └── SearchBar.tsx           ← Autocomplete UI
│       ├── app/
│       │   ├── browse/page.tsx         ← Search result integration
│       │   └── manga/[slug]/page.tsx   ← Dynamic SEO titles
│
└── docker/
    ├── docker-compose.yml              ← Infrastructure update
    └── docker-compose.search.yml       ← Search stack definition
```

---

*Built for SiTruyen – Manga discovery reimagined.*
