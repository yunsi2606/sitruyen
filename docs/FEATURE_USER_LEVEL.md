# 🌟 User Level & Cosmetics System

This document outlines the implementation of the **User Leveling, EXP Rewards, and Cosmetics System** for the Sitruyen platform. This feature engages users by gamifying their reading experience with levels, badges, and unlockable avatar frames.

## 🚀 Key Features

1.  **Leveling System**: Users earn EXP to level up. Higher levels unlock exclusive titles and frames.
2.  **EXP Rewards**:
    *   **Reading**: Earn EXP for every chapter read.
    *   **Commenting**: Earn EXP for discussing stories (+5 EXP).
    *   **Rating**: Earn EXP for rating a story (+3 EXP).
    *   **Daily Login**: Claim a daily bonus (+20 EXP) once every 24 hours.
3.  **Cosmetics**:
    *   **Avatar Frames**: Unlockable frames (Bronze, Silver, Gold, etc.) strictly tied to user level.
    *   **Name Colors**: Special username colors for high-level users.
    *   **Wibu Titles**: Fun, culture-specific titles (e.g., "Kouhai", "Senpai", "Isekai Protagonist").
4.  **Leaderboard**: A public ranking of top users by total EXP.

---

## 🛠️ Backend Implementation (Strapi)

### 1. Schema Extensions
*   **User (`users-permissions`)**:
    *   `exp` (Integer): Total experience points.
    *   `level` (Integer): Current user level.
    *   `avatar_frame` (String): Key of the currently equipped frame (e.g., `'gold'`).
    *   `name_color` (String): Hex code of the currently equipped name color.
    *   `last_daily_exp` (DateTime): Timestamp of the last daily claim.

### 2. Services & Logic (`user-level.ts`)
*   **`grantExp(userId, amount, source)`**: Centralized service handles EXP gain, level-up calculation, and automatic assignment of new badges/frames upon leveling up.
*   **`claimDailyLogin(userId)`**: Validates if the user has already claimed EXP today using `last_daily_exp`.
*   **`getUnlockedCosmetics(userId)`**: Returns list of all frames/colors available up to variables the user's current level.

### 3. API Endpoints
| Method | Endpoint | Description | Permission |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/user-levels/me` | Get current level, EXP, and progress | `Authenticated` |
| `POST` | `/api/user-levels/daily` | Claim daily login EXP (+20) | `Authenticated` |
| `GET` | `/api/user-levels/cosmetics` | Get unlocked & equipped cosmetics | `Authenticated` |
| `PUT` | `/api/user-levels/cosmetics` | Equip a frame or name color | `Authenticated` |
| `GET` | `/api/user-levels/config` | Get public level config (badges, etc.) | `Public` |
| `GET` | `/api/user-levels/leaderboard` | Get top users | `Public` |

---

## 🎨 Frontend Implementation (Next.js)

### 1. Components
*   **`AvatarFrame`**: A dedicated component to render user avatars with their equipped frame overlay.
*   **`CommentSection`**: 
    *   Displays user **Level Badges** (e.g., `[Senpai]`) next to usernames.
    *   Renders **Avatar Frames** and **Name Colors** in the discussion list.
*   **`ProfilePage`**:
    *   **Level Progress**: Visual progress bar showing EXP to next level.
    *   **Daily Check-in**: Interactive button to claim daily rewards.
    *   **Cosmetics Tab**: UI to view unlocked items and equip them instantly.

### 2. Services
*   **`userLevelService`**: Handles all communication with the backend level API.

---

## ⚙️ Configuration

### Strapi Admin Roles
To ensure proper functionality, configure **Settings > Users & Permissions > Roles**:

*   **Authenticated Role**:
    *   Enable: `getMyLevel`, `claimDailyLogin`, `getMyCosmetics`, `updateMyCosmetics`.
*   **Public Role**:
    *   Enable: `getLevelConfig`, `getLeaderboard`.

---

## 📦 Assets
Frame images are stored in `/public/` on the frontend (e.g., `/frame_gold.png`) and are mapped via the backend configuration key.
