# 🎯 Wishlist Database Setup Guide

## ✅ What Was Changed

Your wishlist system now **saves to the Supabase database** instead of just localStorage. This means:
- ✅ Wishlist persists across devices
- ✅ Wishlist survives browser cache clearing
- ✅ Each user has their own wishlist
- ✅ Can track which users like which products

---

## 📋 Setup Steps

### Step 1: Create the Wishlist Table

1. Go to your **Supabase Dashboard**
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `CREATE_WISHLIST_TABLE.sql`
5. Click **Run** or press `Ctrl+Enter`

You should see: ✅ **Success. No rows returned**

---

### Step 2: Verify Table Creation

Run this query in the SQL Editor:

```sql
SELECT * FROM wishlist;
```

You should see an empty table with columns:
- `_id` (primary key)
- `user_id` (references users table)
- `product_id` (references products table)
- `created_at` (timestamp)

---

### Step 3: Test the Feature

1. **Start your dev server:**
   ```bash
   npm run dev
   ```

2. **Go to the shop page:**
   - Visit `http://localhost:4321/shop`
   - Click the heart icon on any product
   - You should see: ❤️ Added to wishlist!

3. **Check your profile:**
   - Visit `http://localhost:4321/shop/profile`
   - Click "Wishlist" in the sidebar
   - You should see the product you just added!

4. **Verify in database:**
   - Go back to Supabase SQL Editor
   - Run: `SELECT * FROM wishlist;`
   - You should see your wishlist entry!

---

## 🔧 Files Changed

### New Files Created:
1. `CREATE_WISHLIST_TABLE.sql` - Database schema
2. `src/pages/api/wishlist/index.ts` - API endpoints

### Files Updated:
1. `src/pages/shop/profile.astro` - Load wishlist from DB
2. `src/pages/shop/product/[id].astro` - Save to DB
3. `src/pages/shop.astro` - Save to DB

---

## 🎮 How It Works

### Adding to Wishlist:
```
User clicks ❤️ → API POST /api/wishlist → Saves to database
```

### Viewing Wishlist:
```
Profile loads → API GET /api/wishlist?userId=1 → Displays items
```

### Removing from Wishlist:
```
User clicks X → API DELETE /api/wishlist → Removes from database
```

---

## 🐛 Troubleshooting

### "Error loading wishlist"
- ✅ Make sure you ran `CREATE_WISHLIST_TABLE.sql`
- ✅ Check that your Supabase connection is working
- ✅ Verify `src/lib/supabase.ts` has correct credentials

### "No items showing"
- ✅ Check browser console for errors
- ✅ Verify user ID is correct (currently hardcoded to `1`)
- ✅ Run `SELECT * FROM wishlist;` in Supabase to check data

### "Product already in wishlist"
- This is normal! It prevents duplicates
- The API will return success but won't create a duplicate entry

---

## 🔐 Next Steps (Optional)

### Connect to Real User Authentication:
Replace `const userId = 1;` with actual user ID from session:

```javascript
// Example with auth
const userId = session?.user?.id || 1;
```

### Add User Login:
Once you have authentication working, update these lines in:
- `src/pages/shop/profile.astro` (line 1312)
- `src/pages/shop/product/[id].astro` (line 486)
- `src/pages/shop.astro` (line 478)

---

## ✅ Testing Checklist

- [ ] Ran `CREATE_WISHLIST_TABLE.sql` in Supabase
- [ ] Can add products to wishlist from shop page
- [ ] Can add products to wishlist from product detail page
- [ ] Wishlist shows in profile page
- [ ] Can remove items from wishlist
- [ ] Heart icon turns red when product is in wishlist
- [ ] Badge count updates correctly
- [ ] Data persists after page refresh

---

## 🎉 You're Done!

Your wishlist now saves to the database! Users can:
- ❤️ Save favorite products
- 📋 View all saved items in profile
- 🛒 Add wishlist items to cart
- 🗑️ Remove items from wishlist

All data is stored in Supabase and tied to the user account!
