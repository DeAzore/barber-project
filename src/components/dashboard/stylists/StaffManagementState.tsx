import React from "react";
import { useStaffManagement } from "./hooks/useStaffManagement";
import { StylistData } from "./StylistsApi";
import { StylistFormData } from "./StaffManagementService";

export interface StaffManagementStateProps {
  children: (props: {
    stylists: StylistData[];
    loading: boolean;
    isDialogOpen: boolean;
    setIsDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
    isEditMode: boolean;
    selectedStylist: StylistData | null;
    formData: StylistFormData;
    setFormData: React.Dispatch<React.SetStateAction<StylistFormData>>;
    handleOpenDialog: () => void;
    handleEditStylist: (stylist: StylistData) => void;
    handleDeleteStylist: (stylistId: string) => void;
    handleSaveStylist: () => Promise<void>;
    handleInputChange: (
      field: keyof StylistFormData,
      value: string | boolean | null
    ) => void;
  }) => React.ReactNode;
}

export const StaffManagementState: React.FC<StaffManagementStateProps> = ({ children }) => {
  const staffManagement = useStaffManagement();
  
  return (
    <>
      {children({
        ...staffManagement
      })}
    </>
  );
};
