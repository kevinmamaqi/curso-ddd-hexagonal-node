# 1) Build stage
FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json package-lock.json tsconfig.json ./
RUN npm ci
COPY src/ src/
RUN npm run build

# 2) Production stage
FROM node:20-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production
COPY --from=builder /app/dist/ ./dist/

ENV NODE_ENV=production

EXPOSE 3000
CMD ["node", "dist/main.js"]