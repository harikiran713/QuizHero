# -------------------------------
# 1. Install dependencies & build app
# -------------------------------
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy dependencies first (layer caching)
COPY package.json package-lock.json* ./
RUN npm ci

# Copy rest of the project (including next.config.js)
COPY . .

# Build the Next.js app
RUN npm run build

# -------------------------------
# 2. Production image
# -------------------------------
FROM node:18-alpine AS runner

WORKDIR /app

# Set NODE_ENV for production
ENV NODE_ENV=production

# Install only production dependencies
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Copy build output and public folder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# ✅ Only copy next.config.js *if it exists* (optional):
# This line causes errors if next.config.js is not in the project.
# Comment it out if you're not using a custom config:
# COPY --from=builder /app/next.config.js ./next.config.js

# Copy build output and public folder
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public

# Copy only if you are using this file (adjust as needed)
# COPY --from=builder /app/next.config.js ./next.config.js
# COPY --from=builder /app/next.config.mjs ./next.config.mjs

# Optional config files
COPY --from=builder /app/next-env.d.ts ./next-env.d.ts
COPY --from=builder /app/tsconfig.json ./tsconfig.json

# Expose default Next.js port
EXPOSE 3000

# Start the app
CMD ["npm", "start"]
