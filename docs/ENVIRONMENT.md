# Environment Variables

## Frontend (`src/frontend/.env.local`)

| Variable | Description | Default / Example |
|----------|-------------|-------------------|
| `NEXT_PUBLIC_STRAPI_URL` | URL of the Strapi Backend API | `http://localhost:1337` |

## Backend (`src/backend/.env`)

These variables are used by Strapi.

| Variable | Description |
|----------|-------------|
| `HOST` | Server host (0.0.0.0 for Docker) |
| `PORT` | Server port (Default: 1337) |
| `APP_KEYS` | Secret keys for signatures |
| `API_TOKEN_SALT` | Salt for API tokens |
| `ADMIN_JWT_SECRET` | Secret for Admin JWT |
| `TRANSFER_TOKEN_SALT` | Salt for transfer tokens |
| `JWT_SECRET` | Secret for User JWT |
| `DATABASE_CLIENT` | Database client (postgres, sqlite) |
| `DATABASE_HOST` | Database host address |
| `DATABASE_PORT` | Database port |
| `DATABASE_NAME` | Database name |
| `DATABASE_USERNAME` | Database user |
| `DATABASE_PASSWORD` | Database password |
| `DATABASE_SSL` | SSL connection boolean |

## Docker (`docker/.env`)

Used by `docker-compose.yml` to configure containers.

| Variable | Description |
|----------|-------------|
| `POSTGRES_DB` | Name of the Postgres DB to create |
| `POSTGRES_USER` | Postgres user |
| `POSTGRES_PASSWORD` | Postgres password |
| `STRAPI_URL` | Optional: Public URL for Strapi |
