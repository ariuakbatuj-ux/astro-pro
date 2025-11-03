-- ============================================================================
-- BASIC DATABASE SETUP FOR YOUR PROJECT
-- Copy and paste this into Supabase SQL Editor
-- ============================================================================

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    _id SERIAL PRIMARY KEY,
    username VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) DEFAULT 'customer',
    account_status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. PROFILES TABLE
CREATE TABLE IF NOT EXISTS profiles (
    _id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(_id) UNIQUE,
    name VARCHAR(255),
    phone VARCHAR(50),
    aimag VARCHAR(100),
    sum VARCHAR(100),
    horoo VARCHAR(100),
    address_detail TEXT,
    language VARCHAR(10) DEFAULT 'en',
    currency VARCHAR(10) DEFAULT 'USD',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS categories (
    _id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. PRODUCTS TABLE
CREATE TABLE IF NOT EXISTS products (
    _id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    category_id INTEGER REFERENCES categories(_id),
    stock_quantity INTEGER DEFAULT 0,
    sku VARCHAR(100) UNIQUE,
    variants JSONB,
    images JSONB,
    rating DECIMAL(3, 2) DEFAULT 0,
    reviews_count INTEGER DEFAULT 0,
    status VARCHAR(50) DEFAULT 'active',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    _id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(_id),
    order_number VARCHAR(100) UNIQUE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    payment_method VARCHAR(100),
    payment_status VARCHAR(50) DEFAULT 'pending',
    shipping_address JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    _id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(_id) ON DELETE CASCADE,
    product_id INTEGER REFERENCES products(_id),
    quantity INTEGER NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
CREATE INDEX IF NOT EXISTS idx_orders_user ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- ============================================================================
-- INSERT SAMPLE DATA (OPTIONAL)
-- ============================================================================

-- Insert sample categories
INSERT INTO categories (name, slug, description, status) 
VALUES 
    ('Electronics', 'electronics', 'Electronic devices and gadgets', 'active'),
    ('Clothing', 'clothing', 'Apparel and fashion items', 'active'),
    ('Accessories', 'accessories', 'Fashion accessories', 'active')
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (name, description, price, category_id, stock_quantity, sku, featured, images) 
VALUES 
    (
        'Premium Headphones', 
        'High-quality wireless headphones', 
        129.99, 
        1, 
        50, 
        'HEAD-001', 
        true,
        '["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500"]'
    ),
    (
        'Cotton T-Shirt', 
        'Comfortable cotton t-shirt', 
        24.99, 
        2, 
        100, 
        'SHIRT-001', 
        true,
        '["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500"]'
    ),
    (
        'Smart Watch', 
        'Feature-rich smartwatch', 
        199.99, 
        1, 
        30, 
        'WATCH-001', 
        true,
        '["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500"]'
    )
ON CONFLICT (sku) DO NOTHING;

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================

-- Run this to verify everything was created
SELECT 
    'categories' as table_name, COUNT(*) as row_count FROM categories
UNION ALL
SELECT 'products', COUNT(*) FROM products
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'orders', COUNT(*) FROM orders;

-- ============================================================================
-- SETUP COMPLETE! ✅
-- ============================================================================
-- You should see:
-- - categories: 3
-- - products: 3
-- - users: 0
-- - orders: 0
-- ============================================================================
