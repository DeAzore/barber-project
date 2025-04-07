import { supabase } from "@/integrations/supabase/client";
import { BookingData, Service, Stylist } from "@/types/booking";
import { toast } from "@/hooks/use-toast";
import { createAppointmentNotification } from "./notificationsSystemService";

export const fetchServices = async (): Promise<Service[]> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('price', { ascending: true });
  
  if (error) {
    console.error('Error fetching services:', error);
    toast({
      title: "Erreur",
      description: "Impossible de charger les services",
      variant: "destructive",
    });
    return [];
  }
  
  return data || [];
};

export const fetchStylists = async (): Promise<Stylist[]> => {
  const { data, error } = await supabase
    .from('stylists')
    .select('*')
    .eq('available', true);
  
  if (error) {
    console.error('Error fetching stylists:', error);
    toast({
      title: "Erreur",
      description: "Impossible de charger les coiffeurs",
      variant: "destructive",
    });
    return [];
  }
  
  return data || [];
};

export const checkTimeSlotAvailability = async (
  date: Date,
  stylistId: string
): Promise<string[]> => {
  // First check if there are any existing bookings for this stylist on this date
  const dateStr = date.toISOString().split('T')[0];
  
  const { data: existingBookings, error } = await supabase
    .from('bookings')
    .select('booking_time')
    .eq('stylist_id', stylistId)
    .eq('booking_date', dateStr);
  
  if (error) {
    console.error('Error checking bookings:', error);
    return []; 
  }
  
  // Get all possible time slots
  const allTimeSlots = generateTimeSlots();
  
  // Filter out the already booked time slots
  const bookedTimes = existingBookings ? existingBookings.map(booking => booking.booking_time) : [];
  
  // Return available slots (all slots minus booked ones)
  return allTimeSlots.filter(time => !bookedTimes.includes(time));
};

export const createBooking = async (bookingData: BookingData): Promise<{ success: boolean; error?: string; bookingId?: string }> => {
  try {
    // Check if RLS is causing issues, use functions.invoke for insert operation
    const response = await supabase.functions.invoke('create-booking', {
      body: bookingData
    });

    if (response.error) {
      throw new Error(response.error.message || 'Error creating booking');
    }

    // Create notification for new booking
    if (response.data && response.data.id) {
      const service = await getServiceById(bookingData.service_id);
      const stylist = await getStylistById(bookingData.stylist_id);
      
      await createAppointmentNotification(
        response.data.id,
        bookingData.client_name,
        bookingData.booking_date,
        bookingData.booking_time,
        'pending'
      );
    }

    return { 
      success: true, 
      bookingId: response.data && response.data.id ? response.data.id : undefined 
    };
  } catch (error) {
    console.error('Error creating booking:', error);
    return { 
      success: false, 
      error: "Une erreur est survenue lors de la création du rendez-vous. Veuillez réessayer." 
    };
  }
};

// Helper function to get service by ID
export const getServiceById = async (serviceId: string): Promise<Service | null> => {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', serviceId)
    .single();
  
  if (error) {
    console.error('Error fetching service:', error);
    return null;
  }
  
  return data;
};

// Helper function to get stylist by ID
export const getStylistById = async (stylistId: string): Promise<Stylist | null> => {
  const { data, error } = await supabase
    .from('stylists')
    .select('*')
    .eq('id', stylistId)
    .single();
  
  if (error) {
    console.error('Error fetching stylist:', error);
    return null;
  }
  
  return data;
};

// Helper function to generate time slots
export const generateTimeSlots = (): string[] => {
  const timeSlots = [];
  const startHour = 9; // 9 AM
  const endHour = 19; // 7 PM
  const interval = 30; // 30 minutes

  for (let hour = startHour; hour < endHour; hour++) {
    for (let minute = 0; minute < 60; minute += interval) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      timeSlots.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  
  return timeSlots;
};

// Helper function to format service and stylist names for display
export const formatServiceName = async (serviceId: string): Promise<string> => {
  const service = await getServiceById(serviceId);
  return service ? service.title : "Service inconnu";
};

export const formatStylistName = async (stylistId: string): Promise<string> => {
  const stylist = await getStylistById(stylistId);
  return stylist ? stylist.name : "Barbier inconnu";
};
