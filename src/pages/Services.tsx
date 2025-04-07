import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { fetchServices } from "@/services/bookingService";
import { Service } from "@/types/booking";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Paintbrush, Sparkles, Palette } from "lucide-react";
import { Link } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";

const Services = () => {
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

  const getIconComponent = (iconName: string, size: number = 6) => {
    const className = `w-${size} h-${size}`;
    switch (iconName) {
      case 'scissors':
        return <Scissors className={className} />;
      case 'palette':
        return <Palette className={className} />;
      case 'sparkles':
        return <Sparkles className={className} />;
      case 'paintbrush':
        return <Paintbrush className={className} />;
      default:
        return <Scissors className={className} />;
    }
  };

  return (
    <Layout>
      <div 
        className="py-20 mt-16 bg-cabbelero-black"
        style={{
          backgroundImage: "linear-gradient(rgba(0,0,0,0.9), rgba(0,0,0,0.7)), url('/lovable-uploads/4f14715f-b03d-4d28-8dfa-c7d35acce36e.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="salon-container">
          <h1 className="section-title text-center">
            <span className="heading-accent">Nos Services</span>
          </h1>
          <p className="text-center text-gray-300 max-w-2xl mx-auto mt-4 mb-12">
            Découvrez notre gamme complète de services de coiffure et de soins pour hommes, conçus 
            pour vous offrir une expérience unique et un style impeccable.
          </p>
          
          {/* Services List */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="bg-cabbelero-black/60 backdrop-blur-sm border border-cabbelero-gold/20">
                  <CardContent className="p-6 pt-8">
                    <div className="flex justify-center mb-4">
                      <Skeleton className="h-16 w-16 rounded-full bg-cabbelero-black/50" />
                    </div>
                    <div className="space-y-3 text-center">
                      <Skeleton className="h-6 w-2/3 mx-auto bg-cabbelero-black/50" />
                      <Skeleton className="h-4 w-full bg-cabbelero-black/50" />
                      <Skeleton className="h-4 w-full bg-cabbelero-black/50" />
                      <Skeleton className="h-4 w-3/4 mx-auto bg-cabbelero-black/50" />
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between p-6 pt-0">
                    <Skeleton className="h-5 w-20 bg-cabbelero-black/50" />
                    <Skeleton className="h-10 w-28 bg-cabbelero-black/50" />
                  </CardFooter>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Card key={service.id} className="bg-cabbelero-black/60 backdrop-blur-sm border border-cabbelero-gold/20">
                  <CardContent className="p-6 pt-8">
                    <div className="flex justify-center mb-4">
                      <div className="w-16 h-16 rounded-full bg-cabbelero-gold flex items-center justify-center">
                        {getIconComponent(service.icon, 8)}
                      </div>
                    </div>
                    <h3 className="text-xl font-serif font-bold mb-2 text-center text-cabbelero-gold">{service.title}</h3>
                    <p className="text-gray-300 text-center mb-4">{service.description}</p>
                    <div className="flex justify-center gap-4 text-sm text-gray-400">
                      <span>{service.duration} min</span>
                    </div>
                  </CardContent>
                  <CardFooter className="justify-between p-6 pt-0 border-t border-cabbelero-gold/10 mt-4">
                    <p className="text-cabbelero-gold font-bold text-lg">{service.price} MAD</p>
                    <Link to="/booking">
                      <Button className="bg-cabbelero-gold hover:bg-cabbelero-gold/90 text-cabbelero-black">
                        Réserver
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              ))}

              {services.length === 0 && !loading && (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-400 text-lg">Aucun service trouvé. Veuillez réessayer plus tard.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Additional Information */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="p-8 bg-cabbelero-black/60 backdrop-blur-sm border border-cabbelero-gold/20 rounded-lg">
              <h3 className="text-xl font-serif font-bold mb-4 text-cabbelero-gold">Politique de réservation</h3>
              <ul className="space-y-3 text-gray-300">
                <li>• Les rendez-vous peuvent être pris en ligne ou par téléphone</li>
                <li>• Arrivez 5-10 minutes avant votre rendez-vous</li>
                <li>• Annulation sans frais jusqu'à 24h avant le rendez-vous</li>
                <li>• Les retards de plus de 15 minutes peuvent nécessiter une reprogrammation</li>
              </ul>
            </div>
            
            <div className="p-8 bg-cabbelero-black/60 backdrop-blur-sm border border-cabbelero-gold/20 rounded-lg">
              <h3 className="text-xl font-serif font-bold mb-4 text-cabbelero-gold">Services personnalisés</h3>
              <p className="text-gray-300 mb-4">
                Nous proposons également des services personnalisés pour les occasions spéciales. 
                Contactez-nous pour discuter de vos besoins spécifiques.
              </p>
              <Link to="/contact">
                <Button variant="outline" className="border-cabbelero-gold/40 text-cabbelero-gold hover:bg-cabbelero-gold/10">
                  Nous contacter
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Services;
