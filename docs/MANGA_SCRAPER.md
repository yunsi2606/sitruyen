# Manga Scraper & Bulk Uploader Tool

The `manga-scraper-tool` is a standalone utility built with Node.js and React that allows administrators to scrape manga chapters from external websites and upload them directly in bulk to the Strapi Media Library.

This document details the internal workings of the bulk upload feature, specifically focusing on the recent improvements related to authentication, folder organization, and rate-limiting.

## 1. Authentication & Folder Organization

### The Problem
By default, standard upload requests authenticated with a Strapi API Token via the Content API (`/api/upload`) are always placed into the root "API Uploads" folder. Strapi intentionally ignores any `folder` placement parameters specified in the `fileInfo` payload for security reasons when using API tokens.

### The Solution: Admin JWT
To properly organize thousands of chapter images into a structured hierarchy (e.g., `story-image/<story-slug>/chap-*/`), the scraper must use the Strapi Admin API (`/upload`) which requires an **Admin JWT**.

- The frontend UI now includes fields for **Admin Email** and **Admin Password**.
- The server authenticates with Strapi via `POST /admin/login` to acquire the Admin JWT before starting folder operations.
- The `uploadImageToStrapi` function intelligently routes requests:
    - If administrative credentials are valid and a target `folderId` exists, it uses the `/upload` endpoint with the Admin JWT.
    - If no credentials are provided (or folder creation fails), it safely falls back to using the Content API (`/api/upload`) with the standard API Token, uploading the images without folder organization.

## 2. Handling Token Expiration (401 Unauthorized)

### The Problem
Uploading a long story with hundreds of chapters can take over an hour. Strapi Admin JWTs are designed for short-lived dashboard sessions and typically expire after 15 to 30 minutes. When the token expires mid-upload, Strapi begins rejecting upload requests with a `401 Unauthorized` error.

### The Solution: Lazy Token Refresh
Instead of authenticating strictly once (which fails on long jobs) or authenticating before every single chapter (which triggers rate limits), the tool implements a **lazy refresh strategy**.

1. The initial Admin JWT is fetched once and cached.
2. The upload loop uses this cached token continuously.
3. If an image upload throws a `401 Unauthorized` error, the `catch` block intercepts it.
4. The server automatically issues a background re-login request to get a fresh Admin JWT.
5. The failed image upload is retried exactly once with the new token.

## 3. Rate Limit Prevention (429 Too Many Requests)

### The Problem
During development, attempting to proactively refresh the admin token before *every* chapter creation lead to the Strapi backend blocking the tool with a `429 Too Many Requests` (Rate Limit) error.

### The Solution: Throttled Re-authentication
To ensure the scraper does not behave like a DDoS bot when recovering from a token expiration:
- When a `401 Unauthorized` error is encountered, the tool awaits a deliberate **3-second delay** (`delay(3000)`) before executing the `loginAdmin` function.
- This backoff period ensures Strapi's brute-force protection mechanisms are not triggered during the token refresh cycle.

## 4. API Compatibility (Strapi v4 vs v5)

Strapi v5 introduced a flatter response structure for Document API endpoints compared to the nested `attributes` object in Strapi v4. The scraper's `getStorySlug` function contains agnostic data extraction to support both.

Furthermore, if fetching a story via the `documentId` path fails, the tool gracefully falls back to querying the numeric database `id` using `filters[id][$eq]=...` to ensure maximum compatibility.
