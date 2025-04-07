import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Clock, Scissors, User } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import BookingSteps from '@/components/booking/BookingSteps';
import ServiceSelector from '@/components/booking/ServiceSelector';
import StylistSelector from '@/components/booking/StylistSelector';
import TimeSelector from '@/components/booking/TimeSelector';
import { createBooking, fetchServices, fetchStylists } from '@/services/bookingService';
import { useNavigate } from 'react-router-dom';
import { Service, Stylist } from '@/types/booking';

const Booking = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [selectedStylist, setSelectedStylist] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [services, setServices] = useState<Service[]>([]);
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch services and stylists data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [servicesData, stylistsData] = await Promise.all([
        fetchServices(),
        fetchStylists()
      ]);
      
      setServices(servicesData);
      setStylists(stylistsData);
      setLoading(false);
    };
    
    fetchData();
  }, []);

  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedServices.length === 0 || !selectedStylist || !selectedDate || !selectedTime) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create bookings for each service
      const bookingPromises = selectedServices.map(serviceId => {
        const bookingData = {
          service_id: serviceId,
          stylist_id: selectedStylist,
          client_name: formData.name,
          client_email: formData.email,
          client_phone: formData.phone,
          booking_date: selectedDate.toISOString().split('T')[0],
          booking_time: selectedTime,
          notes: formData.notes
        };
        
        return createBooking(bookingData);
      });
      
      const results = await Promise.all(bookingPromises);
      const allSuccessful = results.every(result => result.success);
      
      if (allSuccessful) {
        toast({
          title: "Réservation confirmée",
          description: "Votre rendez-vous a été enregistré avec succès.",
        });
        
        // Reset form and redirect to home page
        setTimeout(() => {
          navigate('/');
        }, 2000);
      } else {
        toast({
          title: "Erreur partielle",
          description: "Certains services n'ont pas pu être réservés. Veuillez réessayer.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la création de votre rendez-vous. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper function to get service title by ID
  const getServiceTitle = (serviceId: string): string => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.title : serviceId;
  };

  // Helper function to get stylist name by ID
  const getStylistName = (stylistId: string): string => {
    const stylist = stylists.find(s => s.id === stylistId);
    return stylist ? stylist.name : stylistId;
  };

  const getStepContent = () => {
    switch (step) {
      case 1:
        return <ServiceSelector selectedServices={selectedServices} setSelectedServices={setSelectedServices} />;
      case 2:
        return <StylistSelector selectedStylist={selectedStylist} setSelectedStylist={setSelectedStylist} />;
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <Label htmlFor="date" className="text-cabbelero-gold">Sélectionnez une date</Label>
              <div className="mt-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal border-cabbelero-gold/30 text-cabbelero-light"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        format(selectedDate, 'PPP', { locale: fr })
                      ) : (
                        <span>Choisir une date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 bg-cabbelero-gray border-cabbelero-gold/30" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      initialFocus
                      locale={fr}
                      className="bg-cabbelero-gray text-cabbelero-light"
                      classNames={{
                        day_selected: "bg-cabbelero-gold text-cabbelero-black hover:bg-cabbelero-gold/90",
                        day_today: "bg-cabbelero-black text-cabbelero-gold",
                        day: "text-cabbelero-light hover:bg-cabbelero-gray hover:text-cabbelero-gold",
                        head_cell: "text-cabbelero-gold font-medium",
                        caption: "text-cabbelero-gold"
                      }}
                      disabled={(date) => {
                        // Disable past dates and Sundays
                        return date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                              date.getDay() === 0;
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
            
            <TimeSelector 
              selectedTime={selectedTime} 
              setSelectedTime={setSelectedTime}
              selectedDate={selectedDate}
              selectedStylist={selectedStylist}
            />
          </div>
        );
      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-cabbelero-gold">Nom complet</Label>
              <Input 
                id="name" 
                name="name" 
                value={formData.name} 
                onChange={handleFormChange} 
                className="mt-1 bg-cabbelero-gray border-cabbelero-gold/30 text-cabbelero-light" 
                placeholder="Entrez votre nom"
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="email" className="text-cabbelero-gold">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                value={formData.email} 
                onChange={handleFormChange} 
                className="mt-1 bg-cabbelero-gray border-cabbelero-gold/30 text-cabbelero-light" 
                placeholder="votre@email.com"
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="phone" className="text-cabbelero-gold">Téléphone</Label>
              <Input 
                id="phone" 
                name="phone" 
                value={formData.phone} 
                onChange={handleFormChange} 
                className="mt-1 bg-cabbelero-gray border-cabbelero-gold/30 text-cabbelero-light" 
                placeholder="06XXXXXXXX"
                required 
              />
            </div>
            
            <div>
              <Label htmlFor="notes" className="text-cabbelero-gold">Notes (optionnel)</Label>
              <textarea 
                id="notes" 
                name="notes" 
                value={formData.notes} 
                onChange={handleFormChange} 
                className="mt-1 w-full rounded-md border border-cabbelero-gold/30 bg-cabbelero-gray px-3 py-2 text-base text-cabbelero-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cabbelero-gold focus-visible:ring-offset-2 focus-visible:ring-offset-cabbelero-black disabled:cursor-not-allowed disabled:opacity-50 md:text-sm" 
                placeholder="Des informations supplémentaires pour votre coiffeur"
                rows={3}
              />
            </div>
            
            <div className="p-4 bg-cabbelero-gray border border-cabbelero-gold/30 rounded-lg">
              <h3 className="font-medium text-lg mb-2 text-cabbelero-gold">Récapitulatif de la réservation</h3>
              <div className="space-y-2">
                <p className="flex items-center">
                  <Scissors className="mr-2 h-4 w-4 text-cabbelero-gold" /> 
                  Services: {selectedServices.length > 0 
                    ? selectedServices.map(id => getServiceTitle(id)).join(', ') 
                    : 'Non sélectionné'}
                </p>
                <p className="flex items-center">
                  <User className="mr-2 h-4 w-4 text-cabbelero-gold" /> 
                  Barbier: {selectedStylist 
                    ? getStylistName(selectedStylist) 
                    : 'Non sélectionné'}
                </p>
                <p className="flex items-center">
                  <CalendarIcon className="mr-2 h-4 w-4 text-cabbelero-gold" /> 
                  Date: {selectedDate ? format(selectedDate, 'PPP', { locale: fr }) : 'Non sélectionnée'}
                </p>
                <p className="flex items-center">
                  <Clock className="mr-2 h-4 w-4 text-cabbelero-gold" /> 
                  Heure: {selectedTime || 'Non sélectionnée'}
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <Layout>
      <div 
        className="py-16 mt-16 min-h-screen bg-cabbelero-black"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.7)), url('/lovable-uploads/4f14715f-b03d-4d28-8dfa-c7d35acce36e.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="salon-container max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h1 className="section-title">
              <span className="heading-accent">Réserver chez Cabbelero</span>
            </h1>
            <p className="text-gray-300 max-w-2xl mx-auto mt-4">
              Réservez facilement votre prochain rendez-vous en quelques étapes simples. Sélectionnez un ou plusieurs services, 
              choisissez votre barbier préféré, et trouvez un horaire qui vous convient.
            </p>
          </div>

          <BookingSteps currentStep={step} />
          
          <Card className="mt-8 mb-16 shadow-lg bg-cabbelero-black/80 backdrop-blur-md border border-cabbelero-gold/20">
            <CardHeader>
              <CardTitle className="text-cabbelero-gold">
                {step === 1 && "Choisissez vos Services"}
                {step === 2 && "Sélectionnez un Barbier"}
                {step === 3 && "Sélectionnez Date & Heure"}
                {step === 4 && "Vos Informations"}
              </CardTitle>
              <CardDescription className="text-gray-400">
                {step === 1 && "Sélectionnez un ou plusieurs services que vous souhaitez réserver."}
                {step === 2 && "Choisissez le barbier avec lequel vous préférez prendre rendez-vous."}
                {step === 3 && "Sélectionnez une date et un créneau horaire disponible."}
                {step === 4 && "Remplissez vos coordonnées pour confirmer votre rendez-vous."}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit}>
                {getStepContent()}
              </form>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button 
                type="button" 
                variant="outline" 
                onClick={handlePrevStep}
                disabled={step === 1}
                className="border-cabbelero-gold/30 text-cabbelero-gold hover:bg-cabbelero-gold/10"
              >
                Précédent
              </Button>
              
              {step < 4 ? (
                <Button 
                  type="button" 
                  onClick={handleNextStep}
                  disabled={(step === 1 && selectedServices.length === 0) || 
                          (step === 2 && !selectedStylist) || 
                          (step === 3 && (!selectedDate || !selectedTime))}
                  className="bg-cabbelero-gold hover:bg-cabbelero-gold/90 text-cabbelero-black"
                >
                  Suivant
                </Button>
              ) : (
                <Button 
                  type="submit"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.name || !formData.email || !formData.phone}
                  className="bg-cabbelero-gold hover:bg-cabbelero-gold/90 text-cabbelero-black"
                >
                  {isSubmitting ? "En cours..." : "Confirmer la Réservation"}
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Booking;
