# SePay Integration Guide - Automated VIP Payment

## 📋 Overview Flow

```
User selects VIP plan → Clicks "Get VIP"
    → Backend creates order (code: STXXXXXX or VIPXXXXXX)
    → Frontend displays payment QR code from SePay/VietQR
    → User opens banking app, scans QR, transfers money
    → SePay detects transaction (~10 seconds)
    → SePay triggers Webhook to Backend
    → Backend matches payment code → Activates VIP plan
    → Frontend polling detects "paid" status → Shows "Success!"
```

---

## 🔧 Step 1: Register SePay Account

1. Go to [https://my.sepay.vn/register](https://my.sepay.vn/register)
2. Register an account.
3. Connect your bank account (supports MBBank, Vietcombank, ACB, Techcombank, etc.).
4. For testing, use the sandbox environment: [https://my.dev.sepay.vn](https://my.dev.sepay.vn)

---

## 🔧 Step 2: Configure Webhook on SePay

1. Login to SePay → Menu **"Webhooks"**.
2. Click **"+ Add webhook"**.
3. Fill in the details:

| Field | Value |
|--------|---------|
| **Name** | SiTruyen VIP Payment |
| **Event** | Incoming transfer (Có tiền vào) |
| **Bank Account** | Select your connected bank account |
| **Webhook URL** | `https://your-domain.com/api/vip-orders/sepay-webhook` |
| **Is authenticated?** | ✅ Yes |
| **Auth Type** | API Key |
| **API Key** | Set an arbitrary secret key (e.g., `my-super-secret-key-123`) |

4. Click **"Add"** to save.

---

## 🔧 Step 3: Configure Payment Code Structure

1. Go to **"Company"** → **"General Settings"** → **"Payment Code Structure"**.
2. Set up recognition pattern. It is recommended to use a prefix + 6 characters.
   - Example if using default prefix `ST`: `ST` + 6 characters.
   - Regex suggestion: `ST[A-Z0-9]{6}` (or replace `ST` with your custom prefix).
3. This allows SePay to automatically parse the payment code from the transfer content.

---

## 🔧 Step 4: Configure Backend (.env)

Add the following environment variables to your **Strapi backend** `.env` file (or `docker/.env`):

```env
# ── SePay Payment Config ──
# Bank ID (SePay bank code, e.g., MBBank, Vietcombank, ACB, BIDV...)
SEPAY_BANK_ID=MBBank

# Receiving Bank Account Number
SEPAY_ACCOUNT_NUMBER=0123456789

# Account Name (displayed to user, usually uppercase without accents)
SEPAY_ACCOUNT_NAME=NGUYEN VAN A

# Webhook secret (must match the API Key configured in SePay)
SEPAY_WEBHOOK_SECRET=my-super-secret-key-123

# Payment Code Prefix (Default is 'ST'. e.g., ST123456)
# Optional. Change to 'VIP' or others if desired. Match this with SePay Regex.
SEPAY_PREFIX=ST
```

---

## 🔧 Step 5: Configure Permissions in Strapi Admin

After the backend is running, go to **Strapi Admin Panel**:

1. Go to **Settings** → **Users & Permissions Plugin** → **Roles**.
2. **"Public"** Role → Enable:
   - `vip-order` → `checkStatus` ✅ (For frontend polling)
   - `vip-order` → `sepayWebhook` ✅ (For SePay to call)
3. **"Authenticated"** Role → Enable:
   - `vip-order` → `createOrder` ✅ (For user to buy VIP)
   - `vip-order` → `checkStatus` ✅ (For user to check their order)

---

## 🔧 Step 6: Testing

### With SePay Dev Environment:
1. Go to SePay Dev Panel → Create a simulated transaction.
2. Enter the correct payment code (e.g., `STAB12XY`).
3. Check Strapi backend logs to confirm webhook reception.

### With Production Environment:
1. Open `/vip-upgrade` page → Select plan → Click "Get VIP".
2. Scan QR code with banking app → Transfer money.
3. Wait ~10 seconds → Information will be verified automatically.
4. Page automatically redirects to "Success!" state.

---

## 📁 Modified Files

### Backend (Strapi):
| File | Description |
|------|--------|
| `src/api/vip-order/content-types/vip-order/schema.json` | Schema for VIP Order |
| `src/api/vip-order/services/vip-order.ts` | Business logic (create order, fulfill, expire, dynamic prefix) |
| `src/api/vip-order/controllers/vip-order.ts` | API endpoints (create, check, webhook) |
| `src/api/vip-order/routes/vip-order.ts` | Custom routes |
| `config/server.ts` | Added cron job to expire stale orders |

### Frontend (Next.js):
| File | Description |
|------|--------|
| `src/app/vip-upgrade/page.tsx` | VIP Payment Page (3 steps, English interface) |
| `src/services/api.ts` | Added `vipOrderService` |

---

## 🔒 Security

1. **Webhook Secret**: SePay sends API Key in header, backend verifies it before processing.
2. **Amount Validation**: Backend compares transferred amount with order amount.
3. **Duplicate Prevention**: Order code is unique, each user can only have one pending order.
4. **Auto Expiry**: Pending orders > 30 minutes automatically expire (cron runs every 5 mins).
5. **CSRF**: Webhook endpoint only accepts POST, no session required.

---

## 💡 Tips

- If testing locally, use **ngrok** or **Cloudflare Tunnel** to expose Strapi to the internet so SePay can trigger the webhook.
- VIP Plan prices can be adjusted in `vip-order.ts` service (plans config) and `vip-upgrade/page.tsx` (PLANS array).
- SePay supports webhook retries if response is not 2xx.
