import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import jwt from 'jsonwebtoken';

export const prerender = false;

const JWT_SECRET = import.meta.env.JWT_SECRET || "your-secret-key-change-this-in-production";

export const GET: APIRoute = async ({ request, url }) => {
  try {
    // Create a test token for user 3 (ariuka) who has wishlist items
    const testUserId = 3;
    
    // First verify user 3 exists
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('_id, username, email, role')
      .eq('_id', testUserId)
      .single();

    if (userError || !userData) {
      return new Response(JSON.stringify({ 
        error: 'Test user not found',
        userError: userError?.message
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Create a JWT token like the signin API does
    const token = jwt.sign(
      { 
        userId: userData._id,  // This will be number 3
        email: userData.email,
        username: userData.username,
        role: userData.role
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    // Test decoding the token
    const decoded = jwt.verify(token, JWT_SECRET) as any;

    // Test fetching wishlist
    const wishlistResponse = await fetch(`${url.origin}/api/wishlist?userId=${testUserId}`);
    const wishlistData = await wishlistResponse.json();

    return new Response(JSON.stringify({ 
      success: true,
      user: userData,
      token: token,
      decoded: decoded,
      wishlistTest: wishlistData,
      debugInfo: {
        tokenUserIdType: typeof decoded.userId,
        tokenUserId: decoded.userId,
        testUserId: testUserId,
        userIdMatch: decoded.userId === testUserId
      }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};