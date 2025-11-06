# Production Database Schema Fix

## Problem
The production database is missing the `username` column and other schema updates, causing the Google OAuth authentication to fail with the error:

```
The column `users.username` does not exist in the current database.
```

## Root Cause
The project was using `prisma db push` for local development, which doesn't create migrations. Production deployments require proper migrations to update the database schema.

## Solution

### Step 1: Commit the Migration Files
First, make sure the migration files are committed to your repository:

```bash
git add prisma/migrations/
git commit -m "feat: Add initial database migration"
git push
```

### Step 2: Deploy Migrations to Production

#### Option A: Using Render Dashboard (Recommended)
1. Go to your Render dashboard
2. Select your web service
3. Click on "Shell" to open a terminal
4. Run the migration deployment command:
   ```bash
   npm run prisma:migrate:prod
   ```
   Or directly:
   ```bash
   npx prisma migrate deploy
   ```

#### Option B: Using Render CLI
If you have Render CLI installed:
```bash
render shell <your-service-name>
npx prisma migrate deploy
```

#### Option C: Add to Build Command
Update your build command in Render to include migrations:
```bash
npm install && npx prisma generate && npx prisma migrate deploy && npm run build
```

This ensures migrations run automatically on every deployment.

### Step 3: Verify the Fix
After running the migration, test the Google OAuth login again. The `username` column should now exist and authentication should work.

### Step 4: Check Database
You can verify the schema by connecting to your production database:
```bash
npx prisma studio --browser none
```

Or check directly in Render's PostgreSQL dashboard.

## What the Migration Does

The migration `20250106000000_init` creates the complete database schema including:

- All tables (users, photos, friendships, etc.)
- All columns including the missing `username` field
- All indexes for performance
- All foreign key constraints
- All enums (AuthProvider, FriendRequestStatus, NotificationType)

## Prevention

To prevent this issue in the future:

1. **Always use migrations for schema changes:**
   ```bash
   # For development
   npx prisma migrate dev --name description_of_change

   # For production
   npx prisma migrate deploy
   ```

2. **Never use `prisma db push` in production** - it's only for rapid prototyping in development

3. **Add migration deployment to your CI/CD pipeline:**
   - Include `npx prisma migrate deploy` in your build/deploy scripts
   - This ensures the database schema is always in sync with your code

4. **Test migrations locally first:**
   ```bash
   # Test against a production-like database
   DATABASE_URL="your-staging-db-url" npx prisma migrate deploy
   ```

## Troubleshooting

### Migration Fails with "relation already exists"
This means some tables were already created (possibly by `prisma db push`). You have two options:

1. **Mark the migration as applied (if schema matches):**
   ```bash
   npx prisma migrate resolve --applied 20250106000000_init
   ```

2. **Reset and re-run (⚠️ DANGER - deletes all data):**
   ```bash
   # Only do this if you can afford to lose data!
   npx prisma migrate reset
   npx prisma migrate deploy
   npm run seed:prod  # Re-seed the database
   ```

### Connection Issues
If you can't connect to production database:
1. Check DATABASE_URL environment variable is set correctly
2. Verify your IP is whitelisted in Render/database firewall
3. Ensure database is accessible from your deployment environment

### Need to Add More Changes?
If you need to make additional schema changes:

```bash
# 1. Update prisma/schema.prisma with your changes
# 2. Create a new migration
npx prisma migrate dev --name your_change_description

# 3. Commit and deploy
git add prisma/
git commit -m "feat: Add your changes"
git push

# 4. Deploy to production (runs automatically if in build command)
npx prisma migrate deploy
```

## Related Documentation
- [Render Deployment Guide](./render-deployment.md)
- [Google OAuth Setup](./google-oauth-setup.md)
- [Database Seeding](../prisma/seeds/README.md)
