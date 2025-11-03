import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const prerender = false;

const JWT_SECRET = import.meta.env.JWT_SECRET || "your-secret-key-change-this-in-production";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { email, username, password, name, first_name, last_name } = body;

    if (!email || !username || !password) {
      return new Response(
        JSON.stringify({ error: "Email, username, and password are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    if (password.length < 6) {
      return new Response(
        JSON.stringify({ error: "Password must be at least 6 characters long" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { data: existingUser } = await supabase
      .from('users')
      .select('_id')
      .or(`email.eq.${email},username.eq.${username}`)
      .single();

    if (existingUser) {
      return new Response(
        JSON.stringify({ error: "User with this email or username already exists" }),
        { status: 409, headers: { "Content-Type": "application/json" } }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const { data: newUser, error: userError } = await supabase
      .from('users')
      .insert({
        username,
        email,
        password: hashedPassword,
        first_name: first_name || null,
        last_name: last_name || null,
        role: 'customer',
        account_status: 'active'
      })
      .select()
      .single();

    if (userError) {
      console.error("Database error creating user:", userError);
      return new Response(
        JSON.stringify({ error: "Failed to create user account", details: userError.message }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .insert({
        user_id: newUser._id,
        name: name || username,
        language: 'en',
        currency: 'USD'
      });

    if (profileError) {
      console.error("Database error creating profile:", profileError);
    }

    const token = jwt.sign(
      { 
        userId: newUser._id,
        email: newUser.email,
        username: newUser.username,
        role: newUser.role
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    return new Response(
      JSON.stringify({ 
        success: true,
        message: "Account created successfully!",
        token,
        user: {
          id: newUser._id,
          username: newUser.username,
          email: newUser.email,
          role: newUser.role,
          accountStatus: newUser.account_status
        }
      }),
      { status: 201, headers: { "Content-Type": "application/json" } }
    );

  } catch (error: any) {
    console.error("Signup error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};