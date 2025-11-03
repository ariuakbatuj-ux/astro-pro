import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { 
      userId,
      firstName, 
      lastName, 
      email, 
      phone, 
      aimag, 
      sum, 
      horoo, 
      addressDetail,
      birthday 
    } = body;

    // Validate required fields
    if (!userId) {
      return new Response(
        JSON.stringify({ error: "User ID is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Combine first and last name
    const fullName = `${firstName || ''} ${lastName || ''}`.trim();

    // Update users table (first_name, last_name, phone) - NOT email
    const updateData: any = {
      first_name: firstName || null,
      last_name: lastName || null,
      phone: phone || null,
      updated_at: new Date().toISOString()
    };

    // Only update email if it's provided (optional)
    if (email) {
      updateData.email = email;
    }

    const { error: userError } = await supabase
      .from('users')
      .update(updateData)
      .eq('_id', userId);

    if (userError) {
      console.error("Error updating user:", userError);
      return new Response(
        JSON.stringify({ error: "Failed to update user information", details: userError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Update or create profile
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('_id')
      .eq('user_id', userId)
      .single();

    if (existingProfile) {
      // Update existing profile - build object dynamically
      const profileUpdateData: any = {
        name: fullName || null,
        phone: phone || null,
        aimag: aimag || null,
        sum: sum || null,
        horoo: horoo || null,
        address_detail: addressDetail || null,
        updated_at: new Date().toISOString()
      };

      // Only add birthday if it's provided (column might not exist)
      if (birthday) {
        profileUpdateData.birthday = birthday;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .update(profileUpdateData)
        .eq('user_id', userId);

      if (profileError) {
        console.error("Error updating profile:", profileError);
        return new Response(
          JSON.stringify({ error: "Failed to update profile", details: profileError.message }),
          { status: 500, headers: { "Content-Type": "application/json" } }
        );
      }
    } else {
      // Create new profile - build object dynamically
      const profileCreateData: any = {
        user_id: userId,
        name: fullName || null,
        phone: phone || null,
        aimag: aimag || null,
        sum: sum || null,
        horoo: horoo || null,
        address_detail: addressDetail || null,
        language: 'en',
        currency: 'USD'
      };

      // Only add birthday if it's provided (column might not exist)
      if (birthday) {
        profileCreateData.birthday = birthday;
      }

      const { error: createError } = await supabase
        .from('profiles')
        .insert(profileCreateData);

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
        message: "Profile updated successfully!"
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Profile update error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
