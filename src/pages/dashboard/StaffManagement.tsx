import React from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StylistsTable from "@/components/dashboard/stylists/StylistsTable";
import StylistDialog from "@/components/dashboard/stylists/StylistDialog";
import { StaffManagementProvider } from "@/components/dashboard/stylists/contexts/StaffManagementContext";
import { useStaffManagementContext } from "@/components/dashboard/stylists/contexts/StaffManagementContext";
import StaffHeader from "@/components/dashboard/stylists/StaffHeader";

// A component that consumes the context
const StaffManagementContent = () => {
  const {
    stylists,
    loading,
    isDialogOpen,
    setIsDialogOpen,
    isEditMode,
    formData,
    handleOpenDialog,
    handleEditStylist,
    handleDeleteStylist,
    handleSaveStylist,
    handleInputChange,
  } = useStaffManagementContext();

  return (
    <div>
      <StaffHeader onAddClick={handleOpenDialog} />

      <Card className="bg-cabbelero-gray border-cabbelero-gold/20">
        <CardHeader>
          <CardTitle>Liste des barbiers</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-cabbelero-light/70">Chargement...</p>
          ) : (
            <StylistsTable
              stylists={stylists}
              handleEditStylist={handleEditStylist}
              handleDeleteStylist={handleDeleteStylist}
            />
          )}
        </CardContent>
      </Card>

      <StylistDialog
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        isEditMode={isEditMode}
        formData={formData}
        handleInputChange={handleInputChange}
        handleSaveStylist={handleSaveStylist}
      />
    </div>
  );
};

// Main component that wraps everything with the provider
const StaffManagement = () => {
  return (
    <AdminLayout>
      <StaffManagementProvider>
        <StaffManagementContent />
      </StaffManagementProvider>
    </AdminLayout>
  );
};

export default StaffManagement;
