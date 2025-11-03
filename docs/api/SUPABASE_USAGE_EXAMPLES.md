# 🚀 Supabase Usage Examples

## 📁 File Structure

```
src/
├── lib/
│   └── supabase.ts          # ✅ Your Supabase client (already configured)
├── pages/
│   └── api/
│       └── users.ts         # Example API endpoint
└── components/
    └── UserList.astro       # Example component
```

---

## 🔧 Configuration (Already Done! ✅)

Your `.env` file:
```env
APP_DATABASE_URL=https://hugksrivqiosqydjqqan.supabase.co
APP_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Your `src/lib/supabase.ts`:
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.APP_DATABASE_URL;
const supabaseAnonKey = import.meta.env.APP_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
```

---

## 📖 Usage Examples

### 1️⃣ Using Supabase in an Astro Page (Server-Side)

**File: `src/pages/users.astro`**

```astro
---
import { supabase } from '../lib/supabase';

// Fetch data on the server (runs at build time or on request)
const { data: users, error } = await supabase
  .from('users')
  .select('*')
  .limit(10);

if (error) {
  console.error('Supabase error:', error);
}
---

<html>
<head>
  <title>Users List</title>
</head>
<body>
  <h1>Users from Supabase</h1>
  
  {error && <p style="color: red;">Error: {error.message}</p>}
  
  {users && users.length > 0 ? (
    <ul>
      {users.map((user) => (
        <li key={user._id}>
          <strong>{user.username}</strong> - {user.email}
        </li>
      ))}
    </ul>
  ) : (
    <p>No users found.</p>
  )}
</body>
</html>
```

---

### 2️⃣ Using Supabase in an API Endpoint

**File: `src/pages/api/users.ts`**

```typescript
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async ({ url }) => {
  // Get query parameters
  const limit = url.searchParams.get('limit') || '10';
  
  // Fetch users from Supabase
  const { data: users, error } = await supabase
    .from('users')
    .select('_id, username, email, role, created_at')
    .limit(parseInt(limit));

  if (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ 
    success: true, 
    users 
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};

export const POST: APIRoute = async ({ request }) => {
  const body = await request.json();
  
  // Insert new user
  const { data, error } = await supabase
    .from('users')
    .insert({
      username: body.username,
      email: body.email,
      role: body.role || 'customer'
    })
    .select()
    .single();

  if (error) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({ 
    success: true, 
    user: data 
  }), {
    status: 201,
    headers: { 'Content-Type': 'application/json' }
  });
};
```

---

### 3️⃣ Client-Side Usage (In Browser)

**File: `src/pages/dashboard.astro`**

```astro
---
// Nothing in the frontmatter for client-side
---

<html>
<head>
  <title>Dashboard</title>
</head>
<body>
  <h1>User Dashboard</h1>
  <div id="user-data">Loading...</div>
  
  <script>
    // Fetch data from your API endpoint
    async function loadUserData() {
      try {
        const response = await fetch('/api/users?limit=5');
        const result = await response.json();
        
        const container = document.getElementById('user-data');
        
        if (result.success) {
          container.innerHTML = `
            <ul>
              ${result.users.map(user => `
                <li>${user.username} (${user.email})</li>
              `).join('')}
            </ul>
          `;
        } else {
          container.innerHTML = `<p style="color: red;">Error: ${result.error}</p>`;
        }
      } catch (error) {
        console.error('Failed to load users:', error);
      }
    }
    
    // Load data when page loads
    loadUserData();
  </script>
</body>
</html>
```

---

## 📊 Common Supabase Operations

### ✅ SELECT (Read Data)

```typescript
// Get all users
const { data, error } = await supabase
  .from('users')
  .select('*');

// Get with filters
const { data, error } = await supabase
  .from('users')
  .select('username, email')
  .eq('role', 'customer')
  .limit(10);

// Get single user
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('email', 'user@example.com')
  .single();
```

### ➕ INSERT (Create Data)

