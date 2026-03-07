# Architecture Migration: Local Cloudflare Tunnel to Azure Cloud

This document analyzes the rationale, benefits, and execution steps for migrating the SiTruyen system's network architecture from a local server utilizing Cloudflare Tunnel to a fully managed deployment on Azure Cloud (Azure Container Apps).

---

## 1. Current State Analysis (Local + Cloudflare Tunnel)

### Architecture Description
- The entire application stack (Frontend, Strapi Backend, Database, Redis, Meilisearch) is containerized via Docker Compose and runs on a single local server (or personal VM).
- **Cloudflare Tunnel (`cloudflared`)** acts as a reverse proxy and tunneling service, exposing local services to the Internet without modifying router/firewall port forwarding rules.

### Advantages of the Legacy Architecture
- Extremely easy to set up for prototyping and rapid development.
- Zero infrastructure cost (utilizes existing personal hardware).
- Excellent perimeter security (no public IP required, no inbound ports need to be opened manually).

### Limitations and Drawbacks
- **Single Point of Failure (SPOF):** The service is entirely dependent on a single local machine. Power outages, ISP downtime, or hardware failures will bring the entire system offline.
- **Latency and Performance Bottlenecks:** Traffic must route through Cloudflare's network, tunnel back to the local ISP, and then hit the server. For a manga platform serving numerous high-resolution images, domestic ISP uplink limits can severely degrade the user experience.
- **Scalability Limitations:** Scaling to meet traffic spikes is virtually impossible due to hard hardware constraints. Auto-scaling is incredibly complex to set up locally.
- **High Maintenance Overhead:** Requires manual management of the host OS, Docker engine, security patches, and hardware redundancy.

---

## 2. The Solution: Azure Cloud (Azure Container Apps)

Migrating the Frontend and Backend to Azure Container Apps (ACA) transforms the project into a true Cloud-Native architecture.

### Why Azure Container Apps (ACA)?
1. **Serverless Containers:** Eliminates the need to manage underlying Virtual Machines or complex Kubernetes clusters.
2. **Event-Driven Auto-scaling:** Scales automatically from 0 to *N* replicas based on HTTP traffic volume or custom KEDA events.
3. **Seamless Networking:** ACA provides an "Environment" that allows the Frontend and Backend to communicate via a fast, secure internal network (`http://<backend>.internal.<zone>.azurecontainerapps.io`) without routing traffic over the public internet.
4. **Deep Azure Integration:** Easily hooks into other Managed Azure Services like Azure PostgreSQL and Azure Blob Storage in the future.

---

## 3. Benefits of the Migration

- **High Availability & Reliability:** Azure's infrastructure guarantees high uptime (typically >99.9%). The system is resilient against local power or ISP outages.
- **Global Performance & Low Latency:** End-users communicate directly with Azure Data Centers connected to massive, high-speed backbones, drastically reducing image loading times.
- **Flexible Runtime Configuration:** Environment variables can be updated instantly via the Azure Portal without rebuilding Docker images. (Our recent Next.js runtime configuration fix via `STRAPI_PUBLIC_URL` resolves the frontend env var dependency issue).
- **Decoupled Scaling:** The Frontend and Backend can be scaled independently. During a traffic spike, the Next.js frontend can scale out to 10 instances while the cached backend requires only 2.

---

## 4. Migration Execution Steps

### Step 1: Prepare Container Images
Ensure both services build into production-ready, standalone Docker images.
- **Backend (`src/backend/Dockerfile`):** Build the Strapi image.
- **Frontend (`src/frontend/Dockerfile`):** Build the Next.js image (must use `output: "standalone"`).

### Step 2: Push Images to a Container Registry
- Utilize Azure Container Registry (ACR), Docker Hub, or GitHub Container Registry (GHCR).
- Push the compiled images:
  - `sitruyen-backend:latest`
  - `sitruyen-frontend:latest`

### Step 3: Deploy the Backend (Strapi) to ACA
1. Create an Azure Container Apps Environment.
2. Provision a new Container App for the backend pulling from the configured registry.
3. Configure essential environment variables (Database URL, JWT Secrets, etc.).
4. Enable Target Port `1337` and configure Ingress (can be limited to the internal ACA environment for security).
5. Retrieve and save the Internal FQDN (e.g., `http://sitruyen-backend.internal.xyz.azurecontainerapps.io`).

### Step 4: Deploy the Frontend (Next.js) to ACA
1. Provision a second Container App within the same ACA Environment.
2. Configure Critical Environment Variables:
   - `STRAPI_INTERNAL_URL`: The Backend's internal ACA URL (used for Server-Side Rendering and Server Actions).
   - `STRAPI_PUBLIC_URL` (Not `NEXT_PUBLIC_*`): The public-facing URL of the Backend for client-side API calls (e.g., `https://api-sitruyen.nhatcuong.io.vn`).
3. Enable Public Ingress on port `3000` to expose the UI to the internet.

### Step 5: Configure Custom Domains & TLS
- Bind a Custom Domain to the Frontend App (e.g., `sitruyen.nhatcuong.io.vn`).
- Bind a Custom Domain to the Backend App (e.g., `api-sitruyen.nhatcuong.io.vn`).
- Utilize Azure's Free Managed Certificates to automatically secure traffic with HTTPS.

### Step 6: Address Stateful Storage & Databases
Moving to Serverless Containers means local file systems are ephemeral (data is lost on restart).
- **Database:** Migrate from local SQLite/Dockerized Postgres to a PaaS solution like **Azure Database for PostgreSQL**.
- **Strapi Media Storage:** Replace the local `public/uploads` mount with a cloud storage provider. Install and configure the **Azure Blob Storage provider** for Strapi so uploaded manga images persist securely in the cloud.
- **Redis/Meilisearch:** Deploy as separate internal Container Apps or utilize managed Azure equivalents.

---

## 5. Conclusion

Severing ties with the local `cloudflared` tunnel and migrating to Azure Container Apps is a massive architectural leap. It transitions SiTruyen from a fragile "Hobby Setup" into a robust, Production-Ready platform capable of handling substantial user traffic. Powered by independent scaling, Azure's high-speed network, and robust runtime configurations, the platform is now fully equipped for sustainable growth.
