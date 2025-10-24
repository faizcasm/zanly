#!/bin/bash
# entrypoint.sh
# Usage: ./entrypoint.sh <host>:<port> -- <command>

set -e

hostport="$1"
shift
cmd="$@"

host=$(echo $hostport | cut -d':' -f1)
port=$(echo $hostport | cut -d':' -f2)

echo "Waiting for Postgres at $host:$port..."

# Pure bash loop to check TCP connection (no nc/netcat required)
while ! (echo > /dev/tcp/$host/$port) 2>/dev/null; do
  echo "Postgres is unavailable - sleeping"
  sleep 2
done

echo "Postgres is up! Starting app..."
exec $cmd

