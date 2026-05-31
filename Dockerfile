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

# Re-enable pnpm (important for multi-stage)
RUN corepack enable

# Build Next.js (standalone output)
RUN pnpm build

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
