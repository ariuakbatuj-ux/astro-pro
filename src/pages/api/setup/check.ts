import type { APIRoute } from "astro";

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  const isConfigured = supabaseUrl && 
                      supabaseKey && 
                      supabaseUrl !== "https://your-project-id.supabase.co" && 
                      supabaseKey !== "your-anon-key-from-supabase-dashboard";

  return new Response(
    JSON.stringify({
      configured: isConfigured,
      status: isConfigured ? "✅ Supabase is configured" : "❌ Supabase needs setup",
      details: {
        supabaseUrl: {
          present: !!supabaseUrl,
          isPlaceholder: supabaseUrl === "https://your-project-id.supabase.co",
          value: isConfigured ? supabaseUrl : "Not set or placeholder"
        },
        supabaseKey: {
          present: !!supabaseKey,
          isPlaceholder: supabaseKey === "your-anon-key-from-supabase-dashboard",
          value: isConfigured ? `${supabaseKey.substring(0, 20)}...` : "Not set or placeholder"
        }
      },
      nextSteps: isConfigured ? [
        "✅ Supabase is configured!",
        "Next: Run SUPABASE_SETUP.sql in your Supabase SQL Editor",
        "Then: Run SUPABASE_AUTH_INTEGRATION.sql",
        "Finally: Test user registration and login"
      ] : [
        "1. Create a Supabase project at https://supabase.com/dashboard",
        "2. Go to Settings → API in your project",
        "3. Copy your Project URL and anon public key",
        "4. Update your .env file with real values",
        "5. Restart your development server"
      ],
      testEndpoints: {
        adminLogin: "/api/auth/signin (use admin@shophub.com / admin123)",
        userSignup: "/api/auth/signup (demo mode until Supabase configured)",
        setupCheck: "/api/setup/check (this endpoint)"
      }
    }),
    { 
      status: 200, 
      headers: { "Content-Type": "application/json" } 
    }
  );
};

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { supabaseUrl, supabaseKey } = body;
    
    if (!supabaseUrl || !supabaseKey) {
      return new Response(
        JSON.stringify({ 
          error: "Both supabaseUrl and supabaseKey are required",
          example: {
            supabaseUrl: "https://your-project-id.supabase.co",
            supabaseKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
          }
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    // Basic validation
    if (!supabaseUrl.includes("supabase.co")) {
      return new Response(
        JSON.stringify({ error: "Invalid Supabase URL format" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    if (!supabaseKey.startsWith("eyJ")) {
      return new Response(
        JSON.stringify({ error: "Invalid Supabase key format (should start with eyJ)" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    
    return new Response(
      JSON.stringify({
        message: "✅ Credentials look valid! Please update your .env file manually:",
        envUpdate: {
          file: ".env",
          lines: [
            `SUPABASE_URL=${supabaseUrl}`,
            `SUPABASE_ANON_KEY=${supabaseKey}`
          ]
        },
        nextSteps: [
          "1. Update your .env file with the values above",
          "2. Restart your development server",
          "3. Run SUPABASE_SETUP.sql in Supabase SQL Editor",
          "4. Run SUPABASE_AUTH_INTEGRATION.sql",
          "5. Test the setup with GET /api/setup/check"
        ]
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON in request body" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }
};