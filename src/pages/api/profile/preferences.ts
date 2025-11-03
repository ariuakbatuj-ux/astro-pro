import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { userId, language, currency } = body;

    // Validate required fields
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update profile preferences
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('_id')
      .eq('user_id', userId)
      .single();

    if (existingProfile) {
      // Update existing profile
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          language: language || 'en',
          currency: currency || 'USD',
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (profileError) {
        console.error("Error updating preferences:", profileError);
        return new Response(
          JSON.stringify({ error: "Failed to update preferences", details: profileError.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    } else {
      // Create new profile with preferences
      const { error: createError } = await supabase
        .from('profiles')
        .insert({
          user_id: userId,
          language: language || 'en',
          currency: currency || 'USD'
        });

      if (createError) {
        console.error("Error creating profile:", createError);
        return new Response(
          JSON.stringify({ error: "Failed to create profile", details: createError.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Preferences updated successfully!"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Preferences update error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
