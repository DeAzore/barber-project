import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StylistFormProps {
  name: string;
  setName: (name: string) => void;
  role: string;
  setRole: (role: string) => void;
  experience: string;
  setExperience: (experience: string) => void;
  specialties: string;
  setSpecialties: (specialties: string) => void;
  image_url: string;
  setImageUrl: (image_url: string) => void;
  available: boolean;
  setAvailable: (available: boolean) => void;
}

const StylistForm: React.FC<StylistFormProps> = ({
  name,
  setName,
  role,
  setRole,
  experience,
  setExperience,
  specialties,
  setSpecialties,
  image_url,
  setImageUrl,
  available,
  setAvailable,
}) => {
  return (
    <div className="grid gap-4 py-4">
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="name" className="text-right">
          Nom
        </Label>
        <Input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="role" className="text-right">
          Rôle
        </Label>
        <div className="col-span-3">
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stylist">Barbier</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="other">Autre</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="experience" className="text-right">
          Expérience
        </Label>
        <Input
          type="text"
          id="experience"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="specialties" className="text-right">
          Spécialités
        </Label>
        <Input
          type="text"
          id="specialties"
          value={specialties}
          onChange={(e) => setSpecialties(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="image_url" className="text-right">
          Image URL
        </Label>
        <Input
          type="text"
          id="image_url"
          value={image_url}
          onChange={(e) => setImageUrl(e.target.value)}
          className="col-span-3"
        />
      </div>
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="available" className="text-right">
          Disponible
        </Label>
        <Checkbox
          id="available"
          checked={available}
          onCheckedChange={(checked) => setAvailable(!!checked)}
          className="col-span-3"
        />
      </div>
    </div>
  );
};

export default StylistForm;
