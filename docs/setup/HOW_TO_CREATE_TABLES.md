# 📋 How to Create Your Database Tables

## Yes, you need to create the tables yourself! Here's how:

---

## 🎯 Step-by-Step Instructions

### **Step 1: Open Supabase Dashboard**

Go to your Supabase project:
```
https://supabase.com/dashboard/project/hugksrivqiosqydjqqan
```

### **Step 2: Go to SQL Editor**

1. Click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"** button

### **Step 3: Copy the SQL Script**

Open the file `CREATE_TABLES.sql` in your project and **copy everything**.

### **Step 4: Paste and Run**

1. Paste the SQL into the Supabase SQL Editor
2. Click the **"RUN"** button (or press Ctrl+Enter)
3. Wait for the success message

### **Step 5: Verify**

You should see at the bottom:
```
table_name  | row_count
------------|----------
categories  | 3
products    | 3
users       | 0
orders      | 0
```

This means your tables are created! ✅

---

## 🧪 Test Your Setup

### **Option 1: Test Page**
Visit: http://localhost:4321/test-db

You should now see:
- ✅ Connection successful!
- Sample users (if any exist)
- Database info

### **Option 2: API Test**
Open PowerShell and run:
```powershell
Invoke-RestMethod -Uri "http://localhost:4321/api/users"
```

---

## 📊 What Tables Are Created?

The `CREATE_TABLES.sql` script creates:

1. **users** - User accounts
2. **profiles** - User profile data (name, phone, address)
3. **categories** - Product categories
4. **products** - Your products catalog
5. **orders** - Customer orders
6. **order_items** - Individual items in orders

Plus 3 sample categories and 3 sample products!

---

## 🔍 View Your Tables

After running the SQL script, you can view your tables:

1. Click **"Table Editor"** in Supabase
2. You'll see all your tables on the left
3. Click any table to view/edit data

---

## ✏️ Add Your Own Data

### **Via Supabase Dashboard:**
1. Go to **Table Editor**
2. Click a table (e.g., "products")
3. Click **"Insert row"**
4. Fill in the data
5. Click **"Save"**

### **Via Your API:**
```javascript
const response = await fetch('http://localhost:4321/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    username: 'john',
    email: 'john@example.com',
    role: 'customer'
  })
});
```

### **Via Supabase Client:**
```typescript
import { supabase } from '../lib/supabase';

const { data, error } = await supabase
  .from('users')
  .insert({
    username: 'john',
    email: 'john@example.com',
    role: 'customer'
  });
```

---

## 🆘 Troubleshooting

### **Error: "permission denied for table"**
**Solution:** The table might have Row Level Security (RLS) enabled.

**Quick fix in SQL Editor:**
```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
```

### **Error: "relation does not exist"**
**Solution:** The table hasn't been created yet. Run `CREATE_TABLES.sql` again.

### **Want to start fresh?**
```sql
-- Run this to delete all tables and start over
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS users CASCADE;
```

Then run `CREATE_TABLES.sql` again.

---

## 📝 Quick Checklist

- [ ] Open Supabase dashboard
- [ ] Go to SQL Editor
- [ ] Copy `CREATE_TABLES.sql`
- [ ] Paste and RUN
- [ ] See success message
- [ ] Test at `/test-db`
- [ ] Start building! 🚀

---

## 🎉 You're Ready!

Once you run the SQL script:
- ✅ All tables will be created
- ✅ 3 sample categories added
- ✅ 3 sample products added
- ✅ Ready to insert your own data

**Time needed: 2 minutes**

Go do it now! 💪
