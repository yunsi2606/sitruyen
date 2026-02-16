# VIP Feature - Implementation Strategy

## Overview
Two-tier plan system where VIP users get early access to new chapters.
Free users can read chapters 7 days after they are published.

## Architecture

### Schema Changes

#### User (`plugin::users-permissions.user`)
| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `plan` | enum (`free`, `vip`) | `free` | User's current plan level |
| `vip_expired_at` | datetime | null | When VIP expires. `null` = lifetime VIP |

#### Chapter (`api::chapter.chapter`)
| Field | Type | Default | Purpose |
|-------|------|---------|---------|
| `is_vip_only` | boolean | `true` | Whether chapter is currently VIP-locked |
| `chap_published_at` | date | (auto-set) | Used to calculate the 7-day unlock window |

### Flow Diagram

```
Admin uploads Chapter
       │
       ▼
[beforeCreate Lifecycle]
  ├─ Auto-set chap_published_at = today
  └─ Auto-set is_vip_only = true
       │
       ▼
  Chapter is created (VIP-locked)
       │
       ├── VIP User reads ──► ✅ OK (plan=vip & not expired)
       │
       ├── Free User reads ──► ❌ 403 "VIP_REQUIRED"
       │
       ▼
  [Cron Job: every hour]
  Check: chap_published_at <= (today - 7 days)?
       │
       YES ──► Set is_vip_only = false ──► Free users can read
```

### Files Modified

| File | Changes |
|------|---------|
| `src/extensions/.../user/schema.json` | Added `plan` and `vip_expired_at` fields |
| `src/api/chapter/content-types/chapter/schema.json` | Added `is_vip_only` field |
| `src/api/chapter/services/chapter.ts` | Added VIP guard, `isUserVip()`, `unlockExpiredVipChapters()` |
| `src/api/chapter/controllers/chapter.ts` | Handle `VIP_REQUIRED` error → 403 |
| `src/index.ts` | Auto-set `chap_published_at` + `is_vip_only` on chapter creation |
| `config/server.ts` | Registered cron job (hourly) for auto-unlock |

### Cron Job Details
- **Schedule**: `0 * * * *` (every hour, at minute 0)
- **Logic**: Query chapters where `is_vip_only = true` AND `chap_published_at <= 7 days ago`, update `is_vip_only = false`
- **Logging**: Logs count of unlocked chapters

### VIP Validation Logic
1. User must be **authenticated** (have JWT token)
2. User's `plan` must be `"vip"`
3. If `vip_expired_at` is set, it must be **in the future**
4. If `vip_expired_at` is `null`, the VIP is **lifetime** (for admin grants)

### Admin Panel Usage
- Set a user to VIP: edit user → set `plan = vip`, optionally set `vip_expired_at`
- Manually unlock a chapter: edit chapter → set `is_vip_only = false`
- Manually lock a chapter: edit chapter → set `is_vip_only = true`

### Payment Integration (Implemented)
- **Provider**: SePay (VietQR)
- **Flow**: User select plan -> System generate QR -> User transfer -> Webhook trigger -> Activate VIP
- **Tech Stack**: Next.js Frontend + Strapi Custom Controller

### Frontend Integration
- **VIP Upgrade Page**: `/vip-upgrade` (Plan selection, QR display, Status polling)
- **Chapter List**: Locked chapters show 🔒 icon
- **Reading View**: Non-VIP users blocked with upgrade prompt
- **Profile**: Status badge for VIP members

### Admin Panel Usage
- **Manage Orders**: View `Vip Order` collection type
- **Set VIP**: Edit user → set `plan = vip`, optionally set `vip_expired_at`
- **Manual Unlock**: Edit chapter → set `is_vip_only = false`
