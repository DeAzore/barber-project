import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { checkTimeSlotAvailability } from "@/services/bookingService";
import { Skeleton } from "@/components/ui/skeleton";

interface TimeSelectorProps {
  selectedTime: string | null;
  setSelectedTime: (time: string) => void;
  selectedDate: Date | undefined;
  selectedStylist: string | null;
}

const TimeSelector = ({ 
  selectedTime, 
  setSelectedTime, 
  selectedDate,
  selectedStylist 
}: TimeSelectorProps) => {
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    const getAvailableSlots = async () => {
      if (!selectedDate || !selectedStylist) {
        setAvailableSlots([]);
        return;
      }
      
      setLoading(true);
      const slots = await checkTimeSlotAvailability(selectedDate, selectedStylist);
      setAvailableSlots(slots);
      setLoading(false);
    };
    
    getAvailableSlots();
  }, [selectedDate, selectedStylist]);
  
  // No date selected message
  if (!selectedDate) {
    return (
      <div className="text-center py-8 text-gray-400">
        Veuillez sélectionner une date pour voir les créneaux horaires disponibles.
      </div>
    );
  }

  // No stylist selected message
  if (!selectedStylist) {
    return (
      <div className="text-center py-8 text-gray-400">
        Veuillez sélectionner un coiffeur pour voir les créneaux horaires disponibles.
      </div>
    );
  }
  
  if (loading) {
    return (
      <div className="mt-6">
        <Skeleton className="h-6 w-3/4 mb-4 bg-cabbelero-black/50" />
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
            <Skeleton key={i} className="h-10 bg-cabbelero-black/50" />
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="mt-6">
      <h3 className="font-medium mb-4 text-cabbelero-gold">
        Créneaux disponibles pour {selectedDate ? format(selectedDate, 'EEEE d MMMM yyyy', { locale: fr }) : ''}
      </h3>
      
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
        {availableSlots.map((time) => (
          <Button
            key={time}
            type="button"
            variant={selectedTime === time ? "default" : "outline"}
            className={`${
              selectedTime === time 
                ? 'bg-cabbelero-gold hover:bg-cabbelero-gold/90 text-cabbelero-black' 
                : 'border-cabbelero-gold/30 text-cabbelero-gold hover:bg-cabbelero-black/60'
            }`}
            onClick={() => setSelectedTime(time)}
          >
            {time}
          </Button>
        ))}
      </div>
      
      {availableSlots.length === 0 && !loading && (
        <div className="text-center py-4 text-gray-400">
          Aucun créneau disponible pour cette date. Veuillez sélectionner une autre date.
        </div>
      )}
    </div>
  );
};

export default TimeSelector;
