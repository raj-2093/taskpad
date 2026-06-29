# Stage 1: Build
FROM node:latest AS builder

WORKDIR /home/app

# Copy package files first (better caching)
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# If you use TypeScript or need build step:
# RUN npm run build

# Stage 2: Production (smaller final image)
FROM node:latest

ENV NODE_ENV=production

WORKDIR /home/app

# Copy only what's needed from builder
COPY --from=builder /home/app .

# Non-root user for security
USER node

EXPOSE 8080   # Change if your app uses a different port

# Use exec form so signals (SIGTERM) reach Node properly
CMD ["node", "server.js"]   # or "dist/index.js", "app.js", etc.