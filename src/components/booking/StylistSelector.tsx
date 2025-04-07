import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchStylists } from "@/services/bookingService";
import { Stylist } from "@/types/booking";
import { Skeleton } from "@/components/ui/skeleton";

interface StylistSelectorProps {
  selectedStylist: string | null;
  setSelectedStylist: (stylistId: string) => void;
}

const StylistCard = ({ 
  id, 
  name, 
  role, 
  experience, 
  specialties, 
  image_url, 
  isSelected,
  onClick 
}: {
  id: string;
  name: string;
  role: string;
  experience: string;
  specialties: string[];
  image_url: string;
  isSelected: boolean;
  onClick: () => void;
}) => (
  <Card 
    className={`cursor-pointer transition-all duration-300 cabbelero-card ${
      isSelected 
        ? 'ring-2 ring-cabbelero-gold scale-105 shadow-lg' 
        : 'hover:shadow-md'
    }`}
    onClick={onClick}
  >
    <CardContent className="p-6 flex gap-4">
      <div className="w-20 h-20 overflow-hidden rounded-full border-2 border-cabbelero-gold">
        <img 
          src={image_url || `/lovable-uploads/cf6174a0-d66b-4992-8d7a-de752c70aa2d.png`} 
          alt={name} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-serif text-lg font-medium mb-1 text-cabbelero-light">{name}</h3>
        <p className="text-sm text-gray-400 mb-1">{role} • {experience}</p>
        <div className="flex flex-wrap gap-1 mt-2">
          {specialties.map((specialty, index) => (
            <Badge key={index} variant="outline" className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-gold text-xs">
              {specialty}
            </Badge>
          ))}
        </div>
      </div>
    </CardContent>
  </Card>
);

const StylistSelector = ({ selectedStylist, setSelectedStylist }: StylistSelectorProps) => {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getStylists = async () => {
      setLoading(true);
      const stylistsData = await fetchStylists();
      setStylists(stylistsData);
      setLoading(false);
    };

    getStylists();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 bg-cabbelero-gray border-cabbelero-gold/20">
            <div className="flex gap-4">
              <Skeleton className="h-20 w-20 rounded-full bg-cabbelero-black/50" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-1/2 bg-cabbelero-black/50" />
                <Skeleton className="h-4 w-3/4 bg-cabbelero-black/50" />
                <div className="flex flex-wrap gap-1 mt-2">
                  <Skeleton className="h-5 w-16 bg-cabbelero-black/50" />
                  <Skeleton className="h-5 w-20 bg-cabbelero-black/50" />
                  <Skeleton className="h-5 w-24 bg-cabbelero-black/50" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div>
      <p className="mb-6 text-cabbelero-gold font-medium">Sélectionnez votre barbier préféré:</p>
      <div className="grid grid-cols-1 gap-4">
        {stylists.map((stylist) => (
          <StylistCard
            key={stylist.id}
            id={stylist.id}
            name={stylist.name}
            role={stylist.role}
            experience={stylist.experience}
            specialties={stylist.specialties}
            image_url={stylist.image_url}
            isSelected={selectedStylist === stylist.id}
            onClick={() => setSelectedStylist(stylist.id)}
          />
        ))}
        
        {stylists.length === 0 && !loading && (
          <div className="text-center py-8">
            <p className="text-gray-500">Aucun coiffeur trouvé. Veuillez réessayer plus tard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StylistSelector;
