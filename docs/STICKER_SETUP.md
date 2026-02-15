# Sticker Feature Setup Guide

The backend code for the Sticker feature has been automatically generated. You do not need to manually create Content Types. However, you must perform the following steps to activate the feature.

## 1. Restart Strapi Backend (Critical)
Since new schema files (`Sticker`, `Sticker Pack`) and relations (`Comment -> Sticker`) have been added directly to the source code, you MUST restart the Strapi server for these changes to be applied to the database.

- If running via Docker:
  ```bash
  docker compose restart strapi
  ```
- If running locally:
  Stop the server (Ctrl+C) and run:
  ```bash
  npm run develop
  ```

## 2. Configure Permissions (Required)
Once the server is back up, the new API endpoints will be available but restricted. You need to enable public/authenticated access.

1.  Log in to the **Strapi Admin Panel**.
2.  Go to **Settings** > **Users & Permissions Plugin** > **Roles**.
3.  Edit the **Public** role (and **Authenticated** role):
4.  Scroll down to **Sticker-pack**:
    - Check `find` and `findOne`.
5.  Scroll down to **Sticker**:
    - Check `find` and `findOne`.
6.  Click **Save**.

## 3. Upload Sticker Content
Now you can create sticker packs and upload stickers.

1.  Go to **Content Manager**.
2.  Select **Sticker Pack** (create a pack, e.g., "Pepe Reborn").
    - Upload a representative icon.
3.  Select **Sticker** (create individual stickers).
    - **Name**: e.g., "Sad Pepe".
    - **File**: Upload your `.json` (Lottie) or `.webp` / `.gif` file.
    - **Pack**: Select the "Pepe Reborn" pack you created.
4.  Repeat for other stickers.

## Frontend Features
The frontend has been updated to support:
- **Lottie Animations (.json)**: Plays once on lazy load. Click to replay.
- **Image Stickers (.webp/.gif)**: Standard display.
- **Sticker Picker**: Tabbed interface integrated into the Comment section.
- **Performance**: Lazy loading via IntersectionObserver and CSS `will-change-transform` optimizations.
