import { supabase } from "@/integrations/supabase/client";

export interface StylistData {
  id: string;
  name: string;
  role: string;
  experience: string;
  specialties: string[];
  image_url: string;
  available: boolean;
  user_id?: string | null;
}

export async function fetchStylistsRPC(): Promise<StylistData[]> {
  try {
    const { data, error } = await supabase.functions.invoke('get-stylists');

    if (error) {
      console.error('Error fetching stylists:', error);
      throw new Error(error.message);
    }

    return data || [];
  } catch (error) {
    console.error('Error in fetchStylistsRPC:', error);
    throw error;
  }
}

export async function saveStylistRPC(stylist: Omit<StylistData, 'id'>): Promise<StylistData> {
  try {
    console.log('Saving stylist:', stylist);
    const { data, error } = await supabase.functions.invoke('save-stylist', {
      body: stylist,
    });

    if (error) {
      console.error('Error saving stylist:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in saveStylistRPC:', error);
    throw error;
  }
}

export async function updateStylistRPC(stylist: StylistData): Promise<StylistData> {
  try {
    console.log('Updating stylist:', stylist);
    const { data, error } = await supabase.functions.invoke('update-stylist', {
      body: stylist,
    });

    if (error) {
      console.error('Error updating stylist:', error);
      throw new Error(error.message);
    }

    return data;
  } catch (error) {
    console.error('Error in updateStylistRPC:', error);
    throw error;
  }
}

export async function deleteStylistRPC(stylistId: string): Promise<void> {
  try {
    console.log('Deleting stylist:', stylistId);
    const { error } = await supabase.functions.invoke('delete-stylist', {
      body: { id: stylistId },
    });

    if (error) {
      console.error('Error deleting stylist:', error);
      throw new Error(error.message);
    }
  } catch (error) {
    console.error('Error in deleteStylistRPC:', error);
    throw error;
  }
}
