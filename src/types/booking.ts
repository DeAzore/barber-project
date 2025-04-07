export interface Service {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  icon: string;
}

// Using a different name to avoid conflicts with the StylistData from StylistsApi
export interface Stylist {
  id: string;
  name: string;
  role: string;
  experience: string;
  specialties: string[];
  image_url: string;
  available: boolean;
}

export interface BookingData {
  service_id: string;
  stylist_id: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  booking_date: string;
  booking_time: string;
  notes?: string;
}
