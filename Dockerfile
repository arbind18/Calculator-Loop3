# Multi-stage Dockerfile for Next.js optimized for Google Cloud Run
# Builds the app, then runs it in a minimal runtime image

FROM node:18-alpine AS builder
WORKDIR /app

# Copy Prisma schema first (needed for postinstall script)
COPY prisma ./prisma
COPY package.json package-lock.json* ./

# Install dependencies (postinstall runs prisma generate)
RUN npm ci --prefer-offline --no-audit --progress=false

# Copy source and build
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Copy Prisma schema and config files
COPY prisma ./prisma
COPY package.json package-lock.json* ./

# Copy JSON data files needed by toolsData
COPY *-tools-report.json ./
COPY *-tools-summary.md ./

# Only production deps (includes prisma client)
RUN npm ci --production --prefer-offline --no-audit --progress=false

# Copy generated Prisma client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# Copy next build output and public assets
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 8080

# Cloud Run sets $PORT; Next respects PORT env var
CMD ["npm", "start"]
