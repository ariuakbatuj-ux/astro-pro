# ⚡ QUICK SETUP - 2 Minutes

## 🎯 What You Need to Do

**YES - You need to create the tables yourself in Supabase!**

---

## 📝 Step-by-Step (Super Simple)

### 1️⃣ Open This Link
```
https://supabase.com/dashboard/project/hugksrivqiosqydjqqan/sql/new
```

### 2️⃣ Copy This File
Open: `CREATE_TABLES.sql`  
Select All (Ctrl+A)  
Copy (Ctrl+C)

### 3️⃣ Paste & Run
- Paste into Supabase SQL Editor
- Click **RUN** button
- Wait for ✅ Success

### 4️⃣ Test
Visit: `http://localhost:4321/test-db`

**Should show:** ✅ Connection successful!

---

## ✅ Done!

Your database now has:
- 6 tables (users, profiles, categories, products, orders, order_items)
- 3 sample categories
- 3 sample products

---

## 🚀 Start Using It

```typescript
import { supabase } from '../lib/supabase';

// Get all products
const { data } = await supabase.from('products').select('*');

// Add a user
const { data } = await supabase.from('users').insert({
  username: 'john',
  email: 'john@example.com'
});
```

---

## 📚 Need More Help?

See: `HOW_TO_CREATE_TABLES.md`

---

**That's it! Go run that SQL script! 💪**