```typescript
// Insert single record
const { data, error } = await supabase
  .from('users')
  .insert({
    username: 'newuser',
    email: 'new@example.com',
    role: 'customer'
  })
  .select()
  .single();

// Insert multiple records
const { data, error } = await supabase
  .from('products')
  .insert([
    { name: 'Product 1', price: 29.99 },
    { name: 'Product 2', price: 39.99 }
  ])
  .select();
```

### ✏️ UPDATE (Modify Data)

```typescript
// Update user
const { data, error } = await supabase
  .from('users')
  .update({ role: 'admin' })
  .eq('_id', 123)
  .select();
```

### ❌ DELETE (Remove Data)

```typescript
// Delete user
const { error } = await supabase
  .from('users')
  .delete()
  .eq('_id', 123);
```

---

## 🔐 Authentication Examples

### Sign Up

```typescript
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'SecurePassword123!',
  options: {
    data: {
      username: 'cooluser',
      name: 'Cool User'
    }
  }
});
```

### Sign In

```typescript
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'SecurePassword123!'
});
```

### Get Current User

```typescript
const { data: { user } } = await supabase.auth.getUser();
```

### Sign Out

```typescript
const { error } = await supabase.auth.signOut();
```

---

## 🧪 Test Your Setup

**Create this file: `src/pages/test-db.astro`**

```astro
---
import { supabase } from '../lib/supabase';

let status = 'Testing connection...';
let users = null;
let error = null;

try {
  const result = await supabase
    .from('users')
    .select('count')
    .limit(1);
  
  if (result.error) {
    error = result.error.message;
    status = '❌ Connection failed';
  } else {
    status = '✅ Connection successful!';
    
    // Try to get some users
    const usersResult = await supabase
      .from('users')
      .select('*')
      .limit(5);
    
    users = usersResult.data;
  }
} catch (e) {
  error = e.message;
  status = '❌ Connection failed';
}
---

<html>
<head>
  <title>Database Test</title>
  <style>
    body { font-family: system-ui; padding: 2rem; max-width: 800px; margin: 0 auto; }
    .success { color: green; }
    .error { color: red; }
    pre { background: #f5f5f5; padding: 1rem; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Supabase Connection Test</h1>
  
  <h2 class={error ? 'error' : 'success'}>{status}</h2>
  
  {error && (
    <div>
      <h3>Error Details:</h3>
      <pre>{error}</pre>
    </div>
  )}
  
  {users && (
    <div>
      <h3>Sample Users ({users.length} found):</h3>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <strong>{user.username}</strong> - {user.email} 
            <em>({user.role})</em>
          </li>
        ))}
      </ul>
    </div>
  )}
  
  <hr />
  
  <h3>Configuration:</h3>
  <pre>URL: {import.meta.env.APP_DATABASE_URL}
Key: {import.meta.env.APP_ANON_KEY ? '✅ Set' : '❌ Missing'}</pre>
</body>
</html>
```

**Visit:** `http://localhost:4321/test-db`

---

## 📝 Quick Reference

| Operation | Code |
|-----------|------|
| **Select all** | `.from('table').select('*')` |
| **Filter** | `.eq('column', value)` |
| **Limit** | `.limit(10)` |
| **Sort** | `.order('column', { ascending: false })` |
| **Insert** | `.insert({ data })` |
| **Update** | `.update({ data }).eq('id', 1)` |
| **Delete** | `.delete().eq('id', 1)` |
| **Single row** | `.single()` |

---

## 🆘 Troubleshooting

### Error: "Missing Supabase environment variables"
- Check your `.env` file has `APP_DATABASE_URL` and `APP_ANON_KEY`
- Restart your dev server after changing `.env`

### Error: "relation does not exist"
- The table doesn't exist in your database
- Run your SQL schema creation scripts in Supabase dashboard

### Error: "permission denied"
- Check Row Level Security (RLS) policies in Supabase
- You may need to disable RLS for testing: `ALTER TABLE users DISABLE ROW LEVEL SECURITY;`

---

## 🎯 Next Steps

1. ✅ Your Supabase client is configured
2. 📊 Create your database tables in Supabase dashboard
3. 🧪 Test with `/test-db` page
4. 🚀 Build your API endpoints
5. 💪 Start fetching and sending data!

Happy coding! 🎉
