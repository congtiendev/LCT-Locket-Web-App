FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies required by Prisma and curl for health check
RUN apk add --no-cache openssl libc6-compat curl

# Copy package files first for better caching
COPY package*.json ./

# Copy prisma schema BEFORE npm install (required for postinstall hook)
COPY prisma ./prisma/

# Install dependencies (will trigger postinstall: prisma generate)
RUN npm ci --only=production && npm cache clean --force

# Copy application code
COPY . .

# Create required directories
RUN mkdir -p uploads/photos/thumbnails logs

# Set appropriate permissions
RUN chmod +x start.sh 2>/dev/null || echo "start.sh not found, will use CMD fallback"

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001

# Change ownership of app directory
RUN chown -R nextjs:nodejs /app
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

# Start application - try start.sh first, fallback to direct command
CMD ["sh", "-c", "if [ -f ./start.sh ]; then ./start.sh; else npx prisma migrate deploy && npm start; fi"]
