-- ============================================================================
-- ADD TEST DATA TO WISHLIST TABLE
-- Run this in your Supabase SQL Editor to test the wishlist feature
-- ============================================================================

-- First, make sure you have some products in the products table
-- If not, add a few test products first:

-- Insert test products (if they don't exist)
INSERT INTO products (name, description, price, images, rating, stock_quantity, availability, category_id)
VALUES 
  ('Premium Wireless Headphones', 'High-quality wireless headphones with noise cancellation', 129.99, 
   '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop"]', 
   4.8, 50, true, NULL),
  
  ('Smart Watch', 'Feature-rich smartwatch with health monitoring', 199.99,
   '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop"]',
   4.7, 30, true, NULL),
   
  ('Bluetooth Speaker', 'Portable wireless speaker with excellent sound quality', 49.99,
   '["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop"]',
   4.4, 60, true, NULL)
ON CONFLICT (name) DO NOTHING;

-- Now add some items to the wishlist for user_id = 1
-- Assuming user with _id = 1 exists

-- Get product IDs and add to wishlist
DO $$
DECLARE
  headphones_id INTEGER;
  watch_id INTEGER;
  speaker_id INTEGER;
BEGIN
  -- Get product IDs
  SELECT _id INTO headphones_id FROM products WHERE name = 'Premium Wireless Headphones' LIMIT 1;
  SELECT _id INTO watch_id FROM products WHERE name = 'Smart Watch' LIMIT 1;
  SELECT _id INTO speaker_id FROM products WHERE name = 'Bluetooth Speaker' LIMIT 1;
  
  -- Add to wishlist if products exist
  IF headphones_id IS NOT NULL THEN
    INSERT INTO wishlist (user_id, product_id) 
    VALUES (1, headphones_id)
    ON CONFLICT (user_id, product_id) DO NOTHING;
  END IF;
  
  IF watch_id IS NOT NULL THEN
    INSERT INTO wishlist (user_id, product_id) 
    VALUES (1, watch_id)
    ON CONFLICT (user_id, product_id) DO NOTHING;
  END IF;
  
  IF speaker_id IS NOT NULL THEN
    INSERT INTO wishlist (user_id, product_id) 
    VALUES (1, speaker_id)
    ON CONFLICT (user_id, product_id) DO NOTHING;
  END IF;
END $$;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================

-- Check wishlist items with product details
SELECT 
  w._id as wishlist_id,
  w.user_id,
  w.product_id,
  p.name as product_name,
  p.price,
  p.rating,
  w.created_at
FROM wishlist w
JOIN products p ON w.product_id = p._id
WHERE w.user_id = 1
ORDER BY w.created_at DESC;

-- ============================================================================
-- SETUP COMPLETE! ✅
-- You should now see products in the wishlist when you visit /shop/profile
-- ============================================================================
