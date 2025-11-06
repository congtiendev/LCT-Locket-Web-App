# Database Seeding

This directory contains database seed files for the Locket Web App.

## Available Seed Scripts

### 1. Development Seed (`seed.js`)
Basic seed data for development and testing (5 users, minimal data).

```bash
npm run seed
# or
npm run prisma:seed
```

**Contains:**
- 5 users (mix of email and Google OAuth)
- 5 user settings
- 8 friendships (4 pairs)
- 4 friend requests
- 10 photos
- 6 photo reactions
- 9 chat messages
- 4 notifications
- 4 refresh tokens

### 2. Production Seed (`production-seed.js` + `production-seed.sql`)
Comprehensive seed data for production-like testing (20 users, extensive data).

```bash
npm run seed:prod
# or
npm run prisma:seed:prod
```

**Contains:**
- 20 users (mix of email and Google OAuth accounts)
- 20 user settings
- 32 friendships (Công Tiến has 15 friends)
- 6 friend requests (3 pending, 2 accepted, 1 rejected)
- 40 photos (distributed across users, last 7 days)
- 24 photo reactions
- 21 chat messages (7 conversations)
- 14 notifications (9 unread, 5 read)
- 5 refresh tokens (4 active, 1 revoked)

## Test Credentials

After seeding, you can login with:

**Main Test Account:**
- Email: `congtiendev@gmail.com`
- Password: `722003xx`
- User ID: `550e8400-e29b-41d4-a716-446655440001`

**Additional Test Accounts:**
All email/password accounts use the same password: `722003xx`

## When to Use Each Seed

### Use Development Seed When:
- Starting fresh development
- Running automated tests
- Need minimal data for specific feature testing
- Want faster seed execution

### Use Production Seed When:
- Testing real-world scenarios
- Demonstrating the application
- Performance testing with realistic data volume
- Testing pagination, search, and filtering
- Need diverse user relationships and interactions

## Resetting the Database

If you need to start fresh:

```bash
# Option 1: Reset everything (migrations + data)
npm run prisma:reset

# Option 2: Clear data only, keep schema
npx prisma migrate reset --skip-seed

# Then re-seed:
npm run seed          # Development data
npm run seed:prod     # Production data
```

## Customizing Seed Data

### Development Seed
Edit [`seed.js`](./seed.js) to modify the basic seed data. This is a JavaScript file using Prisma Client.

### Production Seed
The production seed uses two files:
1. [`production-seed.sql`](./production-seed.sql) - Pure SQL with INSERT statements
2. [`production-seed.js`](./production-seed.js) - JavaScript runner that executes the SQL

To customize:
- **Simple changes**: Edit the SQL file directly
- **Complex logic**: Modify the JavaScript runner

### Tips for Custom Seeds
1. **Use `ON CONFLICT DO NOTHING`** to make seeds idempotent
2. **Use relative timestamps** like `NOW() - INTERVAL '2 days'` for realistic data
3. **Maintain referential integrity** - insert users before friendships
4. **Test locally first** before running in production

## Troubleshooting

### "duplicate key value violates unique constraint"
Data already exists. Either:
1. Reset the database first: `npm run prisma:reset`
2. Or ignore (seeds use `ON CONFLICT DO NOTHING`)

### "foreign key constraint violation"
Insert order matters. Check that referenced records exist first (e.g., users before friendships).

### "column does not exist"
Run migrations first:
```bash
npx prisma migrate deploy  # Production
npx prisma migrate dev      # Development
```

### Connection Issues
Check your `.env` file has a valid `DATABASE_URL`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/database"
```

## Production Deployment

For production environments:

1. **First Deployment** (empty database):
   ```bash
   npx prisma migrate deploy
   npm run seed:prod
   ```

2. **Subsequent Deployments** (existing data):
   ```bash
   # Only run migrations, skip seeding
   npx prisma migrate deploy
   ```

3. **Render/Railway/Vercel**:
   Add to your build command:
   ```bash
   npx prisma migrate deploy && npm run build
   ```

## Data Overview

### User Distribution (Production Seed)
- **Email/Password users**: 12
- **Google OAuth users**: 8
- **With avatars**: All (Unsplash images)
- **With bio**: All
- **Recent activity**: Varied (last 90 days)

### Relationship Data
- **Main user (Công Tiến)**: 15 friends, 3 pending requests
- **Friend favorites**: 3 marked as favorites
- **Nicknames**: Some friends have nicknames
- **Cross-friendships**: Users are friends with each other too

### Content Data
- **Photos**: Recent (last 7 days), various times
- **Reactions**: Emoji reactions (❤️, 🔥, 😍, ✨, etc.)
- **Messages**: Active conversations with unread messages
- **Notifications**: Mix of unread and read notifications

## Adding New Seed Data

### Quick Method (SQL)
1. Edit `production-seed.sql`
2. Add your INSERT statements
3. Run: `npm run seed:prod`

### JavaScript Method
1. Edit `seed.js` or create new seed file
2. Use Prisma Client for type safety:
   ```javascript
   await prisma.user.create({
     data: {
       email: 'newuser@example.com',
       name: 'New User',
       // ...
     }
   })
   ```
3. Run your seed script

### Best Practices
- ✅ Use UUIDs for IDs (or let Prisma generate them)
- ✅ Hash passwords with bcrypt
- ✅ Use realistic data (faker.js, Unsplash for images)
- ✅ Maintain data relationships
- ✅ Add ON CONFLICT clauses for idempotency
- ❌ Don't hardcode sensitive data
- ❌ Don't use real user emails/data in prod
- ❌ Don't commit .env files

## Related Documentation
- [Prisma Seeding Guide](https://www.prisma.io/docs/guides/database/seed-database)
- [Production DB Fix](../../docs/PRODUCTION_DB_FIX.md)
- [Schema Documentation](../schema.prisma)
