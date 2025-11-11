-- Fix enum values in production database
-- This script converts UPPERCASE enum values to lowercase to match schema

-- Step 1: Update existing user records with GOOGLE provider to google
UPDATE users
SET provider = 'google'::text::\"AuthProvider\"
WHERE provider::text = 'GOOGLE';

-- Step 2: Check if GOOGLE value exists in enum (case-insensitive issue)
-- If your database has 'GOOGLE' in the enum, we need to remove it

-- First, let's see what enum values exist
-- SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'AuthProvider');

-- Step 3: If GOOGLE exists and needs to be removed (after updating all records):
-- Note: This only works if no records are using 'GOOGLE' anymore
-- ALTER TYPE "AuthProvider" DROP VALUE IF EXISTS 'GOOGLE';

-- Note: PostgreSQL doesn't support DROP VALUE directly in older versions
-- So we use the update approach above which is safer

-- Verify the fix
SELECT
    provider,
    COUNT(*) as count
FROM users
GROUP BY provider
ORDER BY provider;
