# Sitruyen Project

## Overview
Sitruyen is a modern web application for reading stories and manga. It consists of a **Next.js** frontend and a **Strapi** backend (Headless CMS), containerized with Docker.

## Tech Stack
- **Frontend**: Next.js 16 (React 19), TailwindCSS, TypeScript.
- **Backend**: Strapi 5 (Headless CMS), TypeScript.
- **Database**: PostgreSQL (via Docker).
- **Infrastructure**: Docker & Docker Compose.

## Project Structure
```
sitruyen/
├── docker/             # Docker configuration and compose files
├── docs/               # Project documentation
├── src/
│   ├── backend/        # Strapi Headless CMS
│   └── frontend/       # Next.js Application
├── .gitignore          # Root gitignore
└── README.md           # This file
```

## Getting Started

### Prerequisites
- Node.js (v20+ recommended)
- Docker & Docker Desktop
- Git

### Quick Setup
For detailed setup instructions, please refer to [docs/SETUP.md](docs/SETUP.md).

1.  **Setup Docker Network**
    The project uses an external Docker network for database isolation.
    ```bash
    docker network create database_network
    ```

2.  **Start Backend Services**
    Navigate to the definition folder and start the services.
    ```bash
    cd docker
    cp .env.example .env
    docker-compose up -d
    ```

3.  **Frontend Development**
    ```bash
    cd src/frontend
    cp .env.example .env.local
    npm install
    npm run dev
    ```
    Access the frontend at: `http://localhost:3000`

4.  **Backend Development**
    ```bash
    cd src/backend
    cp .env.example .env
    npm install
    npm run develop
    ```
    Access Strapi Admin at: `http://localhost:1337/admin`

## Documentation
- [Setup Guide](docs/SETUP.md)
- [Environment Variables](docs/ENVIRONMENT.md)
