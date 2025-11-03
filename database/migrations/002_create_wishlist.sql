-- ============================================================================
-- WISHLIST TABLE - COMPLETE SETUP
-- Run this ENTIRE script in your Supabase SQL Editor
-- ============================================================================

-- Step 1: Drop existing table if you want to start fresh (optional)
-- DROP TABLE IF EXISTS wishlist CASCADE;

-- Step 2: Create wishlist table
CREATE TABLE IF NOT EXISTS wishlist (
    _id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, product_id)
);

-- Step 3: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_wishlist_user ON wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product ON wishlist(product_id);

-- Step 4: Add some test data (using user_id = 1)
-- First, let's make sure we have some products
INSERT INTO products (name, description, price, images, stock_quantity, availability)
VALUES 
  ('Premium Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 129.99, 
   '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"]', 50, true),
  
  ('Smart Watch', 'Feature-rich smartwatch with health monitoring', 199.99,
   '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"]', 30, true),
   
  ('Bluetooth Speaker', 'Portable wireless speaker with excellent sound quality', 49.99,
   '["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500"]', 60, true),
   
  ('Running Shoes', 'Lightweight running shoes with superior comfort', 89.99,
   '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500"]', 40, true)
ON CONFLICT (name) DO NOTHING;

-- Step 5: Add products to wishlist for user_id = 1
INSERT INTO wishlist (user_id, product_id)
SELECT 1, _id FROM products WHERE name IN (
  'Premium Wireless Headphones',
  'Smart Watch',
  'Bluetooth Speaker'
)
ON CONFLICT (user_id, product_id) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- Check if table was created
SELECT 'Table exists!' as status, table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name = 'wishlist';

-- Check wishlist items
SELECT 
  w._id as wishlist_id,
  w.user_id,
  p.name as product_name,
  p.price,
  p.stock_quantity,
  w.created_at
FROM wishlist w
JOIN products p ON w.product_id = p._id
WHERE w.user_id = 1
ORDER BY w.created_at DESC;

-- ============================================================================
-- SETUP COMPLETE! ✅
-- Visit http://localhost:4323/shop/profile and click "Wishlist"
-- ============================================================================
