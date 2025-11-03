// 🚀 SUPABASE QUICK REFERENCE - Copy & Use These!

// ============================================
// 1. IMPORT THE CLIENT (in any file)
// ============================================
import { supabase } from '../lib/supabase';
// or from API: import { supabase } from '../../lib/supabase';


// ============================================
// 2. SELECT (GET DATA)
// ============================================

// Get all records
const { data, error } = await supabase
  .from('users')
  .select('*');

// Get specific columns
const { data, error } = await supabase
  .from('users')
  .select('username, email, role');

// Get with filter
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('role', 'customer');

// Get single record
const { data, error } = await supabase
  .from('users')
  .select('*')
  .eq('_id', 123)
  .single();

// Get with multiple filters
const { data, error } = await supabase
  .from('products')
  .select('*')
  .eq('status', 'active')
  .gte('price', 10)
  .lte('price', 100)
  .order('created_at', { ascending: false })
  .limit(10);


// ============================================
// 3. INSERT (CREATE DATA)
// ============================================

// Insert single record
const { data, error } = await supabase
  .from('users')
  .insert({
    username: 'john',
    email: 'john@example.com',
    role: 'customer'
  })
  .select()
  .single();

// Insert multiple records
const { data, error } = await supabase
  .from('products')
  .insert([
    { name: 'Product 1', price: 29.99 },
    { name: 'Product 2', price: 39.99 },
    { name: 'Product 3', price: 49.99 }
  ])
  .select();


// ============================================
// 4. UPDATE (MODIFY DATA)
// ============================================

// Update single record
const { data, error } = await supabase
  .from('users')
  .update({ role: 'admin' })
  .eq('_id', 123)
  .select()
  .single();

// Update multiple records
const { data, error } = await supabase
  .from('products')
  .update({ status: 'active' })
  .eq('category_id', 5)
  .select();


// ============================================
// 5. DELETE (REMOVE DATA)
// ============================================

// Delete single record
const { error } = await supabase
  .from('users')
  .delete()
  .eq('_id', 123);

// Delete multiple records
const { error } = await supabase
  .from('products')
  .delete()
  .eq('status', 'inactive');


// ============================================
// 6. FILTER OPERATORS
// ============================================

.eq('column', value)          // Equal to
.neq('column', value)         // Not equal to
.gt('column', value)          // Greater than
.gte('column', value)         // Greater than or equal
.lt('column', value)          // Less than
.lte('column', value)         // Less than or equal
.like('column', '%pattern%')  // Pattern match
.ilike('column', '%PATTERN%') // Case-insensitive pattern
.is('column', null)           // Is null
.in('column', [1, 2, 3])      // In array
.contains('column', ['a'])    // Array contains (JSONB)
.order('column')              // Order by ASC
.order('column', { ascending: false }) // Order by DESC
.limit(10)                    // Limit results
.range(0, 9)                  // Pagination (0-9 = first 10)


// ============================================
// 7. JOIN TABLES
// ============================================

// Join with foreign key
const { data, error } = await supabase
  .from('orders')
  .select(`
    *,
    users (username, email),
    products (name, price)
  `)
  .eq('status', 'pending');


// ============================================
// 8. COUNT RECORDS
// ============================================

const { count, error } = await supabase
  .from('users')
  .select('*', { count: 'exact', head: true });


// ============================================
// 9. AUTHENTICATION
// ============================================

// Sign up
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'SecurePassword123!',
  options: {
    data: { username: 'john', name: 'John Doe' }
  }
});

// Sign in
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'SecurePassword123!'
});

// Get current user
const { data: { user } } = await supabase.auth.getUser();

// Sign out
const { error } = await supabase.auth.signOut();


// ============================================
// 10. ERROR HANDLING
// ============================================

const { data, error } = await supabase
  .from('users')
  .select('*');

if (error) {
  console.error('Error:', error.message);
  // Handle error
} else {
  console.log('Success:', data);
  // Use data
}


// ============================================
// 11. USE IN ASTRO PAGE
// ============================================

// File: src/pages/users.astro
/*
---
import { supabase } from '../lib/supabase';

const { data: users, error } = await supabase
  .from('users')
  .select('*')
  .limit(10);
---

<ul>
  {users?.map(user => (
    <li>{user.username} - {user.email}</li>
  ))}
</ul>
*/


// ============================================
// 12. USE IN API ENDPOINT
// ============================================

// File: src/pages/api/users.ts
/*
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

export const GET: APIRoute = async () => {
  const { data, error } = await supabase
    .from('users')
    .select('*');
  
  if (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
  
  return new Response(JSON.stringify({ users: data }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
*/


// ============================================
// 13. CLIENT-SIDE USAGE (BROWSER)
// ============================================

/*
<script>
  async function loadUsers() {
    const response = await fetch('/api/users');
    const data = await response.json();
    console.log(data.users);
  }
  
  loadUsers();
</script>
*/


// ============================================
// 14. REALTIME SUBSCRIPTIONS
// ============================================

// Subscribe to changes
const channel = supabase
  .channel('users-channel')
  .on('postgres_changes', 
    { event: '*', schema: 'public', table: 'users' },
    (payload) => {
      console.log('Change received!', payload);
    }
  )
  .subscribe();

// Unsubscribe
channel.unsubscribe();


// ============================================
// 15. STORAGE (FILE UPLOADS)
// ============================================

// Upload file
const { data, error } = await supabase.storage
  .from('avatars')
  .upload('user-123.jpg', file);

// Get public URL
const { data } = supabase.storage
  .from('avatars')
  .getPublicUrl('user-123.jpg');

// Download file
const { data, error } = await supabase.storage
  .from('avatars')
  .download('user-123.jpg');


// ============================================
// 🎯 READY TO USE!
// ============================================
// Copy any snippet above and start using Supabase!
// Test at: http://localhost:4321/test-db
