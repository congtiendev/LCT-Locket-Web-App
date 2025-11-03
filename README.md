# LCT-LOCKET-WEB-APP

Enterprise-grade Node.js REST API with modular architecture

## Features

- **Authentication & Authorization**: JWT-based auth with refresh tokens
- **Modular Architecture**: Clean separation of concerns
- **Database**: PostgreSQL with Prisma ORM
- **Caching**: Redis integration
- **Queue System**: Bull for background jobs
- **Real-time**: Socket.IO support
- **File Upload**: Local and S3 storage
- **Validation**: Joi schema validation
- **Error Handling**: Centralized error management
- **Logging**: Winston for structured logging
- **Testing**: Jest for unit, integration, and E2E tests
- **Security**: Helmet, CORS, rate limiting, XSS protection
- **Docker**: Development and production configurations

## Prerequisites

- Node.js >= 18.0.0
- PostgreSQL >= 13
- Redis >= 6

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env

# Configure your .env file with database credentials
# See docs/database/setup.md for detailed instructions

# Create database and schema
npx prisma db push

# Seed database
npm run prisma:seed
```

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Lint code
npm run lint

# Format code
npm run format
```

### Docker

```bash
# Start services
npm run docker:dev

# Stop services
npm run docker:down
```

## Project Structure

```
src/
├── modules/          # Feature modules
│   ├── auth/        # Authentication module
│   └── user/        # User management module
├── shared/          # Shared utilities
│   ├── middlewares/ # Express middlewares
│   ├── utils/       # Utility functions
│   ├── constants/   # Constants
│   ├── helpers/     # Helper functions
│   └── exceptions/  # Custom exceptions
├── core/            # Core infrastructure
│   ├── database/    # Database configuration
│   ├── cache/       # Redis cache
│   ├── queue/       # Bull queues
│   ├── storage/     # File storage
│   └── events/      # Event system
├── config/          # Configuration files
├── jobs/            # Cron jobs
├── sockets/         # Socket.IO handlers
└── routes/          # Route definitions
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Get current user

### Users

- `GET /api/users` - Get all users (Admin)
- `GET /api/users/:id` - Get user by ID (Admin)
- `POST /api/users` - Create user (Admin)
- `PUT /api/users/:id` - Update user (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile

## Environment Variables

See `.env.example` for all available environment variables.

## Testing

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Generate coverage report
npm test -- --coverage
```

## Scripts

- `npm run dev` - Start development server
- `npm start` - Start production server
- `npm test` - Run tests
- `npm run lint` - Lint code
- `npm run format` - Format code
- `npm run prisma:generate` - Generate Prisma Client
- `npm run prisma:migrate` - Run migrations
- `npm run prisma:studio` - Open Prisma Studio
- `npm run prisma:seed` - Seed database

## Documentation

- **[Database Setup](docs/database/setup.md)** - Complete database setup guide
- **[Database Schema](docs/database/schema.md)** - Schema documentation
- **[API Documentation](docs/api/)** - REST API endpoints
- **[Architecture](docs/architecture.md)** - System architecture
- **[Deployment](docs/deployment.md)** - Production deployment

## License

MIT
