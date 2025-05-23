import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

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
    // Create authenticated Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      {
        auth: {
          persistSession: false,
        },
      }
    );

    // Get the request body
    const { appointment_id, status_value, confirmed_value } = await req.json();
    
    if (!appointment_id) {
      return new Response(
        JSON.stringify({ error: 'Appointment ID is required' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Call the RPC function to update appointment status
    const { data, error } = await supabaseClient.rpc(
      'update_appointment_status',
      { 
        appointment_id, 
        status_value: status_value || null, 
        confirmed_value: confirmed_value !== undefined ? confirmed_value : null
      }
    );

    if (error) {
      console.error('Error updating appointment status:', error);
      return new Response(
        JSON.stringify({ error: error.message }),
        { 
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );

  } catch (error) {
    console.error('Error in update-appointment-status:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
