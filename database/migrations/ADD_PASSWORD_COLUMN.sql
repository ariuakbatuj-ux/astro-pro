-- Add password column to users table for authentication

ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password VARCHAR(255) DEFAULT 'supabase_auth';

-- Optional: Add password update timestamp
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password_updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Verify the column was added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;
