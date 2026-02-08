# Docker merger container for concatenating video chunks
FROM node:20-bullseye

# Install FFmpeg
RUN apt-get update && apt-get install -y \
    ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Create app directory
WORKDIR /app

# Copy merger script
COPY packages/cloud-rendering/deployments/docker/scripts/merger.js ./

# Set entrypoint
CMD ["node", "merger.js"]
