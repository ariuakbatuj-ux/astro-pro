-- ============================================================================
-- INSERT PRODUCTS FOR ALL CATEGORIES (5 PRODUCTS EACH)
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- First, make sure categories exist
INSERT INTO categories (name, slug, description, status) 
VALUES 
    ('Electronics', 'electronics', 'Electronic devices and gadgets', 'active'),
    ('Clothing', 'clothing', 'Apparel and fashion items', 'active'),
    ('Accessories', 'accessories', 'Fashion accessories and lifestyle items', 'active')
ON CONFLICT (slug) DO NOTHING;

-- ============================================================================
-- ELECTRONICS CATEGORY (5 Products)
-- ============================================================================
INSERT INTO products (name, description, price, category_id, stock_quantity, sku, images, rating, reviews_count, status, featured) 
VALUES 
    -- Product 1: Premium Wireless Headphones
    (
        'Premium Wireless Headphones', 
        'High-quality wireless headphones with active noise cancellation, 30-hour battery life, and premium sound quality. Perfect for music lovers and professionals.',
        129.99,
        (SELECT _id FROM categories WHERE slug = 'electronics' LIMIT 1),
        50,
        'ELEC-HEAD-001',
        '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop", "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop"]',
        4.8,
        124,
        'active',
        true
    ),
    
    -- Product 2: Smart Watch Pro
    (
        'Smart Watch Pro', 
        'Feature-rich smartwatch with heart rate monitoring, GPS tracking, water resistance, and 7-day battery life. Compatible with iOS and Android.',
        199.99,
        (SELECT _id FROM categories WHERE slug = 'electronics' LIMIT 1),
        30,
        'ELEC-WATCH-001',
        '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop", "https://images.unsplash.com/photo-1510017098667-27dfc7150ac1?w=500&h=500&fit=crop"]',
        4.7,
        156,
        'active',
        true
    ),
    
    -- Product 3: Bluetooth Speaker X200
    (
        'Bluetooth Speaker X200', 
        'Portable wireless speaker with 360-degree sound, waterproof design, and 12-hour playtime. Perfect for outdoor adventures and home entertainment.',
        49.99,
        (SELECT _id FROM categories WHERE slug = 'electronics' LIMIT 1),
        60,
        'ELEC-SPEAK-001',
        '["https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop", "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&h=500&fit=crop"]',
        4.4,
        89,
        'active',
        false
    ),
    
    -- Product 4: Wireless Gaming Mouse
    (
        'Wireless Gaming Mouse', 
        'Professional gaming mouse with RGB lighting, 16000 DPI sensor, programmable buttons, and ergonomic design for extended gaming sessions.',
        59.99,
        (SELECT _id FROM categories WHERE slug = 'electronics' LIMIT 1),
        45,
        'ELEC-MOUSE-001',
        '["https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&h=500&fit=crop"]',
        4.6,
        203,
        'active',
        false
    ),
    
    -- Product 5: USB-C Hub 7-in-1
    (
        'USB-C Hub 7-in-1', 
        'Multi-port USB-C hub with HDMI 4K output, USB 3.0 ports, SD card reader, and 100W power delivery. Essential for laptops and tablets.',
        39.99,
        (SELECT _id FROM categories WHERE slug = 'electronics' LIMIT 1),
        75,
        'ELEC-HUB-001',
        '["https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500&h=500&fit=crop"]',
        4.5,
        67,
        'active',
        false
    )
ON CONFLICT (sku) DO NOTHING;

-- ============================================================================
-- CLOTHING CATEGORY (5 Products)
-- ============================================================================
INSERT INTO products (name, description, price, category_id, stock_quantity, sku, images, rating, reviews_count, status, featured) 
VALUES 
    -- Product 1: Premium Cotton T-Shirt
    (
        'Premium Cotton T-Shirt', 
        'Soft 100% organic cotton t-shirt with a comfortable fit. Available in multiple colors. Perfect for everyday wear and layering.',
        24.99,
        (SELECT _id FROM categories WHERE slug = 'clothing' LIMIT 1),
        100,
        'CLOTH-TSHIRT-001',
        '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop", "https://images.unsplash.com/photo-1583743814966-8936f37f4502?w=500&h=500&fit=crop"]',
        4.5,
        89,
        'active',
        true
    ),
    
    -- Product 2: Running Shoes Elite
    (
        'Running Shoes Elite', 
        'Lightweight running shoes with superior cushioning, breathable mesh upper, and durable rubber outsole. Perfect for marathons and daily runs.',
        89.99,
        (SELECT _id FROM categories WHERE slug = 'clothing' LIMIT 1),
        40,
        'CLOTH-SHOES-001',
        '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop", "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop"]',
        4.9,
        312,
        'active',
        true
    ),
    
    -- Product 3: Denim Jacket Classic
    (
        'Denim Jacket Classic', 
        'Timeless denim jacket with a modern fit. Made from premium denim fabric with stylish brass buttons. A wardrobe essential for any season.',
        79.99,
        (SELECT _id FROM categories WHERE slug = 'clothing' LIMIT 1),
        35,
        'CLOTH-JACKET-001',
        '["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=500&h=500&fit=crop"]',
        4.6,
        145,
        'active',
        false
    ),
    
    -- Product 4: Yoga Pants Pro
    (
        'Yoga Pants Pro', 
        'High-waisted yoga pants with four-way stretch fabric, moisture-wicking technology, and hidden pocket. Perfect for yoga, gym, and everyday comfort.',
        44.99,
        (SELECT _id FROM categories WHERE slug = 'clothing' LIMIT 1),
        65,
        'CLOTH-YOGA-001',
        '["https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&h=500&fit=crop"]',
        4.7,
        198,
        'active',
        false
    ),
    
    -- Product 5: Hoodie Comfort
    (
        'Hoodie Comfort', 
        'Cozy fleece hoodie with adjustable drawstring, kangaroo pocket, and soft cotton blend. Available in multiple sizes and colors for ultimate comfort.',
        54.99,
        (SELECT _id FROM categories WHERE slug = 'clothing' LIMIT 1),
        55,
        'CLOTH-HOODIE-001',
        '["https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=500&h=500&fit=crop"]',
        4.4,
        87,
        'active',
        false
    )
