# 🔐 AUTHENTICATION FIX GUIDE

## Problem
You're seeing "Invalid email/username or password" even though you're entering the correct credentials.

## Root Cause
The password in the database doesn't match what you're entering. This happens when:
1. Password was hashed incorrectly
2. Password was changed manually in the database without proper hashing
3. Bcrypt salt rounds don't match

## ✅ SOLUTION - Use the Test Auth Page

### Step 1: Visit the Test Page
```
http://localhost:4321/test-auth
```

### Step 2: Check Your Users
The page shows all users in your database with their:
- Username
- Email
- Role
- Account Status
- Password hash format

### Step 3: Reset Your Password

**In the "Reset User Password" section:**

1. Enter your username (e.g., `ariuka`)
2. Enter a new password (e.g., `admin123`)
3. Click "Reset Password"
4. Confirm the action

**The system will:**
- Generate a proper bcrypt hash
- Update the database
- Verify the new password works
- Show you confirmation

### Step 4: Login
Now go to `/signin` and login with:
- Username: `your_username`
- Password: `the_new_password_you_set`

---

## Alternative: Manual SQL Method

If you prefer to use SQL directly, run this in Supabase:

```sql
-- Enable bcrypt extension
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Reset password for your user
UPDATE users 
SET password = crypt('admin123', gen_salt('bf'))
WHERE username = 'ariuka';  -- Change to your username

-- Verify it worked
SELECT 
    username,
    email,
    password = crypt('admin123', password) as password_matches
FROM users
WHERE username = 'ariuka';
```

---

## Default Admin Account

There's also a **hardcoded admin** that works WITHOUT the database:

```
Username: admin
Email: admin@shophub.com
Password: admin123
```

This always works and doesn't require any database setup!

---

## For Future Users

### Create New User with Correct Password:

**Option 1: Use Signup Page**
- Visit `/signup`
- Enter details
- Password will be auto-hashed

**Option 2: SQL with pgcrypto**
```sql
INSERT INTO users (username, email, password, role, account_status)
VALUES (
  'newuser',
  'newuser@example.com',
  crypt('password123', gen_salt('bf')),
  'customer',
  'active'
);
```

---

## Debugging Tools

### Test Login API:
```bash
curl -X POST http://localhost:4321/api/auth/signin \
  -H "Content-Type: application/json" \
  -d '{"emailOrUsername":"ariuka","password":"admin123"}'
```

### Check Console Logs:
The terminal shows detailed logs:
```
Looking up user: ariuka
User lookup result: { found: true, error: undefined }
Verifying password for user: ariuka
Password hash format: $2b$10$
Password valid: false
```

---

## Files Created/Updated

1. ✅ `src/pages/test-auth.astro` - Debug page with password reset
2. ✅ `src/pages/api/test/verify-password.ts` - Test password verification
3. ✅ `src/pages/api/test/reset-password.ts` - Reset user passwords
4. ✅ `src/pages/api/auth/signin.ts` - Added debug logging
5. ✅ `src/pages/signin.astro` - Updated admin credentials
6. ✅ `FIX_USER_PASSWORDS.sql` - SQL scripts for manual fixing
7. ✅ `generate-password-hash.js` - Generate bcrypt hashes

---

## Quick Fix Summary

### Easiest Method:
1. Go to: `http://localhost:4321/test-auth`
2. Scroll to "Reset User Password"
3. Enter your username
4. Enter new password (e.g., `admin123`)
5. Click "Reset Password"
6. Login with new password ✅

### Alternative - Use Hardcoded Admin:
1. Go to `/signin`
2. Username: `admin`
3. Password: `admin123`
4. Works immediately! ✅

---

## Why This Happens

**Bcrypt Password Hashing:**
- Passwords MUST be hashed with bcrypt
- Format: `$2b$10$...` (60 characters)
- Plain text passwords won't work
- Each hash is unique (even for same password)

**Common Mistakes:**
- ❌ Storing plain text password
- ❌ Using wrong bcrypt version
- ❌ Manually editing password in database
- ✅ Always use bcrypt.hash() or SQL crypt()

---

## Need More Help?

**Check your user's password in database:**
```sql
SELECT username, email, 
       LEFT(password, 10) as hash_start,
       CASE 
         WHEN password LIKE '$2%' THEN '✅ HASHED'
         ELSE '❌ PLAIN TEXT'
       END as status
FROM users;
```

**Test a specific password:**
```sql
SELECT username,
       password = crypt('admin123', password) as matches
FROM users
WHERE username = 'ariuka';
```

---

## ✅ RESULT

After using the test page or SQL method:
- ✅ Password properly hashed with bcrypt
- ✅ Login works correctly
- ✅ No more authentication errors
- ✅ Can login at `/signin`

**Test it now:** http://localhost:4321/test-auth
