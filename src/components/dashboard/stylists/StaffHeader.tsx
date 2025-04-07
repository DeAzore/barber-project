import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';

interface StaffHeaderProps {
  onAddClick: () => void;
}

const StaffHeader: React.FC<StaffHeaderProps> = ({ onAddClick }) => {
  return (
    <div className="flex items-center justify-between">
      <h1 className="text-2xl font-bold text-cabbelero-gold mb-6">
        Gestion du personnel
      </h1>
      <Button onClick={onAddClick}>
        <Plus className="mr-2 h-4 w-4" />
        Ajouter un barbier
      </Button>
    </div>
  );
};

export default StaffHeader;
