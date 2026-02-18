# Vibey master container
FROM node:22-alpine

# Install docker-cli only (not the daemon)
RUN apk add --no-cache docker-cli bash

WORKDIR /app

# Copy package files and install dependencies
COPY package.json ./
RUN npm install --production

# Copy application files
COPY vibey-server.js vibey-client.js vibey-test-client.js vibey-test-server.js vibey-prompt.md ./

# Bake config.json into image as seed (API keys etc.)
RUN mkdir -p /app/seed /app/vibey
COPY vibey/config.json /app/seed/config.json

# Entrypoint seeds config into volume on first run, then starts node
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3001

ENTRYPOINT ["/app/docker-entrypoint.sh"]
