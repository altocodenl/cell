#!/bin/sh
# Seed config.json into the volume if it doesn't exist yet
if [ ! -f /app/vibey/config.json ] && [ -f /app/seed/config.json ]; then
  cp /app/seed/config.json /app/vibey/config.json
  echo "Seeded config.json into volume from build"
fi

exec node vibey-server.js
