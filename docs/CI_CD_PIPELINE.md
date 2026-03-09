# CI/CD Pipeline Guide: GitHub Actions → Azure Container Apps

This guide walks you through setting up the automated CI/CD pipeline that builds Docker images and deploys them to Azure Container Apps whenever you push code to the `main` branch.

---

## Architecture Overview

```
┌──────────────┐      push to main       ┌──────────────────────┐
│   Developer  │ ──────────────────────>  │   GitHub Actions     │
│   (git push) │                          │                      │
└──────────────┘                          │  1. Checkout code    │
                                          │  2. Login to Azure   │
                                          │  3. Build Docker img │
                                          │  4. Push to ACR      │
                                          │  5. Deploy to ACA    │
                                          └──────────┬───────────┘
                                                     │
                                          ┌──────────▼───────────┐
                                          │  Azure Container     │
                                          │  Registry (ACR)      │
                                          │  sitruyen.azurecr.io │
                                          └──────────┬───────────┘
                                                     │
                              ┌───────────────────────┼───────────────────────┐
                              ▼                                               ▼
                   ┌─────────────────────┐                         ┌─────────────────────┐
                   │  sitruyen-frontend   │                         │  sitruyen-backend    │
                   │  (Azure Container   │  ← internal network →   │  (Azure Container   │
                   │   App)              │                         │   App)              │
                   │  Next.js :3000      │                         │  Strapi :1337       │
                   └─────────────────────┘                         └─────────────────────┘
```

### Trigger Rules

| Workflow             | Triggers on push to `main` when...        | Manual trigger |
|----------------------|--------------------------------------------|----------------|
| `deploy-frontend.yml`| Files in `src/frontend/**` change          | ✅ Yes          |
| `deploy-backend.yml` | Files in `src/backend/**` change           | ✅ Yes          |

This means pushing a frontend-only change will **only** rebuild and redeploy the frontend, not the backend (and vice versa). This saves time and cost.

---

## Prerequisites: One-Time Azure Setup

Before the pipeline can run, you need to create the following Azure resources **once**.

### Step 1: Create a Resource Group

```bash
az group create --name sitruyen-rg --location southeastasia
```

### Step 2: Create an Azure Container Registry (ACR)

```bash
az acr create \
  --resource-group sitruyen-rg \
  --name sitruyen \
  --sku Basic \
  --admin-enabled true
```

> **Note:** `--admin-enabled true` allows simple username/password auth for Container Apps to pull images. For production, consider using Managed Identity instead.

### Step 3: Create a Container Apps Environment

```bash
az containerapp env create \
  --name sitruyen-env \
  --resource-group sitruyen-rg \
  --location southeastasia
```

### Step 4: Create the Backend Container App

```bash
# Get ACR credentials
ACR_PASSWORD=$(az acr credential show --name sitruyen --query "passwords[0].value" -o tsv)

az containerapp create \
  --name sitruyen-backend \
  --resource-group sitruyen-rg \
  --environment sitruyen-env \
  --image sitruyen.azurecr.io/sitruyen-backend:latest \
  --registry-server sitruyen.azurecr.io \
  --registry-username sitruyen \
  --registry-password "$ACR_PASSWORD" \
  --target-port 1337 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 3 \
  --cpu 1.0 \
  --memory 2.0Gi \
  --env-vars \
    "HOST=0.0.0.0" \
    "PORT=1337" \
    "NODE_ENV=production" \
    "DATABASE_CLIENT=postgres" \
    "DATABASE_HOST=<your-postgres-host>" \
    "DATABASE_PORT=5432" \
    "DATABASE_NAME=sitruyen_strapi" \
    "DATABASE_USERNAME=<your-db-user>" \
    "DATABASE_PASSWORD=secretref:db-password" \
    "APP_KEYS=secretref:app-keys" \
    "JWT_SECRET=secretref:jwt-secret" \
    "ADMIN_JWT_SECRET=secretref:admin-jwt-secret" \
    "API_TOKEN_SALT=secretref:api-token-salt" \
    "TRANSFER_TOKEN_SALT=secretref:transfer-token-salt"
```

### Step 5: Create the Frontend Container App

```bash
# Get the backend's internal FQDN
BACKEND_FQDN=$(az containerapp show \
  --name sitruyen-backend \
  --resource-group sitruyen-rg \
  --query "properties.configuration.ingress.fqdn" -o tsv)

az containerapp create \
  --name sitruyen-frontend \
  --resource-group sitruyen-rg \
  --environment sitruyen-env \
  --image sitruyen.azurecr.io/sitruyen-frontend:latest \
  --registry-server sitruyen.azurecr.io \
  --registry-username sitruyen \
  --registry-password "$ACR_PASSWORD" \
  --target-port 3000 \
  --ingress external \
  --min-replicas 1 \
  --max-replicas 5 \
  --cpu 0.5 \
  --memory 1.0Gi \
  --env-vars \
    "NODE_ENV=production" \
    "STRAPI_INTERNAL_URL=https://$BACKEND_FQDN" \
    "STRAPI_PUBLIC_URL=https://api-sitruyen.nhatcuong.io.vn"
```

> **Important:** Use `STRAPI_PUBLIC_URL` (not `NEXT_PUBLIC_*`) for the runtime API URL. See [NEXTJS_RUNTIME_ENV_FIX.md](./NEXTJS_RUNTIME_ENV_FIX.md) for details.

### Step 6: Create Azure Service Principal for GitHub Actions

This creates a credential that GitHub Actions uses to authenticate with Azure:

