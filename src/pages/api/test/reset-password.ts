import type { APIRoute } from 'astro';
import { supabase } from '../../../lib/supabase';
import bcrypt from 'bcryptjs';

export const prerender = false;

// This endpoint resets a user's password to a known value
export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { username, newPassword } = body;

    if (!username || !newPassword) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Username and newPassword are required'
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Generate bcrypt hash
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(newPassword, salt);

    console.log('Resetting password for:', username);
    console.log('New hash:', hash);

    // Update password in database
    const { data, error } = await supabase
      .from('users')
      .update({ password: hash })
      .eq('username', username)
      .select('_id, username, email');

    if (error) {
      return new Response(JSON.stringify({
        success: false,
        error: 'Failed to update password: ' + error.message
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (!data || data.length === 0) {
      return new Response(JSON.stringify({
        success: false,
        error: 'User not found'
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Test the new password
    const { data: testUser } = await supabase
      .from('users')
      .select('password')
      .eq('username', username)
      .single();

    const testResult = testUser ? await bcrypt.compare(newPassword, testUser.password) : false;

    return new Response(JSON.stringify({
      success: true,
      message: 'Password reset successfully',
      user: data[0],
      newPasswordHash: hash,
      testVerification: testResult ? '✅ Password verified' : '❌ Verification failed'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Reset password error:', error);
    return new Response(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
