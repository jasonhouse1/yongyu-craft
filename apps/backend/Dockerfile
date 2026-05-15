# Build context: monorepo root (repo root must be Docker build context)
FROM node:20-alpine AS base
RUN npm install -g pnpm@10

# ── deps stage: install workspace dependencies ──────────────────────────────
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./
COPY tsconfig.base.json ./
COPY apps/backend/package.json ./apps/backend/
RUN pnpm install --frozen-lockfile --filter backend

# ── builder stage: generate Prisma client + compile TypeScript ───────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/backend/node_modules ./apps/backend/node_modules
COPY tsconfig.base.json ./
COPY apps/backend/ ./apps/backend/
RUN pnpm --filter backend db:generate
RUN pnpm --filter backend build

# ── runner stage: minimal production image ───────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Preserve apps/backend/ directory structure so compiled JS relative imports
# (e.g. ../../../generated/prisma from dist/shared/db/) resolve correctly.
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/backend/node_modules ./apps/backend/node_modules
COPY --from=builder /app/apps/backend/dist ./apps/backend/dist
COPY --from=builder /app/apps/backend/generated ./apps/backend/generated

EXPOSE 3000
CMD ["node", "apps/backend/dist/server.js"]
