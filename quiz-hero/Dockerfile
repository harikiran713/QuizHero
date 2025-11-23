# --- Base Stage ---
FROM node:18-alpine AS base
WORKDIR /app
COPY package*.json ./

# --- Dependencies Stage ---
FROM base AS deps
RUN npm ci

# --- Builder Stage ---
FROM deps AS builder
WORKDIR /app
COPY . .
RUN npx prisma generate
RUN npm run build

# --- Runner Stage ---
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy package files
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy required files from builder
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# ❗ IMPORTANT: Copy Prisma schema + migrations
COPY --from=builder /app/prisma ./prisma

# Expose port
EXPOSE 3000

# Start command
CMD ["npm", "run", "start"]
