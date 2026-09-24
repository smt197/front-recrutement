# Stage 1: Build the Angular application
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Install build dependencies
RUN apk add --no-cache python3 make g++

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies with clean install for reproducible builds
RUN npm ci --legacy-peer-deps --silent

# Copy source files (use .dockerignore to exclude unnecessary files)
COPY . .

# Build the Angular application for production with increased memory
ENV NODE_OPTIONS="--max-old-space-size=8192"
RUN npm run build

# Clean npm cache and remove unnecessary files to reduce image size
RUN npm cache clean --force && \
    rm -rf /root/.npm /tmp/* /app/node_modules

# Stage 2: Serve with nginx
FROM nginx:alpine

# Install wget for healthcheck
RUN apk add --no-cache wget

# Remove default nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built application from builder stage
COPY --from=builder /app/dist/vex /usr/share/nginx/html

# Set proper permissions
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expose port 80
EXPOSE 80

# Add healthcheck
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost/health || exit 1

# Start nginx (run as root to bind to port 80, nginx workers will run as nginx user)
CMD ["nginx", "-g", "daemon off;"]