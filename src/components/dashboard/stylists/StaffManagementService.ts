import { 
  fetchStylistsRPC, 
  saveStylistRPC, 
  updateStylistRPC, 
  deleteStylistRPC,
  StylistData
} from "@/components/dashboard/stylists/StylistsApi";

export interface StylistFormData {
  name: string;
  role: string;
  experience: string;
  specialties: string;
  image_url: string;
  available: boolean;
  user_id: string | null;
}

export const initialFormState: StylistFormData = {
  name: "",
  role: "stylist",
  experience: "",
  specialties: "",
  image_url: "",
  available: true,
  user_id: null,
};

export const loadStylists = async (): Promise<StylistData[]> => {
  try {
    const data = await fetchStylistsRPC();
    return data;
  } catch (error) {
    console.error("Error loading stylists:", error);
    throw error;
  }
};

export const saveStylist = async (
  stylistData: StylistFormData, 
  isEditMode: boolean, 
  selectedStylistId?: string
): Promise<StylistData> => {
  try {
    const specialtiesArray = stylistData.specialties.split(",").map((s) => s.trim());
    
    if (isEditMode && selectedStylistId) {
      const updatedStylist: StylistData = {
        id: selectedStylistId,
        name: stylistData.name,
        role: stylistData.role,
        experience: stylistData.experience,
        specialties: specialtiesArray,
        image_url: stylistData.image_url,
        available: stylistData.available,
        user_id: stylistData.user_id,
      };
      
      return await updateStylistRPC(updatedStylist);
    } else {
      const newStylist = {
        name: stylistData.name,
        role: stylistData.role,
        experience: stylistData.experience,
        specialties: specialtiesArray,
        image_url: stylistData.image_url,
        available: stylistData.available,
        user_id: stylistData.user_id,
      };
      
      return await saveStylistRPC(newStylist);
    }
  } catch (error) {
    console.error("Error saving stylist:", error);
    throw error;
  }
};

export const deleteStylist = async (stylistId: string): Promise<void> => {
  try {
    await deleteStylistRPC(stylistId);
  } catch (error) {
    console.error("Error deleting stylist:", error);
    throw error;
  }
};
