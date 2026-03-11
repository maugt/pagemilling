# Use a multi-stage build to reduce the final image size
# ------------------------------------------------------
# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder

# Install native build tools for better-sqlite3
RUN apk add --no-cache python3 make g++

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies, including dev dependencies, for building Next.js
RUN npm install --frozen-lockfile

# Copy the source code
COPY . ./

# Build the Next.js application for production
RUN npm run build
RUN cp -r public .next/standalone/ && cp -r .next/static .next/standalone/.next/

# Copy better-sqlite3 native module into standalone output
RUN cp -r node_modules/better-sqlite3 .next/standalone/node_modules/better-sqlite3
RUN cp -r node_modules/bindings .next/standalone/node_modules/bindings
RUN cp -r node_modules/file-uri-to-path .next/standalone/node_modules/file-uri-to-path

# Copy seed script
RUN mkdir -p .next/standalone/scripts
RUN cp scripts/seed.js .next/standalone/scripts/

# ------------------------------------------------------
# Stage 2: Create the final, minimal image
FROM node:18-alpine

# Set the working directory
WORKDIR /app

# Copy the standalone output from the builder stage
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./next/static
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./

# Create data directory for SQLite
RUN mkdir -p /app/data && chown node:node /app/data

# Expose the port
EXPOSE 3000

# Set the user and group
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
USER node
#GROUP node

# Start the server using the standalone output
CMD [ "node", "server.js" ]