ON CONFLICT (sku) DO NOTHING;

-- ============================================================================
-- ACCESSORIES CATEGORY (5 Products)
-- ============================================================================
INSERT INTO products (name, description, price, category_id, stock_quantity, sku, images, rating, reviews_count, status, featured) 
VALUES 
    -- Product 1: Designer Backpack Pro
    (
        'Designer Backpack Pro', 
        'Stylish and functional backpack with laptop compartment, water-resistant exterior, USB charging port, and ergonomic design. Perfect for work and travel.',
        79.99,
        (SELECT _id FROM categories WHERE slug = 'accessories' LIMIT 1),
        75,
        'ACCESS-BAG-001',
        '["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop", "https://images.unsplash.com/photo-1581605405669-fcdf81983e4a?w=500&h=500&fit=crop"]',
        4.6,
        203,
        'active',
        true
    ),
    
    -- Product 2: Leather Wallet Premium
    (
        'Leather Wallet Premium', 
        'Genuine leather bifold wallet with RFID blocking, multiple card slots, and bill compartment. Handcrafted with attention to detail.',
        34.99,
        (SELECT _id FROM categories WHERE slug = 'accessories' LIMIT 1),
        90,
        'ACCESS-WALLET-001',
        '["https://images.unsplash.com/photo-1627123424574-724758594e93?w=500&h=500&fit=crop"]',
        4.7,
        156,
        'active',
        false
    ),
    
    -- Product 3: Sunglasses Aviator
    (
        'Sunglasses Aviator', 
        'Classic aviator sunglasses with UV400 protection, polarized lenses, and durable metal frame. Timeless style meets modern protection.',
        29.99,
        (SELECT _id FROM categories WHERE slug = 'accessories' LIMIT 1),
        120,
        'ACCESS-SUNGLASS-001',
        '["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=500&h=500&fit=crop"]',
        4.5,
        234,
        'active',
        false
    ),
    
    -- Product 4: Stainless Steel Water Bottle
    (
        'Stainless Steel Water Bottle', 
        'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours. BPA-free, leak-proof design with wide mouth opening.',
        24.99,
        (SELECT _id FROM categories WHERE slug = 'accessories' LIMIT 1),
        85,
        'ACCESS-BOTTLE-001',
        '["https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=500&h=500&fit=crop"]',
        4.8,
        289,
        'active',
        false
    ),
    
    -- Product 5: Travel Organizer Set
    (
        'Travel Organizer Set', 
        'Complete travel organizer set with multiple pouches for electronics, toiletries, and accessories. Durable, water-resistant, and TSA-approved.',
        39.99,
        (SELECT _id FROM categories WHERE slug = 'accessories' LIMIT 1),
        50,
        'ACCESS-ORGANIZER-001',
        '["https://images.unsplash.com/photo-1565026057447-bc90a3dceb87?w=500&h=500&fit=crop"]',
        4.6,
        178,
        'active',
        false
    )
ON CONFLICT (sku) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- Run this to verify all products were inserted
SELECT 
    c.name as category,
    COUNT(p._id) as product_count,
    STRING_AGG(p.name, ', ' ORDER BY p.name) as products
FROM categories c
LEFT JOIN products p ON p.category_id = c._id
WHERE c.status = 'active'
GROUP BY c.name
ORDER BY c.name;

-- Check total products
SELECT COUNT(*) as total_products FROM products WHERE status = 'active';

-- ============================================================================
-- SETUP COMPLETE! ✅
-- You should now have 15 products total (5 in each category)
-- ============================================================================
