# 1) Builder stage
FROM node:20-alpine AS builder
WORKDIR /app

COPY package.json package-lock.json tsconfig.json prisma/ ./
RUN npm ci

# Generate Prisma client
RUN npx prisma generate

COPY src/ src/
COPY scripts/ scripts/
RUN npm run build


# 2) Production stage
FROM node:20-alpine
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --only=production

# Also copy over the generated client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

COPY --from=builder /app/dist ./dist

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "dist/main.js"]