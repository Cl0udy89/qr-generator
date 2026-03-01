# ---- Build Stage ----
FROM node:20-alpine AS builder

WORKDIR /app
RUN apk add --no-cache libc6-compat python3 make g++

ENV NODE_OPTIONS="--max-old-space-size=1024 --dns-result-order=ipv4first"
ENV NEXT_TELEMETRY_DISABLED=1

COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline --no-audit --no-fund --legacy-peer-deps

COPY . .
RUN npm run build

# ---- Production Runtime Stage ----
FROM node:20-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

# Standalone output automatically compresses all needed dependencies
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
