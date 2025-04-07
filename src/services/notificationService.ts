import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";
import { createAppointmentNotification } from "@/services/notificationsSystemService";

// Explicitly define the return type for the booking details RPC function
type BookingDetails = {
  booking_id: string;
  client_name: string;
  client_phone: string | null;
  client_email: string | null;
  booking_date: string;
  booking_time: string;
  service_title: string;
  stylist_name: string;
  status: string;
  confirmed: boolean;
};

// Fonction pour récupérer les données d'un rendez-vous avec service et styliste
async function getBookingDetailsRPC(bookingId: string): Promise<BookingDetails | null> {
  try {
    // Use explicit typing for the function call
    const { data, error } = await supabase.rpc('get_booking_details', { booking_id: bookingId });
    
    if (error) throw error;
    if (!data) return null;
    return data as BookingDetails;
  } catch (error) {
    console.error('Error in getBookingDetailsRPC:', error);
    throw error;
  }
}

// Fonction pour mettre à jour le statut d'un rendez-vous
async function updateBookingStatusRPC(bookingId: string, status: string, confirmed: boolean): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc('update_appointment_status', {
      appointment_id: bookingId,
      status_value: status,
      confirmed_value: confirmed
    });
    
    if (error) throw error;
    return data ?? false;
  } catch (error) {
    console.error('Error in updateBookingStatusRPC:', error);
    throw error;
  }
}

export const sendAppointmentConfirmation = async (bookingId: string, messageType: string = "confirmation", method: string = "whatsapp") => {
  try {
    // Récupérer les détails du rendez-vous
    const booking = await getBookingDetailsRPC(bookingId);
    
    if (!booking) throw new Error("Booking not found");

    // Format date from ISO to readable date
    const formattedDate = format(
      new Date(booking.booking_date), 
      'EEEE d MMMM yyyy', 
      { locale: fr }
    );

    // Prepare template components for WhatsApp message
    const components = [
      {
        type: "body",
        parameters: [
          { type: "text", text: booking.client_name },
          { type: "text", text: formattedDate },
          { type: "text", text: booking.booking_time },
          { type: "text", text: booking.service_title },
          { type: "text", text: booking.stylist_name }
        ]
      }
    ];

    let notificationType = "confirmation";
    
    if (method === "whatsapp" && booking.client_phone) {
      // Call the Supabase Edge Function to send WhatsApp message
      const { data, error: sendError } = await supabase.functions.invoke('send-whatsapp', {
        body: {
          phone: booking.client_phone,
          templateName: messageType === "confirmation" ? 'appointment_confirmation' : 
                        messageType === "reminder" ? 'appointment_reminder' : 'appointment_reschedule',
          languageCode: 'fr',
          components
        }
      });

      if (sendError) throw sendError;
      
      notificationType = messageType;
    } else if (method === "email" && booking.client_email) {
      // Here we would implement email sending
      // For now we'll just log it
      console.log(`Email would be sent to ${booking.client_email}`);
      notificationType = messageType;
    }

    // Update booking status in database if it's a confirmation
    if (messageType === "confirmation") {
      await updateBookingStatusRPC(bookingId, 'confirmed', true);
      
      // Create a notification for the confirmed appointment
      await createAppointmentNotification(
        bookingId, 
        booking.client_name, 
        formattedDate,
        booking.booking_time, 
        "confirmed"
      );
    } else if (messageType === "reminder") {
      // Create a notification for the reminder
      await createAppointmentNotification(
        bookingId, 
        booking.client_name, 
        formattedDate,
        booking.booking_time, 
        "reminder"
      );
    }

    return { success: true, notificationType };
  } catch (error) {
    console.error('Error sending confirmation:', error);
    toast({
      title: "Erreur",
      description: "Impossible d'envoyer la confirmation",
      variant: "destructive",
    });
    return { success: false, error };
  }
};

export const sendAppointmentReminder = async (bookingId: string) => {
  return sendAppointmentConfirmation(bookingId, "reminder", "whatsapp");
};
