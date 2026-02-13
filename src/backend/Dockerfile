# Dependencies Installation
FROM node:20-alpine AS deps

WORKDIR /app

# Install dependencies needed for native modules
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package.json package-lock.json* ./

# Install all dependencies (including devDependencies for build)
RUN npm install --legacy-peer-deps

# Build
FROM node:20-alpine AS builder

WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment for build
ENV NODE_ENV=production

# Build the Strapi admin panel
RUN npm run build

# Production Runtime
FROM node:20-alpine AS runner

WORKDIR /app

# Create non-root user for security
RUN addgroup --system --gid 1001 strapi && \
    adduser --system --uid 1001 strapi

# Install runtime dependencies
RUN apk add --no-cache libc6-compat

# Set production environment
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=1337

# Copy necessary files from builder
COPY --from=builder --chown=strapi:strapi /app/dist ./dist
COPY --from=builder --chown=strapi:strapi /app/node_modules ./node_modules
COPY --from=builder --chown=strapi:strapi /app/public ./public
COPY --from=builder --chown=strapi:strapi /app/package.json ./package.json
COPY --from=builder --chown=strapi:strapi /app/favicon.png ./favicon.png

# Copy config and src directories (needed at runtime)
COPY --from=builder --chown=strapi:strapi /app/config ./config
COPY --from=builder --chown=strapi:strapi /app/src ./src
COPY --from=builder --chown=strapi:strapi /app/tsconfig.json ./tsconfig.json

# Create data directory for uploads
RUN mkdir -p /app/public/uploads \
    && mkdir -p /app/database/migrations \
    && chown -R strapi:strapi /app

# Switch to non-root user
USER strapi

# Expose port
EXPOSE 1337

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost:1337/_health || exit 1

# Start Strapi
CMD ["npm", "run", "start"]
