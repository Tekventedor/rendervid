# Docker worker container for distributed rendering
FROM node:20-bullseye

# Install Chromium and FFmpeg
RUN apt-get update && apt-get install -y \
    chromium \
    chromium-driver \
    ffmpeg \
    fonts-liberation \
    fonts-noto-color-emoji \
    libnss3 \
    libatk-bridge2.0-0 \
    libdrm2 \
    libxkbcommon0 \
    libgbm1 \
    libasound2 \
    && rm -rf /var/lib/apt/lists/*

# Set environment variables for Chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# Create app directory
WORKDIR /app

# Install playwright-core locally (needed by worker script)
RUN npm init -y && npm install playwright-core@1.49.1

# Copy worker script
COPY packages/cloud-rendering/deployments/docker/scripts/worker.js ./

# Copy browser renderer bundle for actual template rendering
COPY packages/renderer-node/dist/browser-renderer.global.js ./browser-renderer.global.js

# Set entrypoint
CMD ["node", "worker.js"]
