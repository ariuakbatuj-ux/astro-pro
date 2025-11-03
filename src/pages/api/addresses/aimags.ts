import type { APIRoute } from "astro";
import mongoliaAddresses from "../../../data/mongoliaAddresses";

export const prerender = false;

// GET /api/addresses/aimags - Returns all 22 locations (1 city + 21 aimags)
export const GET: APIRoute = async () => {
  try {
    const aimags = Object.keys(mongoliaAddresses).map(name => ({
      name,
      type: (mongoliaAddresses as any)[name].type
    }));

    console.log('Returning aimags:', aimags.slice(0, 3)); // Debug first 3

    return new Response(
      JSON.stringify({
        success: true,
        count: aimags.length,
        data: aimags
      }),
      { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  } catch (error: any) {
    console.error("Error fetching aimags:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch aimags", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
