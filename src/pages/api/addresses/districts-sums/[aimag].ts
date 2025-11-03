import type { APIRoute } from "astro";
import mongoliaAddresses from "../../../../data/mongoliaAddresses";

export const prerender = false;

// GET /api/addresses/districts-sums/[aimag] - Returns districts (for UB) or sums (for aimags)
export const GET: APIRoute = async ({ params }) => {
  try {
    const { aimag } = params;

    if (!aimag) {
      return new Response(
        JSON.stringify({ error: "Aimag parameter is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const decodedAimag = decodeURIComponent(aimag);
    const aimagData = (mongoliaAddresses as any)[decodedAimag];

    if (!aimagData) {
      return new Response(
        JSON.stringify({ error: "Aimag not found" }),
        { status: 404, headers: { "Content-Type": "application/json" } }
      );
    }

    let data: string[] = [];
    let type: string = "";

    if (aimagData.type === "city") {
      // Ulaanbaatar - return districts
      data = Object.keys(aimagData.districts);
      type = "districts";
    } else {
      // Aimag - return sums
      data = aimagData.sums;
      type = "sums";
    }

    return new Response(
      JSON.stringify({
        success: true,
        aimagType: aimagData.type,
        dataType: type,
        count: data.length,
        data
      }),
      { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  } catch (error: any) {
    console.error("Error fetching districts/sums:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch districts/sums", details: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
};
