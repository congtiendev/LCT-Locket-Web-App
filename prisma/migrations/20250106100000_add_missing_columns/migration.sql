-- Add missing columns to users table for Google OAuth support
-- Migration to ensure production database matches schema

-- Add google_id column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='google_id') THEN
        ALTER TABLE "users" ADD COLUMN "google_id" TEXT;
        CREATE UNIQUE INDEX "users_google_id_key" ON "users"("google_id");
    END IF;
END $$;

-- Add username column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='username') THEN
        ALTER TABLE "users" ADD COLUMN "username" TEXT;
        CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
    END IF;
END $$;

-- Add bio column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='bio') THEN
        ALTER TABLE "users" ADD COLUMN "bio" TEXT;
    END IF;
END $$;

-- Add last_login_at column if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='users' AND column_name='last_login_at') THEN
        ALTER TABLE "users" ADD COLUMN "last_login_at" TIMESTAMP(3);
    END IF;
END $$;

-- Create indexes if they don't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='users_email_idx') THEN
        CREATE INDEX "users_email_idx" ON "users"("email");
    END IF;
END $$;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='users_username_idx') THEN
        CREATE INDEX "users_username_idx" ON "users"("username");
    END IF;
END $$;

DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname='users_google_id_idx') THEN
        CREATE INDEX "users_google_id_idx" ON "users"("google_id");
    END IF;
END $$;