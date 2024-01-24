# Install dependencies only when needed
# FROM node:16-alpine AS deps
# 72.16 error next@14.0.3: The engine "node" is incompatible with this module. Expected version ">=18.17.0". Got "16.20.2"
FROM node:18-alpine AS deps

RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY . .
RUN yarn install --frozen-lockfile

# FROM node:16-alpine AS builder
FROM node:18-alpine AS builder
WORKDIR /app
COPY --from=deps /app/ ./

ENV NEXT_TELEMETRY_DISABLED 1

RUN yarn build

FROM node:18-alpine AS runner
# FROM node:16-alpine AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]