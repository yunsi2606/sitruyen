# Setup Guide

## 1. Prerequisites
Ensure you have the following installed:
- **Node.js**: Version 20 or higher.
- **Docker Desktop**: For running the database and backend services.
- **Git**: For version control.

## 2. Docker & Database Setup
The application relies on a shared Docker network for database communication.

1.  **Create the Network**:
    ```bash
    docker network create database_network
    ```
    *Note: This network allows separation of services and is referenced in `docker-compose.yml` as external.*

2.  **Start Services**:
    Navigate to the `docker` directory:
    ```bash
    cd docker
    ```

    Create your environment file:
    ```bash
    cp .env.example .env
    # Edit .env if you need to change ports or credentials
    ```

    Start the containers:
    ```bash
    docker-compose up -d
    ```

    This will start:
    - **Strapi Backend**: Accessible at `http://localhost:1337` (if running in container) or connected database.

## 3. Backend Setup (Strapi)
If you prefer running Strapi locally for development (recommended for coding plugins/content types):

1.  Navigate to backend:
    ```bash
    cd src/backend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment:
    Copy `.env.example` to `.env`:
    ```bash
    cp .env.example .env
    ```
    *Ensure the database credentials in `.env` match your Docker database if you are connecting to it, or use a local SQLite if configured so.*
    
    *Common Tip*: If connecting to Docker Postgres from host machine, ensure `DATABASE_HOST` is `localhost` and the port is exposed in `docker-compose.yml`.

4.  Start Development Server:
    ```bash
    npm run develop
    ```
    Create your first admin user at `http://localhost:1337/admin`.

## 4. Frontend Setup (Next.js)

1.  Navigate to frontend:
    ```bash
    cd src/frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Configure Environment:
    Create `.env.local`:
    ```bash
    cp .env.example .env.local
    ```
    Check `docs/ENVIRONMENT.md` for variable details.

4.  Run Development Server:
    ```bash
    npm run dev
    ```
    Open `http://localhost:3000` in your browser.
