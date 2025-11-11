# Fix Google OAuth Enum Error on Render

## Problem
When deploying to Render, Google OAuth fails with error:
```
Invalid `prisma.user.findUnique()` invocation
Value 'GOOGLE' not found in enum 'AuthProvider'
```

## Root Cause
The production database has enum value `'GOOGLE'` (uppercase) while the Prisma schema defines `'google'` (lowercase).

## Solution

### Option 1: Run Fix Script via Render Shell (Recommended)

1. **Access Render Shell:**
   - Go to your service on Render Dashboard
   - Click on "Shell" tab
   - Wait for shell to load

2. **Run the fix script:**
   ```bash
   node scripts/fix-production-enums.js
   ```

3. **Verify the fix:**
   The script will:
   - Show current enum values
   - Update any users with `GOOGLE` to `google`
   - Test Prisma queries
   - Display results

4. **Restart the service:**
   - Go back to Render Dashboard
   - Click "Manual Deploy" > "Clear build cache & deploy"

### Option 2: Run SQL Directly via Database Connection

1. **Connect to your Render PostgreSQL database:**
   - Get connection string from Render Dashboard
   - Use pgAdmin, DBeaver, or psql client

2. **Run this SQL:**
   ```sql
   -- Update users with GOOGLE provider to google
   UPDATE users
   SET provider = 'google'::"AuthProvider"
   WHERE provider::text = 'GOOGLE';

   -- Verify the fix
   SELECT provider, COUNT(*) as count
   FROM users
   GROUP BY provider;
   ```

3. **Restart your Render service**

### Option 3: Run Migration from Local (If you have production DB access)

1. **Set production DATABASE_URL:**
   ```bash
   export DATABASE_URL="your-render-postgres-url"
   ```

2. **Run the fix script:**
   ```bash
   node scripts/fix-production-enums.js
   ```

3. **Deploy to Render:**
   - Push changes to git
   - Render will auto-deploy

## Prevention

To prevent this issue in the future:

1. **Always use lowercase enum values** matching the Prisma schema
2. **Run migrations properly** when deploying
3. **Use the deploy script** from `scripts/deploy-schema.js` to verify schema after deployment

## Verification

After applying the fix, test Google OAuth:

1. Go to: `https://lct-locket-web-app.onrender.com/api/auth/google`
2. Complete Google sign-in
3. Check logs for successful authentication

Expected success log:
```
[INFO] Google OAuth callback received for: user@example.com
[INFO] Existing Google user found: user@example.com
```

## Files Created

- `scripts/fix-production-enums.js` - Node.js script to fix enum values
- `scripts/fix-enum-values.sql` - Raw SQL for manual execution
- `DEPLOYMENT-FIX.md` - This documentation

## Need Help?

If the issue persists after running the fix:

1. Check Render logs: `Dashboard > Logs`
2. Verify database enum values:
   ```sql
   SELECT enumlabel FROM pg_enum
   WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'AuthProvider');
   ```
3. Ensure Prisma client is regenerated: `npx prisma generate`
