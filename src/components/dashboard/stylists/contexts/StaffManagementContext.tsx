import React, { createContext, useContext } from "react";
import { useStaffManagement } from "../hooks/useStaffManagement";
import { StylistData } from "../StylistsApi";
import { StylistFormData } from "../StaffManagementService";

interface StaffManagementContextType {
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
}

const StaffManagementContext = createContext<StaffManagementContextType | undefined>(undefined);

export const StaffManagementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const staffManagement = useStaffManagement();
  
  return (
    <StaffManagementContext.Provider value={staffManagement}>
      {children}
    </StaffManagementContext.Provider>
  );
};

export const useStaffManagementContext = () => {
  const context = useContext(StaffManagementContext);
  if (context === undefined) {
    throw new Error("useStaffManagementContext must be used within a StaffManagementProvider");
  }
  return context;
};
