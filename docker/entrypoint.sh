#!/bin/sh

# Capture environment variables and save to a file
env > /app/.env

cat /app/.env

# Start your application
exec "$@"
