# ----------------------------------------
# Base Image
# ----------------------------------------
FROM node:22-slim AS base
WORKDIR /app

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

# ----------------------------------------
# Install deps
# ----------------------------------------
FROM base AS deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# ----------------------------------------
# Builder stage
# ----------------------------------------
FROM base AS builder
COPY . .
COPY --from=deps /app/node_modules ./node_modules

# Build Next.js (standalone output)
# Build-time args supplied by Render Docker build.
ARG DATABASE_URL
ARG PAYLOAD_SECRET
ARG NEXT_PUBLIC_SERVER_URL
ARG NEXT_PUBLIC_SENTRY_DSN
ARG SENTRY_DSN
ARG SENTRY_ORG
ARG SENTRY_PROJECT
ARG SENTRY_AUTH_TOKEN
ARG NEXT_PUBLIC_SENTRY_ENVIRONMENT

# Build Next.js / Payload.
RUN DATABASE_URL="$DATABASE_URL" \
    PAYLOAD_SECRET="$PAYLOAD_SECRET" \
    NEXT_PUBLIC_SERVER_URL="$NEXT_PUBLIC_SERVER_URL" \
    NEXT_PUBLIC_SENTRY_DSN="$NEXT_PUBLIC_SENTRY_DSN" \
    SENTRY_DSN="$SENTRY_DSN" \
    SENTRY_ORG="$SENTRY_ORG" \
    SENTRY_PROJECT="$SENTRY_PROJECT" \
    SENTRY_AUTH_TOKEN="$SENTRY_AUTH_TOKEN" \
    NEXT_PUBLIC_SENTRY_ENVIRONMENT="$NEXT_PUBLIC_SENTRY_ENVIRONMENT" \
    pnpm build

# ----------------------------------------
# Runner (production)
# ----------------------------------------
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=10000

# Copy only what Next standalone needs
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Public is optional – create empty dir if unused
COPY --from=builder /app/public ./public
COPY package.json ./

EXPOSE 10000

CMD ["node", "server.js"]