import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';

// GET /api/users - Fetch users
export const GET: APIRoute = async ({ url }) => {
  try {
    const limit = url.searchParams.get('limit') || '10';
    const role = url.searchParams.get('role');
    
    let query = supabase
      .from('users')
      .select('_id, username, email, role, created_at');
    
    // Add role filter if provided
    if (role) {
      query = query.eq('role', role);
    }
    
    // Add limit
    query = query.limit(parseInt(limit));
    
    const { data, error } = await query;

    if (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      count: data.length,
      users: data 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// POST /api/users - Create new user
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.username || !body.email) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'Username and email are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Insert new user
    const { data, error } = await supabase
      .from('users')
      .insert({
        username: body.username,
        email: body.email,
        role: body.role || 'customer',
        account_status: 'active'
      })
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      user: data 
    }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// PUT /api/users - Update user
export const PUT: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    if (!body._id) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'User ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // Build update object
    const updates: any = {};
    if (body.username) updates.username = body.username;
    if (body.email) updates.email = body.email;
    if (body.role) updates.role = body.role;
    
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('_id', body._id)
      .select()
      .single();

    if (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      user: data 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};

// DELETE /api/users - Delete user
export const DELETE: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    
    if (!body._id) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: 'User ID is required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    const { error } = await supabase
      .from('users')
      .delete()
      .eq('_id', body._id);

    if (error) {
      return new Response(JSON.stringify({ 
        success: false, 
        error: error.message 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: 'User deleted successfully' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
