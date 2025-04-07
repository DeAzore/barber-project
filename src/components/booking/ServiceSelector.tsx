import { useEffect, useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Paintbrush, Scissors, Sparkles, Palette, Check } from "lucide-react";
import { fetchServices } from "@/services/bookingService";
import { Service } from "@/types/booking";
import { Skeleton } from "@/components/ui/skeleton";

interface ServiceSelectorProps {
  selectedServices: string[];
  setSelectedServices: (serviceIds: string[]) => void;
}

const ServiceCard = ({ 
  id, 
  title, 
  description, 
  price, 
  duration, 
  icon, 
  isSelected,
  onClick 
}: {
  id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  icon: React.ReactNode;
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
      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
        isSelected ? 'bg-cabbelero-gold text-cabbelero-black' : 'bg-cabbelero-black/50 text-cabbelero-gold'
      }`}>
        {isSelected ? <Check className="w-6 h-6" /> : icon}
      </div>
      <div className="flex-1">
        <h3 className="font-serif text-lg font-medium mb-1 text-cabbelero-light">{title}</h3>
        <p className="text-sm text-gray-400 mb-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="font-bold text-cabbelero-gold">{price} MAD</span>
          <span className="text-xs text-gray-500">{duration} min</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const ServiceSelector = ({ selectedServices, setSelectedServices }: ServiceSelectorProps) => {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getServices = async () => {
      setLoading(true);
      const servicesData = await fetchServices();
      setServices(servicesData);
      setLoading(false);
    };

    getServices();
  }, []);

  const toggleService = (serviceId: string) => {
    if (selectedServices.includes(serviceId)) {
      setSelectedServices(selectedServices.filter(id => id !== serviceId));
    } else {
      setSelectedServices([...selectedServices, serviceId]);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'scissors':
        return <Scissors className="w-6 h-6" />;
      case 'palette':
        return <Palette className="w-6 h-6" />;
      case 'sparkles':
        return <Sparkles className="w-6 h-6" />;
      case 'paintbrush':
        return <Paintbrush className="w-6 h-6" />;
      default:
        return <Scissors className="w-6 h-6" />;
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i} className="p-6 bg-cabbelero-gray border-cabbelero-gold/20">
            <div className="flex gap-4">
              <Skeleton className="h-12 w-12 rounded-full bg-cabbelero-black/50" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-5 w-3/4 bg-cabbelero-black/50" />
                <Skeleton className="h-4 w-full bg-cabbelero-black/50" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20 bg-cabbelero-black/50" />
                  <Skeleton className="h-4 w-16 bg-cabbelero-black/50" />
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
      <p className="mb-6 text-cabbelero-gold font-medium">Sélectionnez un ou plusieurs services:</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            id={service.id}
            title={service.title}
            description={service.description}
            price={service.price}
            duration={service.duration}
            icon={getIconComponent(service.icon)}
            isSelected={selectedServices.includes(service.id)}
            onClick={() => toggleService(service.id)}
          />
        ))}
        
        {services.length === 0 && !loading && (
          <div className="col-span-2 text-center py-8">
            <p className="text-gray-500">Aucun service trouvé. Veuillez réessayer plus tard.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ServiceSelector;
