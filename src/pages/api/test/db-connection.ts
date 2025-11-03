import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    // Test 1: Check if client is initialized
    if (!supabase) {
      return new Response(
        JSON.stringify({
          success: false,
          error: "Supabase client not initialized",
          timestamp: new Date().toISOString()
        }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Test 2: Try to query the wishlist table
    const { data: wishlistData, error: wishlistError } = await supabase
      .from('wishlist')
      .select('*')
      .limit(1);

    // Test 3: Try to query users table
    const { data: usersData, error: usersError } = await supabase
      .from('users')
      .select('_id, username, email')
      .limit(1);

    // Test 4: Try to query products table
    const { data: productsData, error: productsError } = await supabase
      .from('products')
      .select('_id, name')
      .limit(1);

    const results = {
      success: true,
      timestamp: new Date().toISOString(),
      connection: {
        status: "✅ Connected",
        url: import.meta.env.APP_DATABASE_URL || "Not configured"
      },
      tables: {
        wishlist: {
          accessible: !wishlistError,
          error: wishlistError?.message || null,
          sampleCount: wishlistData?.length || 0
        },
        users: {
          accessible: !usersError,
          error: usersError?.message || null,
          sampleCount: usersData?.length || 0
        },
        products: {
          accessible: !productsError,
          error: productsError?.message || null,
          sampleCount: productsData?.length || 0
        }
      },
      summary: {
        allTablesAccessible: !wishlistError && !usersError && !productsError,
        message: !wishlistError && !usersError && !productsError 
          ? "✅ All tables are accessible"
          : "⚠️ Some tables may not exist or have RLS policies"
      }
    };

    return new Response(
      JSON.stringify(results, null, 2),
      { 
        status: 200, 
        headers: { "Content-Type": "application/json" } 
      }
    );

  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString()
      }),
      { 
        status: 500, 
        headers: { "Content-Type": "application/json" } 
      }
    );
  }
};
