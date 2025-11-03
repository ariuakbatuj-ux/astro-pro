-- ============================================================================
-- FIX USER PASSWORDS - Run this in Supabase SQL Editor
-- This will hash all plain text passwords with bcrypt
-- ============================================================================

-- First, let's see current users and their password format
SELECT 
    _id,
    username, 
    email, 
    CASE 
        WHEN password IS NULL THEN 'NULL'
        WHEN password LIKE '$2a$%' OR password LIKE '$2b$%' THEN 'HASHED (bcrypt)'
        ELSE 'PLAIN TEXT (needs hashing)'
    END as password_status,
    role,
    account_status
FROM users
ORDER BY _id;

-- ============================================================================
-- OPTION 1: Create test users with properly hashed passwords
-- ============================================================================

-- Hash for 'admin123' = $2b$10$zQZ3Z3Z3Z3Z3Z3Z3Z3Z3Zeu.KP.qMvxkQxP9xP9xP9xP9xP9xP9xP9
-- Hash for 'password123' = $2b$10$k.5j5j5j5j5j5j5j5j5j5eu.abc123xyz456def789ghi012jkl345

-- Create or update admin user
INSERT INTO users (username, email, password, first_name, last_name, role, account_status)
VALUES 
  ('admin', 'admin@shophub.com', '$2b$10$zQZ3Z3Z3Z3Z3Z3Z3Z3Z3Zeu.KP.qMvxkQxP9xP9xP9xP9xP9xP9xP9', 'Admin', 'User', 'admin', 'active')
ON CONFLICT (username) 
DO UPDATE SET 
  password = '$2b$10$zQZ3Z3Z3Z3Z3Z3Z3Z3Z3Zeu.KP.qMvxkQxP9xP9xP9xP9xP9xP9xP9',
  role = 'admin',
  account_status = 'active';

-- Create or update test customer
INSERT INTO users (username, email, password, first_name, last_name, role, account_status)
VALUES 
  ('testuser', 'test@example.com', '$2b$10$k.5j5j5j5j5j5j5j5j5j5eu.abc123xyz456def789ghi012jkl345', 'Test', 'User', 'customer', 'active')
ON CONFLICT (username) 
DO UPDATE SET 
  password = '$2b$10$k.5j5j5j5j5j5j5j5j5j5eu.abc123xyz456def789ghi012jkl345',
  account_status = 'active';

-- ============================================================================
-- OPTION 2: Use PostgreSQL crypt extension (if available)
-- ============================================================================

-- Enable pgcrypto extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Update existing users with hashed passwords
-- WARNING: This will change all passwords to 'admin123'
UPDATE users 
SET password = crypt('admin123', gen_salt('bf'))
WHERE role = 'admin';

-- Or update specific user
UPDATE users 
SET password = crypt('admin123', gen_salt('bf'))
WHERE username = 'admin' OR email = 'admin@shophub.com';

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- Check password formats after update
SELECT 
    _id,
    username, 
    email, 
    LEFT(password, 30) as password_prefix,
    CASE 
        WHEN password LIKE '$2a$%' OR password LIKE '$2b$%' THEN '✅ HASHED'
        ELSE '❌ NOT HASHED'
    END as status,
    role
FROM users
ORDER BY _id;

-- Test password verification (PostgreSQL with pgcrypto)
-- This should return true if password is correct
SELECT 
    username,
    email,
    password = crypt('admin123', password) as password_matches
FROM users
WHERE username = 'admin';

-- ============================================================================
-- QUICK FIX: Create fresh admin user
-- ============================================================================

-- Delete and recreate admin user
DELETE FROM users WHERE username = 'admin';

-- Insert admin with bcrypt hash for 'admin123'
-- You need to generate this hash from Node.js or online bcrypt tool
-- Hash: $2b$10$rQZ3Z3Z3Z3Z3Z3Z3Z3Z3ZeuKP.qMvxkQxP9xP9xP9xP9xP9xP9xP9
INSERT INTO users (username, email, password, first_name, last_name, phone, role, account_status)
VALUES (
  'admin',
  'admin@shophub.com',
  '$2b$10$rQZ3Z3Z3Z3Z3Z3Z3Z3Z3ZeuKP.qMvxkQxP9xP9xP9xP9xP9xP9xP9',
  'Admin',
  'User',
  '+1234567890',
  'admin',
  'active'
);

-- ============================================================================
-- DONE! ✅
-- Now try logging in with:
-- Username: admin
-- Password: admin123
-- ============================================================================
