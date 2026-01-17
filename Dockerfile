# Multi-stage Dockerfile for Next.js optimized for Google Cloud Run
# Builds the app, then runs it in a minimal runtime image

FROM node:22-alpine AS builder
WORKDIR /app

# Copy Prisma schema first (needed for postinstall script)
COPY prisma ./prisma
COPY package.json package-lock.json* ./

# Install dependencies (postinstall runs prisma generate)
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat

# Added --legacy-peer-deps to avoid strict peer dependency issues (common with React 19)
RUN npm ci --legacy-peer-deps --prefer-offline --no-audit --progress=false

# Copy source and build
COPY . .

# Enable standalone output for smaller docker image
ENV NEXT_OUTPUT=standalone

RUN npm run build

FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Copy Prisma schema and config files if needed at runtime
# (Standalone build often bundles what it needs, but keeping schema is sometimes useful for migrations)
COPY prisma ./prisma

# Copy JSON data files needed by toolsData 
# NOTE: In standalone mode, these need to be copied relative to where the server is running or trace them.
# The standalone build puts everything in .next/standalone.
# We need to ensure static assets and public folder are also copied.

COPY --from=builder /app/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Check if we need to manually copy the JSON files if they aren't traced. 
# Usually 'require' calls are traced. If they are read via fs.readFileSync, they might not be.
# Just in case, copying them to the root as before, because standalone might expect them in the working dir.
COPY *-tools-report.json ./
COPY *-tools-summary.md ./

EXPOSE 8080

# Cloud Run sets $PORT; Next respects PORT env var
# For standalone, we run 'node server.js'
CMD ["node", "server.js"]
