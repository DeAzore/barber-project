import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { StylistFormData } from "./StaffManagementService";
import StylistForm from "./StylistForm";

interface StylistDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isEditMode: boolean;
  formData: StylistFormData;
  handleInputChange: (field: keyof StylistFormData, value: string | boolean | null) => void;
  handleSaveStylist: () => Promise<void>;
}

const StylistDialog: React.FC<StylistDialogProps> = ({
  isOpen,
  setIsOpen,
  isEditMode,
  formData,
  handleInputChange,
  handleSaveStylist,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="bg-cabbelero-gray border-cabbelero-gold/20 text-cabbelero-light">
        <DialogHeader>
          <DialogTitle>{isEditMode ? "Modifier" : "Ajouter"} un barbier</DialogTitle>
          <DialogDescription>
            Remplissez le formulaire ci-dessous pour {isEditMode ? "modifier" : "ajouter"} un barbier.
          </DialogDescription>
        </DialogHeader>
        <StylistForm
          name={formData.name}
          setName={(value) => handleInputChange("name", value)}
          role={formData.role}
          setRole={(value) => handleInputChange("role", value)}
          experience={formData.experience}
          setExperience={(value) => handleInputChange("experience", value)}
          specialties={formData.specialties}
          setSpecialties={(value) => handleInputChange("specialties", value)}
          image_url={formData.image_url}
          setImageUrl={(value) => handleInputChange("image_url", value)}
          available={formData.available}
          setAvailable={(value) => handleInputChange("available", value)}
        />
        <div className="flex justify-end">
          <DialogClose asChild>
            <Button variant="secondary" className="mr-2">Annuler</Button>
          </DialogClose>
          <Button onClick={handleSaveStylist}>{isEditMode ? "Mettre à jour" : "Enregistrer"}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StylistDialog;
