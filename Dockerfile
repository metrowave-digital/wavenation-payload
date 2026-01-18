# ---------- deps ----------
FROM node:20.11.1-bookworm-slim AS deps
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# ---------- build ----------
FROM node:20.11.1-bookworm-slim AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
RUN pnpm build

# ---------- run ----------
FROM node:20.11.1-bookworm-slim AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=10000

# Next standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 10000
CMD ["node", "server.js"]
