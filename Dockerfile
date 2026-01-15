# Multi-stage Dockerfile for Next.js optimized for Google Cloud Run
# Builds the app, then runs it in a minimal runtime image

FROM node:18-alpine AS builder
WORKDIR /app

# Install dependencies based on lockfile for reproducible builds
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline --no-audit --progress=false

# Copy source and build
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Only production deps
COPY package.json package-lock.json* ./
RUN npm ci --production --prefer-offline --no-audit --progress=false

# Copy next build output and public assets
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

EXPOSE 8080

# Cloud Run sets $PORT; Next respects PORT env var
CMD ["npm", "start"]
