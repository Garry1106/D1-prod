# Simple development Dockerfile - with glibc for ONNX compatibility
FROM node:20-slim AS builder

# Install necessary dependencies for Prisma and ONNX Runtime
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy package files first
COPY package*.json ./

# Copy prisma directory to make schema files available during install
COPY prisma/ ./prisma/

# Install dependencies
RUN npm install

# Copy remaining project files
COPY . .

# Generate Prisma clients manually
RUN npx prisma generate --schema=./prisma/schema1.prisma
RUN npx prisma generate --schema=./prisma/schema2.prisma

# Build the Next.js application (this creates the standalone folder)
RUN npm run build

FROM node:20-slim AS runner

WORKDIR /app

# Install necessary dependencies for running ts-node
RUN apt-get update && apt-get install -y \
    openssl \
    && rm -rf /var/lib/apt/lists/*

# Copy the standalone output directory from Next.js build
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

# Copy package.json and package-lock.json for ts-node dependencies
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/tsconfig.json ./

# Copy the server.mts file
COPY --from=builder /app/server.mts ./

# Copy the prisma directory and node_modules for ts-node and prisma
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Set environment variable for hosting
ENV HOSTNAME="0.0.0.0"
ENV PORT=3000
# By default, use the socket server
ENV USE_SOCKET="true"

# Entry script with switch
RUN echo '#!/bin/sh\n\
if [ "$USE_SOCKET" = "true" ]; then\n\
  echo "Starting with custom socket server..."\n\
  NODE_OPTIONS="--loader ts-node/esm --trace-warnings --no-warnings" node_modules/.bin/ts-node server.mts\n\
else\n\
  echo "Starting with standard Next.js server..."\n\
  node server.js\n\
fi' > start.sh && chmod +x start.sh

CMD ["./start.sh"]