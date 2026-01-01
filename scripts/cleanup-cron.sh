#!/bin/bash

# Cron job script to cleanup expired lab users
# Add to crontab: */30 * * * * /path/to/cleanup-cron.sh

API_KEY="your-api-secret-key-here"
API_URL="http://localhost:3000/api/cleanup-expired"

curl -X POST \
  -H "x-api-key: $API_KEY" \
  -H "Content-Type: application/json" \
  "$API_URL"
