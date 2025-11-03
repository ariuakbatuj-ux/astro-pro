import type { APIRoute } from "astro";
import mongoliaAddresses from "../../../../../data/mongoliaAddresses";

export const prerender = false;

// GET /api/addresses/horoos/[aimag]/[district] - Returns horoos for UB districts only
export const GET: APIRoute = async ({ params }) => {
  try {
    const { aimag, district } = params;

    if (!aimag || !district) {
      return new Response(
        JSON.stringify({ error: "Aimag and district parameters are required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const decodedAimag = decodeURIComponent(aimag);
    const decodedDistrict = decodeURIComponent(district);
    
    const aimagData = (mongoliaAddresses as any)[decodedAimag];

    if (!aimagData) {
      return new Response(
        JSON.stringify({ error: "Aimag not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    // Only Ulaanbaatar has horoos
    if (aimagData.type !== "city") {
      return new Response(
        JSON.stringify({ 
          error: "Horoos are only available for Ulaanbaatar",
          message: "Aimags do not have horoo subdivisions"
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const districtData = aimagData.districts[decodedDistrict];

    if (!districtData) {
      return new Response(
        JSON.stringify({ error: "District not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        aimag: decodedAimag,
        district: decodedDistrict,
        count: districtData.horoos.length,
        data: districtData.horoos
      }),
      { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  } catch (error: any) {
    console.error("Error fetching horoos:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch horoos", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
