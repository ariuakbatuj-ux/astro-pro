# Supabase Wishlist Query Examples

## Current Implementation in Your Project

### 1. **GET - Fetch User's Wishlist with Product Details**
Located in: `src/pages/api/wishlist/index.ts`

```typescript
// Fetch wishlist with JOIN to products table
const { data: wishlistData, error: wishlistError } = await supabase
  .from('wishlist')
  .select(`
    _id,
    user_id,
    product_id,
    created_at,
    products!inner (
      _id,
      name,
      description,
      price,
      images,
      stock_quantity,
      rating,
      status
    )
  `)
  .eq('user_id', parseInt(userId))           // Filter: only this user's items
  .eq('products.status', 'active')           // Filter: only active products
  .order('created_at', { ascending: false }) // Order: newest first
```

### 2. **POST - Add Product to Wishlist**
Located in: `src/pages/api/wishlist/index.ts`

```typescript
// Check if already exists
const { data: existing, error: checkError } = await supabase
  .from('wishlist')
  .select('_id')
  .eq('user_id', parseInt(userId))
  .eq('product_id', parseInt(productId))
  .maybeSingle()

// Insert new wishlist item
const { data, error } = await supabase
  .from('wishlist')
  .insert({
    user_id: parseInt(userId),
    product_id: parseInt(productId)
  })
  .select()
  .single()
```

### 3. **DELETE - Remove from Wishlist**
Located in: `src/pages/api/wishlist/index.ts`

```typescript
const { error } = await supabase
  .from('wishlist')
  .delete()
  .eq('user_id', parseInt(userId))
  .eq('product_id', parseInt(productId))
```

---

## Additional Supabase Patterns You Can Use

### Filtering Examples

```typescript
// Get wishlist items added in the last 7 days
const { data } = await supabase
  .from('wishlist')
  .select('*')
  .eq('user_id', userId)
  .gte('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

// Get wishlist items for products under $50
const { data } = await supabase
  .from('wishlist')
  .select(`
    *,
    products!inner (
      name,
      price
    )
  `)
  .eq('user_id', userId)
  .lt('products.price', 50)

// Get wishlist items with specific product IDs
const { data } = await supabase
  .from('wishlist')
  .select('*')
  .eq('user_id', userId)
  .in('product_id', [1, 2, 3, 5])

// Get wishlist items NOT in a list
const { data } = await supabase
  .from('wishlist')
  .select('*')
  .eq('user_id', userId)
  .not('product_id', 'in', '(10, 20, 30)')
```

### Pagination

```typescript
// Get first 10 wishlist items (page 1)
const { data } = await supabase
  .from('wishlist')
  .select('*')
  .eq('user_id', userId)
  .range(0, 9)

// Get next 10 items (page 2)
const { data } = await supabase
  .from('wishlist')
  .select('*')
  .eq('user_id', userId)
  .range(10, 19)
```

### Count Items

```typescript
// Get count of wishlist items
const { count } = await supabase
  .from('wishlist')
  .select('*', { count: 'exact', head: true })
  .eq('user_id', userId)
```

### Upsert (Insert or Update)

```typescript
// Add to wishlist or update if exists
const { data, error } = await supabase
  .from('wishlist')
  .upsert({
    user_id: userId,
    product_id: productId
  }, {
    onConflict: 'user_id,product_id'
  })
  .select()
```

### Bulk Operations

```typescript
// Add multiple products to wishlist at once
const { data, error } = await supabase
  .from('wishlist')
  .insert([
    { user_id: userId, product_id: 1 },
    { user_id: userId, product_id: 2 },
    { user_id: userId, product_id: 3 }
  ])
  .select()

// Delete multiple items
const { error } = await supabase
  .from('wishlist')
  .delete()
  .eq('user_id', userId)
  .in('product_id', [1, 2, 3])
```

### Complex Queries

```typescript
// Get wishlist with products AND users table data
const { data } = await supabase
  .from('wishlist')
  .select(`
    _id,
    created_at,
    products!inner (
      name,
      price,
      images
    ),
    users!inner (
      username,
      email
    )
  `)
  .eq('user_id', userId)

// Search wishlist by product name
const { data } = await supabase
  .from('wishlist')
  .select(`
    *,
    products!inner (
      name,
      price
    )
  `)
  .eq('user_id', userId)
  .ilike('products.name', '%headphones%')

// Get wishlist with out-of-stock products
const { data } = await supabase
  .from('wishlist')
  .select(`
    *,
    products!inner (
      name,
      stock_quantity
    )
  `)
  .eq('user_id', userId)
  .eq('products.stock_quantity', 0)
```

### Realtime Subscriptions

```typescript
// Subscribe to wishlist changes for a specific user
const channel = supabase
  .channel('user-wishlist-changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'wishlist',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Wishlist changed:', payload)
      // Reload wishlist or update UI
      loadWishlist()
    }
  )
  .subscribe()

// Subscribe to only inserts
const channel = supabase
  .channel('wishlist-inserts')
  .on(
    'postgres_changes',
    {
      event: 'INSERT',
      schema: 'public',
      table: 'wishlist',
      filter: `user_id=eq.${userId}`
    },
    (payload) => {
      console.log('Product added to wishlist:', payload.new)
    }
  )
  .subscribe()

// Unsubscribe when done
channel.unsubscribe()
```

---

## Database Schema Reference

```sql
CREATE TABLE wishlist (
    _id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Foreign key relationships:
-- wishlist.user_id -> users._id
-- wishlist.product_id -> products._id
```

---

## Your Current API Endpoints

- **GET** `/api/wishlist?userId={id}` - Fetch user's wishlist
- **POST** `/api/wishlist` - Add product to wishlist
  ```json
  { "userId": 3, "productId": 1 }
  ```
- **DELETE** `/api/wishlist?userId={id}&productId={id}` - Remove from wishlist

---

## Tips & Best Practices

1. **Always filter by user_id** to prevent users from seeing others' wishlists
2. **Use `!inner` JOIN** to ensure products exist (prevent orphaned wishlist items)
3. **Check for duplicates** before inserting (use `maybeSingle()`)
4. **Validate stock_quantity** before adding to cart from wishlist
5. **Filter inactive products** to hide discontinued items
6. **Use pagination** for users with many wishlist items
7. **Cache wishlist count** in localStorage for better UX

---

✅ **Your wishlist implementation is already production-ready!**
