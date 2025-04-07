import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Phone, Scissors } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative h-screen min-h-[600px] w-full overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ 
          backgroundImage: "url('/lovable-uploads/97613fcf-5d34-4914-acc6-0ea38659ef00.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-cabbelero-black/95 to-cabbelero-black/80"></div>
      </div>
      
      <div className="relative h-full salon-container flex flex-col justify-center">
        <div className="max-w-2xl animate-fade-in">
          <div className="flex justify-start mb-8">
            <img 
              src="/lovable-uploads/cf6174a0-d66b-4992-8d7a-de752c70aa2d.png" 
              alt="Cabbelero Logo" 
              className="h-32 w-32"
            />
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl text-white font-serif mb-6">
            L'Art de la Coiffure chez <span className="text-cabbelero-gold">Cabbelero</span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Une expérience de coiffure premium avec des maîtres barbiers. Nos experts vous accueillent pour révéler votre style naturel.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link to="/booking">
              <Button size="lg" className="bg-cabbelero-gold hover:bg-cabbelero-gold/90 text-cabbelero-black">
                <Calendar className="mr-2 h-5 w-5" />
                Réserver Maintenant
              </Button>
            </Link>
            <a href="tel:+212522123456">
              <Button size="lg" variant="outline" className="text-white border-cabbelero-gold hover:bg-cabbelero-gold/10">
                <Phone className="mr-2 h-5 w-5" />
                Nous Contacter
              </Button>
            </a>
          </div>
          
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-cabbelero-gray/60 backdrop-blur-sm border border-cabbelero-gold/20 rounded-lg p-4 flex items-center">
              <Calendar className="h-8 w-8 text-cabbelero-gold mr-4" />
              <div>
                <h3 className="text-white text-sm font-semibold">Réservation Facile</h3>
                <p className="text-gray-300 text-xs">En ligne ou par téléphone</p>
              </div>
            </div>
            <div className="bg-cabbelero-gray/60 backdrop-blur-sm border border-cabbelero-gold/20 rounded-lg p-4 flex items-center">
              <Clock className="h-8 w-8 text-cabbelero-gold mr-4" />
              <div>
                <h3 className="text-white text-sm font-semibold">Horaires Flexibles</h3>
                <p className="text-gray-300 text-xs">Lun-Sam: 9h - 20h</p>
              </div>
            </div>
            <div className="bg-cabbelero-gray/60 backdrop-blur-sm border border-cabbelero-gold/20 rounded-lg p-4 flex items-center">
              <Scissors className="h-8 w-8 text-cabbelero-gold mr-4" />
              <div>
                <h3 className="text-white text-sm font-semibold">Style Professionnel</h3>
                <p className="text-gray-300 text-xs">Experts barbiers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;
