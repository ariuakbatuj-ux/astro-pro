import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

export const GET: APIRoute = async ({ request, url }) => {
  try {
    const userId = url.searchParams.get('userId');
    
    if (!userId) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'User ID is required',
        wishlist: []
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('Fetching wishlist for user ID:', userId);

    // First verify user exists
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('_id, username, email')
      .eq('_id', parseInt(userId))
      .single();

    if (userError || !userData) {
      console.error('User not found:', userError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'User not found',
        wishlist: []
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log('User found:', userData.username);

    // Fetch wishlist items with product details using JOIN
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
      .eq('user_id', parseInt(userId))
      .eq('products.status', 'active')
      .order('created_at', { ascending: false });

    if (wishlistError) {
      console.error('Error fetching wishlist:', wishlistError);
      return new Response(JSON.stringify({ 
        success: false,
        error: wishlistError.message,
        wishlist: []
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`Found ${wishlistData?.length || 0} wishlist items for user ${userData.username}`);

    if (!wishlistData || wishlistData.length === 0) {
      return new Response(JSON.stringify({ 
        success: true,
        wishlist: [],
        count: 0,
        message: `No wishlist items found for user ${userData.username}`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Format wishlist data
    const wishlist = wishlistData.map((item: any) => {
      const product = item.products;
      
      if (!product) {
        console.log('No product data for wishlist item:', item._id);
        return null;
      }
      
      // Handle image parsing
      let imageUrl = 'https://via.placeholder.com/400x300?text=No+Image';
      if (product.images) {
        try {
          if (Array.isArray(product.images) && product.images.length > 0) {
            imageUrl = product.images[0];
          } else if (typeof product.images === 'string') {
            const parsed = JSON.parse(product.images);
            imageUrl = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : imageUrl;
          }
        } catch (e) {
          // If JSON parse fails, check if it's a direct URL
          if (typeof product.images === 'string' && product.images.startsWith('http')) {
            imageUrl = product.images;
          }
        }
      }
      
      return {
        wishlistId: item._id,
        productId: product._id,
        name: product.name || 'Unnamed Product',
        description: product.description || 'No description available',
        price: parseFloat(product.price) || 0,
        image: imageUrl,
        stock_quantity: product.stock_quantity || 0,
        rating: product.rating || 0,
        addedAt: item.created_at,
        userId: item.user_id
      };
    }).filter(item => item !== null);

    console.log(`Formatted ${wishlist.length} wishlist items`);

    return new Response(JSON.stringify({ 
      success: true,
      wishlist: wishlist,
      count: wishlist.length,
      user: {
        id: userData._id,
        username: userData.username,
        email: userData.email
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Wishlist fetch error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      wishlist: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { userId, productId } = body;

    if (!userId || !productId) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'User ID and Product ID are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`Adding product ${productId} to wishlist for user ${userId}`);

    // Verify user exists
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('_id, username')
      .eq('_id', parseInt(userId))
      .single();

    if (userError || !userData) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'User not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verify product exists
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('_id, name, status')
      .eq('_id', parseInt(productId))
      .single();

    if (productError || !productData) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Product not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (productData.status !== 'active') {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Product is not available' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Check if already in wishlist
    const { data: existing, error: checkError } = await supabase
      .from('wishlist')
      .select('_id')
      .eq('user_id', parseInt(userId))
      .eq('product_id', parseInt(productId))
      .maybeSingle();

    if (checkError) {
      console.error('Error checking wishlist:', checkError);
    }

    if (existing) {
      return new Response(JSON.stringify({ 
        success: true,
        message: `${productData.name} is already in your wishlist`,
        alreadyExists: true
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Add to wishlist
    const { data, error } = await supabase
      .from('wishlist')
      .insert({
        user_id: parseInt(userId),
        product_id: parseInt(productId)
      })
      .select()
      .single();

    if (error) {
      console.error('Error adding to wishlist:', error);
      return new Response(JSON.stringify({ 
        success: false,
        error: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`Successfully added ${productData.name} to ${userData.username}'s wishlist`);

    return new Response(JSON.stringify({ 
      success: true,
      message: `${productData.name} added to wishlist`,
      data: {
        wishlistId: data._id,
        productName: productData.name,
        userName: userData.username
      }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Wishlist add error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

export const DELETE: APIRoute = async ({ request, url }) => {
  try {
    const userId = url.searchParams.get('userId');
    const productId = url.searchParams.get('productId');

    if (!userId || !productId) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'User ID and Product ID are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`Removing product ${productId} from wishlist for user ${userId}`);

    // Verify user exists
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('_id, username')
      .eq('_id', parseInt(userId))
      .single();

    if (userError || !userData) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'User not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Get product name for better response message
    const { data: productData } = await supabase
      .from('products')
      .select('name')
      .eq('_id', parseInt(productId))
      .single();

    // Check if item exists in wishlist before deletion
    const { data: existing, error: checkError } = await supabase
      .from('wishlist')
      .select('_id')
      .eq('user_id', parseInt(userId))
      .eq('product_id', parseInt(productId))
      .maybeSingle();

    if (checkError) {
      console.error('Error checking wishlist:', checkError);
    }

    if (!existing) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Item not found in wishlist',
        notFound: true
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Delete from wishlist
    const { error } = await supabase
      .from('wishlist')
      .delete()
      .eq('user_id', parseInt(userId))
      .eq('product_id', parseInt(productId));

    if (error) {
      console.error('Error removing from wishlist:', error);
      return new Response(JSON.stringify({ 
        success: false,
        error: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const productName = productData?.name || 'Product';
    console.log(`Successfully removed ${productName} from ${userData.username}'s wishlist`);

    return new Response(JSON.stringify({ 
      success: true,
      message: `${productName} removed from wishlist`,
      data: {
        productName,
        userName: userData.username
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Wishlist remove error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
