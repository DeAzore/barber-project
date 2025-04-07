import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { fetchStylists } from "@/services/bookingService";
import { Stylist } from "@/types/booking";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { Skeleton } from "@/components/ui/skeleton";
import { CalendarDays } from "lucide-react";

const Stylists = () => {
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
            <span className="heading-accent">Nos Barbiers</span>
          </h1>
          <p className="text-center text-gray-300 max-w-2xl mx-auto mt-4 mb-12">
            Rencontrez notre équipe de barbiers talentueux et expérimentés, prêts à vous offrir une 
            expérience de coiffure exceptionnelle et personnalisée.
          </p>
          
          {/* Stylists Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="bg-cabbelero-black/60 backdrop-blur-sm border border-cabbelero-gold/20">
                  <CardContent className="p-6 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-40 h-40">
                      <Skeleton className="w-40 h-40 rounded-full bg-cabbelero-black/50" />
                    </div>
                    <div className="flex-1 space-y-4 text-center md:text-left">
                      <Skeleton className="h-8 w-48 bg-cabbelero-black/50" />
                      <Skeleton className="h-5 w-full bg-cabbelero-black/50" />
                      <Skeleton className="h-5 w-3/4 bg-cabbelero-black/50" />
                      <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                        <Skeleton className="h-6 w-20 bg-cabbelero-black/50" />
                        <Skeleton className="h-6 w-24 bg-cabbelero-black/50" />
                        <Skeleton className="h-6 w-16 bg-cabbelero-black/50" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {stylists.map((stylist) => (
                <Card key={stylist.id} className="bg-cabbelero-black/60 backdrop-blur-sm border border-cabbelero-gold/20">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-40 h-40 overflow-hidden rounded-full border-4 border-cabbelero-gold">
                        <img 
                          src={stylist.image_url || "/lovable-uploads/cf6174a0-d66b-4992-8d7a-de752c70aa2d.png"}
                          alt={stylist.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 space-y-4 text-center md:text-left">
                        <h3 className="text-2xl font-serif font-bold text-cabbelero-gold">{stylist.name}</h3>
                        <div className="flex items-center justify-center md:justify-start space-x-2 text-gray-400">
                          <span className="font-medium text-cabbelero-light">{stylist.role}</span>
                          <span>•</span>
                          <span>{stylist.experience}</span>
                        </div>
                        <p className="text-gray-300">
                          Un barbier passionné par son métier, offrant des services de qualité supérieure 
                          et une expérience personnalisée.
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                          {stylist.specialties.map((specialty, index) => (
                            <Badge key={index} variant="outline" className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-gold">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                        
                        <div className="pt-4">
                          <Link to="/booking">
                            <Button className="bg-cabbelero-gold hover:bg-cabbelero-gold/90 text-cabbelero-black">
                              <CalendarDays className="mr-2 h-4 w-4" />
                              Prendre rendez-vous
                            </Button>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {stylists.length === 0 && !loading && (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-400 text-lg">Aucun barbier trouvé. Veuillez réessayer plus tard.</p>
                </div>
              )}
            </div>
          )}
          
          {/* Team Recruitment */}
          <div className="mt-16 p-8 bg-cabbelero-black/60 backdrop-blur-sm border border-cabbelero-gold/20 rounded-lg text-center">
            <h3 className="text-2xl font-serif font-bold mb-4 text-cabbelero-gold">Rejoindre Notre Équipe</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Vous êtes un barbier talentueux et passionné ? Nous sommes toujours à la recherche de personnes 
              talentueuses pour rejoindre notre équipe. Contactez-nous pour en savoir plus sur les opportunités 
              disponibles.
            </p>
            <Link to="/contact">
              <Button variant="outline" className="border-cabbelero-gold/40 text-cabbelero-gold hover:bg-cabbelero-gold/10">
                Contactez-nous
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Stylists;
