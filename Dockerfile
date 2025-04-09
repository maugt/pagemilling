# Use a multi-stage build to reduce the final image size
# ------------------------------------------------------
# Stage 1: Build the Next.js application
FROM node:18-alpine AS builder

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

# Expose the port
EXPOSE 3000

# Set the user and group
ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV
USER node
#GROUP node

# Start the server using the standalone output
CMD [ "node", "server.js" ]
