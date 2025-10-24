# ---------- Stage 1: Base ----------
FROM node:20

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json first (for caching)
COPY package*.json ./

# Install dependencies (including cross-env locally)
RUN npm install --production

# Copy the rest of the application code
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Expose backend port
EXPOSE 4000

# Set environment variable for production
ENV NODE_ENV=production

# Install bash and curl for wait-for-it
RUN apt-get update && apt-get install -y bash curl && rm -rf /var/lib/apt/lists/*

# Copy entrypoint script
COPY entrypoint.sh /usr/src/app/entrypoint.sh
RUN chmod +x /usr/src/app/entrypoint.sh

# Start command: wait for Postgres, then run app
CMD ["/bin/bash", "/usr/src/app/entrypoint.sh", "postgres:5432", "--", "npm", "run", "prod"]
