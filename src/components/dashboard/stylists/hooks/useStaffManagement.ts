import { useState, useEffect } from "react";
import { StylistData, StylistFormData } from "../StaffManagementService";
import { useStaffManagementContext } from "../contexts/StaffManagementContext";

export const useStaffManagement = () => {
  const [stylists, setStylists] = useState<StylistData[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedStylist, setSelectedStylist] = useState<StylistData | null>(null);
  const [formData, setFormData] = useState<StylistFormData>({
    name: '',
    role: 'stylist',
    experience: 1,
    specialties: [],
    image_url: '',
    available: true
  });

  // Context integration
  const context = useStaffManagementContext();

  useEffect(() => {
    const fetchStylists = async () => {
      try {
        const { data, error } = await supabase
          .from('stylists')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setStylists(data || []);
      } catch (error) {
        console.error('Error loading stylists:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStylists();
  }, []);

  const handleSaveStylist = async () => {
    try {
      const { data, error } = await supabase.functions.invoke(
        isEditMode ? 'update-stylist' : 'save-stylist',
        {
          body: {
            ...formData,
            id: selectedStylist?.id
          }
        }
      );

      if (error) throw error;
      
      setStylists(prev => 
        isEditMode 
          ? prev.map(s => s.id === data.id ? data : s) 
          : [data, ...prev]
      );
      
      setIsDialogOpen(false);
    } catch (error) {
      console.error('Error saving stylist:', error);
    }
  };

  return {
    stylists,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    selectedStylist,
    formData,
    setFormData,
    handleOpenDialog: () => {
      setFormData({
        name: '',
        role: 'stylist',
        experience: 1,
        specialties: [],
        image_url: '',
        available: true
      });
      setIsEditMode(false);
      setIsDialogOpen(true);
    },
    handleEditStylist: (stylist: StylistData) => {
      setFormData(stylist);
      setIsEditMode(true);
      setIsDialogOpen(true);
    },
    handleDeleteStylist: async (stylistId: string) => {
      try {
        await supabase.functions.invoke('delete-stylist', {
          body: { id: stylistId }
        });
        setStylists(prev => prev.filter(s => s.id !== stylistId));
      } catch (error) {
        console.error('Error deleting stylist:', error);
      }
    },
    handleSaveStylist
  };
};
