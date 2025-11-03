FROM node:18-alpine

WORKDIR /app

# Install OpenSSL and other dependencies required by Prisma
RUN apk add --no-cache openssl libc6-compat

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy prisma schema
COPY prisma ./prisma/

# Generate Prisma Client
RUN npx prisma generate

# Copy application code
COPY . .

# Create uploads directory
RUN mkdir -p uploads logs

# Make startup script executable
RUN chmod +x start.sh

# Expose port
EXPOSE 3000

# Start application with migrations
CMD ["./start.sh"]
