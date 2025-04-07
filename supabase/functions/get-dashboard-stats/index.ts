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

    // Get current date
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    
    // Get start of current week (Monday)
    const dayOfWeek = today.getDay() || 7;
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - dayOfWeek + 1);
    const startOfWeekString = startOfWeek.toISOString().split('T')[0];
    
    // Get end of current week (Sunday)
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    const endOfWeekString = endOfWeek.toISOString().split('T')[0];

    // Get bookings today
    const { data: todayBookings, error: todayError } = await supabaseClient
      .from('bookings')
      .select('id')
      .eq('booking_date', todayString);
    
    if (todayError) throw new Error(`Error fetching today's bookings: ${todayError.message}`);
    
    // Get bookings this week
    const { data: weekBookings, error: weekError } = await supabaseClient
      .from('bookings')
      .select('id')
      .gte('booking_date', startOfWeekString)
      .lte('booking_date', endOfWeekString);
    
    if (weekError) throw new Error(`Error fetching week's bookings: ${weekError.message}`);
    
    // Count unique clients by email
    const { data: clients, error: clientsError } = await supabaseClient
      .from('bookings')
      .select('client_email')
      .not('client_email', 'is', null);
    
    if (clientsError) throw new Error(`Error fetching clients: ${clientsError.message}`);
    
    const uniqueClients = new Set(clients?.map(client => client.client_email) || []);
    
    // Count stylists
    const { data: stylists, error: stylistsError } = await supabaseClient
      .from('stylists')
      .select('id');
    
    if (stylistsError) throw new Error(`Error fetching stylists: ${stylistsError.message}`);
    
    // Return stats
    const stats = {
      bookings_today: todayBookings?.length || 0,
      bookings_week: weekBookings?.length || 0,
      total_clients: uniqueClients.size,
      total_stylists: stylists?.length || 0
    };

    console.log("Dashboard stats retrieved successfully:", stats);

    return new Response(
      JSON.stringify(stats),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
