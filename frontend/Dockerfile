FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies required by node-gyp and alpine
RUN apk add --no-cache libc6-compat python3 make g++

# Configure memory limits for npm/node
ENV NODE_OPTIONS="--max-old-space-size=1024 --dns-result-order=ipv4first"
ENV NEXT_TELEMETRY_DISABLED=1

# Install dependencies first (caching layer)
COPY package.json package-lock.json* ./
# Use clean npm install and immediately clear cache in the same layer to save space
RUN npm ci --prefer-offline --no-audit --no-fund --legacy-peer-deps && \
    npm cache clean --force

# Copy application source code
COPY . .

# Run the app in development mode
CMD ["npm", "run", "dev"]