```bash
az ad sp create-for-rbac \
  --name "github-actions-sitruyen" \
  --role contributor \
  --scopes /subscriptions/<SUBSCRIPTION_ID>/resourceGroups/sitruyen-rg \
  --sdk-auth
```

Copy the entire JSON output — you'll need it in the next step.

---

## GitHub Repository Setup

### Step 7: Add the `AZURE_CREDENTIALS` Secret

1. Go to your GitHub repo: `https://github.com/yunsi2606/sitruyen`
2. Navigate to **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Name: `AZURE_CREDENTIALS`
5. Value: Paste the entire JSON output from Step 6

```json
{
  "clientId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "clientSecret": "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
  "subscriptionId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx",
  "tenantId": "xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
}
```

### Step 8: Grant ACR Push Permission to the Service Principal

```bash
# Get the Service Principal's clientId from the JSON above
SP_ID="<clientId from JSON>"

# Get the ACR resource ID
ACR_ID=$(az acr show --name sitruyen --query id --output tsv)

# Assign AcrPush role
az role assignment create \
  --assignee "$SP_ID" \
  --role AcrPush \
  --scope "$ACR_ID"
```

---

## Pipeline Workflow Files

Two workflow files are located at:

```
.github/
  workflows/
    deploy-frontend.yml    # Frontend CI/CD
    deploy-backend.yml     # Backend CI/CD
```

### Pipeline Steps (both workflows follow the same pattern)

| Step | Action | What it does |
|------|--------|--------------|
| 1 | `actions/checkout@v4` | Clones the repository |
| 2 | `azure/login@v2` | Authenticates with Azure using `AZURE_CREDENTIALS` secret |
| 3 | `az acr login` | Authenticates Docker client with ACR |
| 4 | `docker build & push` | Builds the Docker image and pushes it to ACR with both a `sha` tag and `latest` |
| 5 | `container-apps-deploy-action` | Updates the Container App with the new image, creating a new revision |

### Image Tagging Strategy

Each build produces **two tags**:

- `sitruyen.azurecr.io/sitruyen-frontend:<git-sha>` — Immutable, traceable back to exact commit
- `sitruyen.azurecr.io/sitruyen-frontend:latest` — Always points to the most recent build

This gives you the ability to roll back to any previous commit's image instantly.

---

## Custom Domain Setup (Optional)

After the Container Apps are running:

```bash
# Frontend custom domain
az containerapp hostname add \
  --name sitruyen-frontend \
  --resource-group sitruyen-rg \
  --hostname sitruyen.nhatcuong.io.vn

# Backend custom domain
az containerapp hostname add \
  --name sitruyen-backend \
  --resource-group sitruyen-rg \
  --hostname api-sitruyen.nhatcuong.io.vn

# Bind managed certificates (free TLS)
az containerapp hostname bind \
  --name sitruyen-frontend \
  --resource-group sitruyen-rg \
  --hostname sitruyen.nhatcuong.io.vn \
  --environment sitruyen-env \
  --validation-method CNAME

az containerapp hostname bind \
  --name sitruyen-backend \
  --resource-group sitruyen-rg \
  --hostname api-sitruyen.nhatcuong.io.vn \
  --environment sitruyen-env \
  --validation-method CNAME
```

> You'll need to create CNAME records in your DNS pointing to the Container App's auto-generated FQDN.

---

## Testing the Pipeline

### Automatic Trigger
```bash
# Edit a frontend file and push
echo "// trigger" >> src/frontend/src/lib/api.ts
git add . && git commit -m "chore: trigger frontend deploy" && git push
```

Check the pipeline at: `https://github.com/yunsi2606/sitruyen/actions`

### Manual Trigger
1. Go to **Actions** tab on GitHub
2. Select **Deploy Frontend** or **Deploy Backend**
3. Click **Run workflow** → **Run workflow**

---

## Rollback

If a deployment introduces a bug, you can instantly roll back:

```bash
# List all revisions
az containerapp revision list \
  --name sitruyen-frontend \
  --resource-group sitruyen-rg \
  --output table

# Activate a previous revision
az containerapp revision activate \
  --name sitruyen-frontend \
  --resource-group sitruyen-rg \
  --revision <revision-name>

# Route 100% traffic to that revision
az containerapp ingress traffic set \
  --name sitruyen-frontend \
  --resource-group sitruyen-rg \
  --revision-weight <revision-name>=100
```

---

## Configuration Reference

### Environment Variables Summary

| Variable | Where | Purpose |
|----------|-------|---------|
| `STRAPI_PUBLIC_URL` | Frontend Container App | Public API URL for browser-side calls (runtime) |
| `STRAPI_INTERNAL_URL` | Frontend Container App | Internal API URL for SSR calls within Azure network |
| `NEXT_PUBLIC_STRAPI_URL` | Frontend build arg (Dockerfile) | Build-time fallback (⚠️ baked in, not reliable for runtime) |
| `DATABASE_HOST` | Backend Container App | PostgreSQL connection host |
| `AZURE_CREDENTIALS` | GitHub Secret | Service Principal JSON for CI/CD authentication |

### GitHub Secrets Required

| Secret Name | Description |
|-------------|-------------|
| `AZURE_CREDENTIALS` | Service Principal JSON (from `az ad sp create-for-rbac --sdk-auth`) |

### Resource Names to Customize

Before using the workflows, update the `env:` block at the top of each workflow file if your Azure resource names differ:

```yaml
env:
  ACR_NAME: sitruyen              # Your ACR name
  IMAGE_NAME: sitruyen-frontend   # Docker image name
  RESOURCE_GROUP: sitruyen-rg     # Azure Resource Group
  CONTAINER_APP_NAME: sitruyen-frontend  # Container App name
```
