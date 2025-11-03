# ✅ Signup Updated - First & Last Name Support

## 🎯 What Changed

The signup endpoint now accepts and saves **first_name** and **last_name** to the database.

## 📝 Updated Files

### 1. `src/pages/api/auth/signup.ts`
- ✅ Accepts `first_name` and `last_name` from request body
- ✅ Saves both fields to the `users` table in database
- ✅ Fields are optional (set to `null` if not provided)

**Request Body:**
```json
{
  "email": "user@example.com",
  "username": "testuser",
  "password": "password123",
  "first_name": "John",      // ← NEW (optional)
  "last_name": "Doe",        // ← NEW (optional)
  "name": "John Doe"         // Display name for profile (optional)
}
```

**Database Insert:**
```typescript
await supabase.from('users').insert({
  username,
  email,
  password: hashedPassword,
  first_name: first_name || null,  // ← NEW
  last_name: last_name || null,    // ← NEW
  role: 'customer',
  account_status: 'active'
})
```

### 2. `public/test-auth-full.html`
- ✅ Added "First Name" input field
- ✅ Added "Last Name" input field
- ✅ Auto-fills random first and last names from preset lists
- ✅ Sends first_name and last_name to signup API

**New Fields:**
- First Name input with random values: John, Jane, Mike, Sarah, Chris, Emma, David, Lisa
- Last Name input with random values: Smith, Johnson, Williams, Brown, Jones, Garcia, Miller, Davis
- Display Name auto-fills as "FirstName LastName"

## 🚨 IMPORTANT: Add Password Column First!

Before testing signup, you **MUST** run the `ADD_PASSWORD_COLUMN.sql` script in Supabase:

```sql
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS password VARCHAR(255);
```

### Steps:
1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy the contents of `ADD_PASSWORD_COLUMN.sql`
3. Click **"Run"**
4. Verify the column was added:
   ```sql
   SELECT column_name, data_type 
   FROM information_schema.columns 
   WHERE table_name = 'users';
   ```

## 🧪 Testing

### Option 1: Use Test Page
1. Visit: http://localhost:4321/test-auth-full.html
2. Fields are pre-filled with random data including first/last name
3. Click **"Create Account"**
4. Check Supabase → Table Editor → users table

### Option 2: Manual API Test
```bash
curl -X POST http://localhost:4321/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "username": "johndoe",
    "password": "password123",
    "first_name": "John",
    "last_name": "Doe",
    "name": "John Doe"
  }'
```

### Expected Response:
```json
{
  "success": true,
  "message": "Account created successfully!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 5,
    "username": "johndoe",
    "email": "john.doe@example.com",
    "role": "customer",
    "accountStatus": "active"
  }
}
```

### Verify in Database:
```sql
SELECT _id, username, email, first_name, last_name, role, account_status
FROM users
WHERE email = 'john.doe@example.com';
```

Expected result:
```
_id | username | email                 | first_name | last_name | role     | account_status
----+----------+-----------------------+------------+-----------+----------+---------------
5   | johndoe  | john.doe@example.com  | John       | Doe       | customer | active
```

## 📊 Database Schema (users table)

After adding the password column, your users table should have:

| Column         | Type                        | Nullable | Default      |
|----------------|----------------------------|----------|--------------|
| _id            | integer                    | NO       | nextval(...) |
| username       | character varying          | NO       | -            |
| email          | character varying          | NO       | -            |
| password       | character varying(255)     | YES      | NULL         |
| first_name     | character varying          | YES      | NULL         |
| last_name      | character varying          | YES      | NULL         |
| role           | character varying          | YES      | 'customer'   |
| account_status | character varying          | YES      | 'active'     |
| phone          | character varying          | YES      | NULL         |
| created_at     | timestamp                  | YES      | CURRENT_TS   |
| updated_at     | timestamp                  | YES      | NULL         |

## 🔐 Security Features

- ✅ **Password Hashing**: bcrypt with 10 salt rounds
- ✅ **Email Validation**: Regex pattern validation
- ✅ **Password Length**: Minimum 6 characters
- ✅ **Duplicate Prevention**: Checks for existing email/username
- ✅ **JWT Tokens**: 7-day expiration
- ✅ **Profile Auto-Creation**: Creates profile record automatically

## 🎉 What's Next?

1. **Add Password Column** (run ADD_PASSWORD_COLUMN.sql)
2. **Test Signup** (use test page or API)
3. **Verify Database** (check users table in Supabase)
4. **Test Login** (signin with newly created user)
5. **Update Signin Page** (add first_name/last_name fields to signup form)

---

✨ **Your signup now saves first_name and last_name to the database!**
