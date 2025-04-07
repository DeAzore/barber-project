import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { phone, templateName, languageCode, components } = await req.json();

    // Validate required parameters
    if (!phone || !templateName || !components) {
      return new Response(
        JSON.stringify({ error: "Missing required parameters" }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Format phone number if needed (ensure it starts with country code)
    let formattedPhone = phone;
    if (formattedPhone && !formattedPhone.startsWith('+')) {
      if (formattedPhone.startsWith('0')) {
        formattedPhone = '+33' + formattedPhone.substring(1);
      } else {
        formattedPhone = '+' + formattedPhone;
      }
    }

    console.log(`Sending WhatsApp message to ${formattedPhone}, template: ${templateName}`);
    console.log(`Message components:`, JSON.stringify(components));

    // In a real implementation with WhatsApp Business API, you would send to WhatsApp here
    // For now, we'll just return success and the formatted message
    
    let messageSimulation = "";
    if (templateName === "appointment_confirmation") {
      const name = components?.[0]?.parameters?.[0]?.text || "";
      const date = components?.[0]?.parameters?.[1]?.text || "";
      const time = components?.[0]?.parameters?.[2]?.text || "";
      const service = components?.[0]?.parameters?.[3]?.text || "";
      const stylist = components?.[0]?.parameters?.[4]?.text || "";
      
      messageSimulation = `Bonjour ${name}, nous confirmons votre rendez-vous du ${date} à ${time} pour ${service} avec ${stylist}. À bientôt!`;
    } else if (templateName === "appointment_reminder") {
      const name = components?.[0]?.parameters?.[0]?.text || "";
      const date = components?.[0]?.parameters?.[1]?.text || "";
      const time = components?.[0]?.parameters?.[2]?.text || "";
      
      messageSimulation = `Bonjour ${name}, nous vous rappelons votre rendez-vous demain le ${date} à ${time}. À bientôt!`;
    } else if (templateName === "appointment_reschedule") {
      const name = components?.[0]?.parameters?.[0]?.text || "";
      const service = components?.[0]?.parameters?.[3]?.text || "";
      
      messageSimulation = `Bonjour ${name}, nous devons malheureusement reprogrammer votre rendez-vous pour ${service}. Pouvez-vous nous contacter pour choisir une nouvelle date? Merci de votre compréhension.`;
    }

    // Create Supabase client to log the message attempt
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    // Log the whatsapp message attempt
    await supabaseClient.from("whatsapp_logs").insert({
      phone: formattedPhone,
      template_name: templateName,
      message_preview: messageSimulation,
      status: "simulated"
    });

    return new Response(
      JSON.stringify({ 
        success: true,
        message: messageSimulation,
        phone: formattedPhone
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('Error in send-whatsapp:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});
