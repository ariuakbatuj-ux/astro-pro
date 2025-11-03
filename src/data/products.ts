// Featured Products Data
// This will be used as temporary data until Supabase is configured
// Once Supabase is set up, this data can be imported into the products table

export const featuredProducts = [
  {
    _id: 1,
    name: "Premium Wireless Headphones",
    description: "High-quality wireless headphones with noise cancellation",
    price: 129.99,
    category_id: 1, // Electronics
    stock_quantity: 50,
    sku: "PWH-001",
    variants: {
      colors: ["Black", "White", "Silver"],
      features: ["Noise Cancellation", "Bluetooth 5.0", "30-hour battery"]
    },
    images: [
      "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1484704849700-f032a568e944?w=500&h=500&fit=crop"
    ],
    rating: 4.8,
    reviews_count: 124,
    status: "active",
    featured: true,
    weight: 0.3,
    dimensions: "20x18x8 cm",
    tags: ["wireless", "headphones", "premium", "noise-cancellation"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    _id: 2,
    name: "Cotton T-Shirt",
    description: "Comfortable 100% cotton t-shirt in various colors",
    price: 24.99,
    category_id: 2, // Clothing
    stock_quantity: 100,
    sku: "CTS-001",
    variants: {
      colors: ["Red", "Blue", "Green", "Black", "White"],
      sizes: ["S", "M", "L", "XL", "XXL"],
      material: "100% Cotton"
    },
    images: [
      "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1583743814966-8936f37f4502?w=500&h=500&fit=crop"
    ],
    rating: 4.5,
    reviews_count: 89,
    status: "active",
    featured: true,
    weight: 0.2,
    dimensions: "Standard fit",
    tags: ["cotton", "t-shirt", "comfortable", "casual"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    _id: 3,
    name: "Smart Watch",
    description: "Feature-rich smartwatch with health monitoring",
    price: 199.99,
    category_id: 1, // Electronics
    stock_quantity: 30,
    sku: "SW-001",
    variants: {
      colors: ["Black", "Silver", "Rose Gold"],
      band_material: ["Silicone", "Leather", "Metal"],
      features: ["Heart Rate Monitor", "GPS", "Water Resistant", "Sleep Tracking"]
    },
    images: [
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1510017098667-27dfc7150ac1?w=500&h=500&fit=crop"
    ],
    rating: 4.7,
    reviews_count: 156,
    status: "active",
    featured: true,
    weight: 0.05,
    dimensions: "4.4 x 3.8 x 1.1 cm",
    tags: ["smartwatch", "fitness", "health", "technology"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    _id: 4,
    name: "Designer Backpack",
    description: "Stylish and functional backpack for everyday use",
    price: 79.99,
    category_id: 3, // Accessories
    stock_quantity: 75,
    sku: "DB-001",
    variants: {
      colors: ["Black", "Navy", "Gray", "Brown"],
      capacity: "25L",
      features: ["Laptop compartment", "Water resistant", "Ergonomic design"]
    },
    images: [
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1581605405669-fcdf81983e4a?w=500&h=500&fit=crop"
    ],
    rating: 4.6,
    reviews_count: 203,
    status: "active",
    featured: true,
    weight: 0.8,
    dimensions: "45 x 30 x 15 cm",
    tags: ["backpack", "designer", "functional", "laptop"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    _id: 5,
    name: "Bluetooth Speaker",
    description: "Portable wireless speaker with excellent sound quality",
    price: 49.99,
    category_id: 1, // Electronics
    stock_quantity: 60,
    sku: "BT-001",
    variants: {
      colors: ["Black", "Blue", "Red", "White"],
      features: ["Waterproof", "12-hour battery", "Bluetooth 5.0", "Voice assistant"]
    },
    images: [
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1545454675-3531b543be5d?w=500&h=500&fit=crop"
    ],
    rating: 4.4,
    reviews_count: 178,
    status: "active",
    featured: true,
    weight: 0.6,
    dimensions: "18 x 8 x 8 cm",
    tags: ["bluetooth", "speaker", "portable", "wireless"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    _id: 6,
    name: "Running Shoes",
    description: "Lightweight running shoes with superior comfort",
    price: 89.99,
    category_id: 2, // Clothing
    stock_quantity: 40,
    sku: "RS-001",
    variants: {
      colors: ["Black/White", "Blue/Gray", "Red/Black", "All Black"],
      sizes: ["6", "7", "8", "9", "10", "11", "12"],
      features: ["Breathable mesh", "Cushioned sole", "Lightweight design"]
    },
    images: [
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&h=500&fit=crop",
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=500&h=500&fit=crop"
    ],
    rating: 4.9,
    reviews_count: 312,
    status: "active",
    featured: true,
    weight: 0.4,
    dimensions: "Standard athletic fit",
    tags: ["running", "shoes", "lightweight", "comfortable"],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// Categories data (referenced by category_id in products)
export const categories = [
  {
    _id: 1,
    name: "Electronics",
    slug: "electronics",
    description: "Electronic devices and gadgets",
    status: "active"
  },
  {
    _id: 2,
    name: "Clothing",
    slug: "clothing", 
    description: "Apparel and fashion items",
    status: "active"
  },
  {
    _id: 3,
    name: "Accessories",
    slug: "accessories",
    description: "Fashion accessories and lifestyle items", 
    status: "active"
  }
];

// SQL INSERT statements for when Supabase is configured
export const generateProductInserts = () => {
  const categoryInserts = categories.map(cat => 
    `INSERT INTO categories (name, slug, description, status) VALUES ('${cat.name}', '${cat.slug}', '${cat.description}', '${cat.status}') ON CONFLICT (slug) DO NOTHING;`
  ).join('\n');

  const productInserts = featuredProducts.map(product => {
    const variantsJson = JSON.stringify(product.variants).replace(/'/g, "''");
    const imagesJson = JSON.stringify(product.images).replace(/'/g, "''");
    const tagsJson = JSON.stringify(product.tags).replace(/'/g, "''");
    
    return `INSERT INTO products (name, description, price, category_id, stock_quantity, sku, variants, images, rating, reviews_count, status, featured, weight, dimensions, tags) 
VALUES ('${product.name}', '${product.description}', ${product.price}, ${product.category_id}, ${product.stock_quantity}, '${product.sku}', '${variantsJson}', '${imagesJson}', ${product.rating}, ${product.reviews_count}, '${product.status}', ${product.featured}, ${product.weight}, '${product.dimensions}', '${tagsJson}') ON CONFLICT (sku) DO NOTHING;`;
  }).join('\n');

  return `-- Categories
${categoryInserts}

-- Products  
${productInserts}`;
};