import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.23.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Get stylist data from the request
    const stylistData = await req.json();
    const { id, name, role, experience, specialties, image_url, available, user_id } = stylistData;

    // Validate required fields
    if (!id || !name || !role || !experience || !specialties || !image_url) {
      throw new Error("Missing required fields");
    }

    // Update stylist
    const { data, error } = await supabase
      .from("stylists")
      .update({
        name,
        role,
        experience,
        specialties,
        image_url,
        available: available !== undefined ? available : true,
        user_id: user_id || null
      })
      .eq("id", id)
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify(data?.[0] || {}),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    console.error("Error updating stylist:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 400,
      }
    );
  }
});
