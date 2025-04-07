import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

interface ServiceCardProps {
  title: string;
  description: string;
  price: string;
  image: string;
  duration: string;
}

const ServiceCard = ({ title, description, price, image, duration }: ServiceCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden card-shadow group">
      <div className="h-48 overflow-hidden relative">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-3 right-3 bg-salon-gold text-white px-3 py-1 rounded-full text-sm">
          {duration}
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl font-medium mb-2 text-salon-dark">{title}</h3>
        <p className="text-gray-600 mb-4 text-sm line-clamp-2">{description}</p>
        <div className="flex justify-between items-center">
          <span className="text-salon-gold text-lg font-medium">{price}</span>
          <Link to="/booking">
            <Button size="sm">Réserver</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

const FeaturedServices = () => {
  const services = [
    {
      title: "Coupe Tendance",
      description: "Nouvelle coupe adaptée à votre visage et votre style par nos experts stylistes.",
      price: "250 MAD",
      image: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&q=80&w=2070",
      duration: "45 min"
    },
    {
      title: "Coloration Professionnelle",
      description: "Transformez votre look avec nos colorations personnalisées et produits de qualité.",
      price: "350 MAD",
      image: "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&q=80&w=2071",
      duration: "90 min"
    },
    {
      title: "Soin Revitalisant",
      description: "Traitement complet pour cheveux abîmés, leur redonnant brillance et vitalité.",
      price: "300 MAD",
      image: "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&q=80&w=2068",
      duration: "60 min"
    },
    {
      title: "Coiffure Événementiel",
      description: "Des styles élaborés pour vos occasions spéciales, adaptés à votre tenue et personnalité.",
      price: "400 MAD",
      image: "https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&q=80&w=2574",
      duration: "120 min"
    },
  ];

  return (
    <section className="py-16 bg-salon-cream">
      <div className="salon-container">
        <div className="text-center mb-12">
          <h2 className="section-title">
            <span className="heading-accent">Nos Services</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez notre sélection de services professionnels pour transformer votre style et prendre soin de votre beauté.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              title={service.title}
              description={service.description}
              price={service.price}
              image={service.image}
              duration={service.duration}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/services">
            <Button variant="outline" className="group">
              Voir Tous Nos Services
              <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedServices;
