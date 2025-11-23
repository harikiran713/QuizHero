# ---- Build Stage ----
FROM node:18-alpine AS builder
WORKDIR /app

# Copy package files
COPY package.json package-lock.json ./

# Install all dependencies
RUN npm ci

# Copy rest of project
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build Next.js
RUN npm run build


# ---- Production Stage ----
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000

# Copy package files
COPY package.json package-lock.json ./

# Install production dependencies
RUN npm ci --omit=dev

# Copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# Copy only if you have next.config.ts (which you do)
COPY --from=builder /app/next.config.ts ./next.config.ts

# Prisma runtime files
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

EXPOSE 3000

CMD ["npm", "start"]
