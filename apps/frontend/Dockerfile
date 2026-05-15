# Build context: monorepo root (repo root must be Docker build context)
FROM node:20-alpine AS base
RUN npm install -g pnpm@10

# ── deps stage: install workspace dependencies ──────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY apps/frontend/package.json ./apps/frontend/
RUN pnpm install --frozen-lockfile --filter frontend

# ── builder stage: next build ────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/frontend/node_modules ./apps/frontend/node_modules
COPY apps/frontend/ ./apps/frontend/
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm --filter frontend build

# ── runner stage ─────────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Run next start from the frontend package directory
WORKDIR /app/apps/frontend
COPY --from=builder /app/node_modules /app/node_modules
COPY --from=builder /app/apps/frontend/node_modules ./node_modules
COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder /app/apps/frontend/package.json ./package.json
COPY --from=builder /app/apps/frontend/next.config.ts ./next.config.ts
COPY --from=builder /app/apps/frontend/messages ./messages

EXPOSE 3000
CMD ["node_modules/.bin/next", "start"]
