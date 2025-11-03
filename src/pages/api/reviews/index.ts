import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';

export const prerender = false;

// GET reviews for a product
export const GET: APIRoute = async ({ request, url }) => {
  try {
    const productId = url.searchParams.get('productId');
    const rating = url.searchParams.get('rating');
    const limit = parseInt(url.searchParams.get('limit') || '20');
    const offset = parseInt(url.searchParams.get('offset') || '0');
    
    if (!productId) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Product ID is required',
        reviews: []
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`Fetching reviews for product ${productId}`);

    // Build query
    let query = supabase
      .from('reviews')
      .select(`
        _id,
        product_id,
        user_id,
        rating,
        comment,
        helpful_count,
        created_at,
        users!inner (
          _id,
          username,
          profiles (
            name
          )
        )
      `)
      .eq('product_id', parseInt(productId))
      .eq('status', 'approved')
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    // Filter by rating if specified
    if (rating) {
      query = query.eq('rating', parseInt(rating));
    }

    const { data: reviewsData, error: reviewsError } = await query;

    if (reviewsError) {
      console.error('Error fetching reviews:', reviewsError);
      return new Response(JSON.stringify({ 
        success: false,
        error: reviewsError.message,
        reviews: []
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Format reviews
    const reviews = reviewsData?.map((review: any) => {
      const user = review.users;
      const displayName = user?.username || 'Anonymous';
      
      return {
        id: review._id,
        productId: review.product_id,
        userId: review.user_id,
        rating: review.rating,
        comment: review.comment,
        helpfulCount: review.helpful_count,
        createdAt: review.created_at,
        userName: displayName,
        userInitials: displayName.substring(0, 2).toUpperCase()
      };
    }) || [];

    console.log(`Found ${reviews.length} reviews`);

    return new Response(JSON.stringify({ 
      success: true,
      reviews: reviews,
      count: reviews.length
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Reviews fetch error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error',
      reviews: []
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST a new review
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { userId, productId, rating, comment } = body;

    if (!userId || !productId || !rating) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'User ID, Product ID, and Rating are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (rating < 1 || rating > 5) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Rating must be between 1 and 5' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`Creating review for product ${productId} by user ${userId}`);

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

    // Check if user already reviewed this product
    const { data: existing, error: checkError } = await supabase
      .from('reviews')
      .select('_id')
      .eq('user_id', parseInt(userId))
      .eq('product_id', parseInt(productId))
      .maybeSingle();

    if (checkError) {
      console.error('Error checking existing review:', checkError);
    }

    if (existing) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'You have already reviewed this product. You can update your review instead.',
        alreadyExists: true
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create review
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        user_id: parseInt(userId),
        product_id: parseInt(productId),
        rating: parseInt(rating),
        comment: comment || null,
        status: 'approved' // Auto-approve for now
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating review:', error);
      return new Response(JSON.stringify({ 
        success: false,
        error: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`Review created successfully for ${productData.name} by ${userData.username}`);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Review submitted successfully!',
      data: {
        reviewId: data._id,
        productName: productData.name,
        userName: userData.username
      }
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Review creation error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// PUT update an existing review
export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { userId, productId, rating, comment } = body;

    if (!userId || !productId || !rating) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'User ID, Product ID, and Rating are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (rating < 1 || rating > 5) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Rating must be between 1 and 5' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`Updating review for product ${productId} by user ${userId}`);

    // Update review
    const { data, error } = await supabase
      .from('reviews')
      .update({
        rating: parseInt(rating),
        comment: comment || null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', parseInt(userId))
      .eq('product_id', parseInt(productId))
      .select()
      .single();

    if (error) {
      console.error('Error updating review:', error);
      return new Response(JSON.stringify({ 
        success: false,
        error: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!data) {
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Review not found' 
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`Review updated successfully`);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Review updated successfully!',
      data: {
        reviewId: data._id
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Review update error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE a review
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

    console.log(`Deleting review for product ${productId} by user ${userId}`);

    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('user_id', parseInt(userId))
      .eq('product_id', parseInt(productId));

    if (error) {
      console.error('Error deleting review:', error);
      return new Response(JSON.stringify({ 
        success: false,
        error: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    console.log(`Review deleted successfully`);

    return new Response(JSON.stringify({ 
      success: true,
      message: 'Review deleted successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Review deletion error:', error);
    return new Response(JSON.stringify({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
