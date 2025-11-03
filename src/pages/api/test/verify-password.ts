import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import bcrypt from 'bcryptjs';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { userId, password } = body;

    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('_id, username, email, password')
      .eq('_id', parseInt(userId))
      .single();

    if (error || !user) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User not found',
        details: error?.message
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Test password
    let isValid = false;
    let testResults: any = {
      userFound: true,
      username: user.username,
      email: user.email,
      storedHash: user.password ? user.password.substring(0, 30) + '...' : 'NULL',
      passwordProvided: password,
      bcryptResult: null,
      directMatch: user.password === password,
      hashFormat: user.password ? (user.password.startsWith('$2a$') || user.password.startsWith('$2b$') ? 'bcrypt' : 'unknown') : 'none'
    };

    if (user.password) {
      try {
        isValid = await bcrypt.compare(password, user.password);
        testResults.bcryptResult = isValid;
      } catch (bcryptError: any) {
        testResults.bcryptResult = 'ERROR: ' + bcryptError.message;
      }
    }

    return new Response(JSON.stringify({
      success: true,
      passwordValid: isValid,
      testResults
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
