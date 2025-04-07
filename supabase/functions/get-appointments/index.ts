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
    // Parse filter from request body
    const { filter = "all" } = await req.json();
    
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

    // Get current date
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Base query to get bookings with service and stylist details
    // Use DISTINCT ON to prevent duplicate appointments
    let query = supabaseClient
      .from('bookings')
      .select(`
        *,
        service:service_id(title),
        stylist:stylist_id(name)
      `);
    
    // Apply filters based on the requested filter type
    switch (filter) {
      case "today":
        query = query.eq('booking_date', todayString);
        break;
      case "upcoming":
        query = query.gte('booking_date', todayString);
        break;
      case "confirmed":
        query = query.eq('confirmed', true);
        break;
      case "pending":
        query = query.eq('confirmed', false);
        break;
      // "all" filter doesn't need additional constraints
    }
    
    // Execute the query, ordered by date and time
    const { data, error } = await query.order('booking_date', { ascending: true }).order('booking_time', { ascending: true });
    
    if (error) throw error;
    
    // Filter out potential duplicate appointments
    const uniqueAppointments = data ? filterDuplicateAppointments(data) : [];

    console.log(`Retrieved ${uniqueAppointments.length || 0} appointments with filter: ${filter}`);
    
    return new Response(
      JSON.stringify(uniqueAppointments || []),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error getting appointments:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});

// Helper function to filter out duplicate appointments
function filterDuplicateAppointments(appointments) {
  const uniqueKeys = new Map();
  
  return appointments.filter(appointment => {
    // Create a unique key based on client, date, time, and service
    const key = `${appointment.client_name}-${appointment.booking_date}-${appointment.booking_time}-${appointment.service_id}`;
    
    // If we haven't seen this key before, keep the appointment
    if (!uniqueKeys.has(key)) {
      uniqueKeys.set(key, true);
      return true;
    }
    
    // Otherwise, it's a duplicate
    return false;
  });
}
