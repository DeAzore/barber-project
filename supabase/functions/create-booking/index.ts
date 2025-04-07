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

    // Get the booking data from the request body
    const bookingData = await req.json();
    
    // Validate required fields
    const requiredFields = [
      'service_id', 
      'stylist_id', 
      'client_name', 
      'client_email', 
      'client_phone', 
      'booking_date', 
      'booking_time'
    ];
    
    for (const field of requiredFields) {
      if (!bookingData[field]) {
        return new Response(
          JSON.stringify({ error: `${field} is required` }),
          { 
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
          }
        );
      }
    }

    // Insert the booking using service role (bypassing RLS)
    const { data, error } = await supabaseClient
      .from('bookings')
      .insert([{
        ...bookingData,
        status: 'pending',
        confirmed: false,
        whatsapp_notifications: true
      }])
      .select()
      .single();

    if (error) {
      console.error('Error creating booking:', error);
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
    console.error('Error in create-booking:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
