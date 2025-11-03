import type { APIRoute } from "astro";
import { createClient } from "@supabase/supabase-js";
import { featuredProducts, categories, generateProductInserts } from "../../../data/products";

export const prerender = false;

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client only if credentials are provided
let supabase: any = null;
if (supabaseUrl && supabaseKey && supabaseUrl !== "https://your-project-id.supabase.co") {
  supabase = createClient(supabaseUrl, supabaseKey);
}

// GET - Fetch all products
export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const featured = url.searchParams.get('featured');
    const category = url.searchParams.get('category');
    
    if (supabase) {
      // Use Supabase database
      let query = supabase
        .from('products')
        .select(`
          *,
          categories (
            name,
            slug
          )
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (featured === 'true') {
        query = query.eq('featured', true);
      }

      if (category) {
        query = query.eq('categories.slug', category);
      }

      const { data: products, error } = await query;

      if (error) {
        console.error('Supabase error:', error);
        return new Response(
          JSON.stringify({ error: 'Failed to fetch products' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({
          success: true,
          products: products || [],
          source: 'supabase',
          count: products?.length || 0
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    } else {
      // Use temporary data
      let products = [...featuredProducts];

      if (featured === 'true') {
        products = products.filter(p => p.featured);
      }

      if (category) {
        const categoryObj = categories.find((c: any) => c.slug === category);
        if (categoryObj) {
          products = products.filter((p: any) => p.category_id === categoryObj._id);
        }
      }

      // Add category info to products
      const productsWithCategories = products.map((product: any) => ({
        ...product,
        category: categories.find((c: any) => c._id === product.category_id)
      }));

      return new Response(
        JSON.stringify({
          success: true,
          products: productsWithCategories,
          source: 'temporary',
          count: productsWithCategories.length,
          message: "Using temporary data. Configure Supabase to use database."
        }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
  } catch (error) {
    console.error('Products API error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};

// POST - Add products to database (bulk import)
export const POST: APIRoute = async ({ request }) => {
  try {
    if (!supabase) {
      return new Response(
        JSON.stringify({ 
          error: "Database not configured",
          message: "Supabase is required to add products to database",
          sqlScript: generateProductInserts(),
          instructions: [
            "1. Configure Supabase in your .env file",
            "2. Run SUPABASE_SETUP.sql to create tables",
            "3. Use the SQL script above to insert products",
            "4. Or use this API endpoint after Supabase is configured"
          ]
        }),
        { status: 503, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await request.json();
    const { action } = body;

    if (action === 'import_featured') {
      // Import all featured products
      try {
        // First insert categories
        const { error: categoriesError } = await supabase
          .from('categories')
          .upsert(categories, { onConflict: 'slug' });

        if (categoriesError) {
          console.error('Categories insert error:', categoriesError);
          return new Response(
            JSON.stringify({ error: 'Failed to insert categories' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }

        // Then insert products
        const { data: insertedProducts, error: productsError } = await supabase
          .from('products')
          .upsert(featuredProducts.map((p: any) => ({
            name: p.name,
            description: p.description,
            price: p.price,
            category_id: p.category_id,
            stock_quantity: p.stock_quantity,
            sku: p.sku,
            variants: p.variants,
            images: p.images,
            rating: p.rating,
            reviews_count: p.reviews_count,
            status: p.status,
            featured: p.featured,
            weight: p.weight,
            dimensions: p.dimensions,
            tags: p.tags
          })), { onConflict: 'sku' });

        if (productsError) {
          console.error('Products insert error:', productsError);
          return new Response(
            JSON.stringify({ error: 'Failed to insert products' }),
            { status: 500, headers: { 'Content-Type': 'application/json' } }
          );
        }

        return new Response(
          JSON.stringify({
            success: true,
            message: 'Featured products imported successfully',
            imported: {
              categories: categories.length,
              products: featuredProducts.length
            }
          }),
          { status: 201, headers: { 'Content-Type': 'application/json' } }
        );

      } catch (importError) {
        console.error('Import error:', importError);
        return new Response(
          JSON.stringify({ error: 'Failed to import products' }),
          { status: 500, headers: { 'Content-Type': 'application/json' } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: 'Invalid action. Use action: "import_featured"' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Products POST error:', error);
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
};