-- Add first_name, last_name, and phone columns to users table

-- Add first_name column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS first_name VARCHAR(100);

-- Add last_name column
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_name VARCHAR(100);

-- Add phone column (if not exists)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS phone VARCHAR(50);

-- Optional: Add comment to the columns
COMMENT ON COLUMN users.first_name IS 'User first name';
COMMENT ON COLUMN users.last_name IS 'User last name';
COMMENT ON COLUMN users.phone IS 'User phone number';

-- Verify the columns were added
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'users'
ORDER BY ordinal_position;

-- ============================================================================
-- ✅ SETUP COMPLETE!
-- ============================================================================
-- Your users table now has:
-- - first_name (for storing user's first name)
-- - last_name (for storing user's last name)  
-- - phone (for storing phone number)
--
-- These work together with the profiles table which also has:
-- - name (full name)
-- - phone (duplicate for convenience)
-- ============================================================================
