import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Instagram, Facebook } from 'lucide-react';

interface StylistCardProps {
  name: string;
  title: string;
  image: string;
  specialties: string[];
  socialLinks: { instagram?: string; facebook?: string };
}

const StylistCard = ({ name, title, image, specialties, socialLinks }: StylistCardProps) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden card-shadow text-center group">
      <div className="h-64 overflow-hidden relative">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center">
          <div className="p-4 flex gap-3 mb-2">
            {socialLinks.instagram && (
              <a 
                href={socialLinks.instagram} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-salon-gold hover:text-white transition-all"
              >
                <Instagram size={18} />
              </a>
            )}
            {socialLinks.facebook && (
              <a 
                href={socialLinks.facebook} 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/20 backdrop-blur-sm p-2 rounded-full hover:bg-salon-gold hover:text-white transition-all"
              >
                <Facebook size={18} />
              </a>
            )}
          </div>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-serif text-xl font-medium mb-1 text-salon-dark">{name}</h3>
        <p className="text-salon-gold text-sm mb-3">{title}</p>
        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {specialties.map((specialty, index) => (
            <span key={index} className="text-xs px-3 py-1 bg-salon-cream rounded-full text-salon-dark">
              {specialty}
            </span>
          ))}
        </div>
        <Link to="/booking">
          <Button size="sm" variant="outline" className="w-full">
            Réserver avec {name.split(' ')[0]}
          </Button>
        </Link>
      </div>
    </div>
  );
};

const FeaturedStylists = () => {
  const stylists = [
    {
      name: "Amina Ben Ali",
      title: "Directrice Stylistique",
      image: "https://images.unsplash.com/photo-1580618672591-eb180b1a973f?auto=format&fit=crop&q=80&w=2069",
      specialties: ["Coupes Modernes", "Coloration", "Conseils Personnalisés"],
      socialLinks: { instagram: "#", facebook: "#" }
    },
    {
      name: "Youssef Nouri",
      title: "Coiffeur Senior",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=2070",
      specialties: ["Coupes Hommes", "Barbe", "Styling Événementiel"],
      socialLinks: { instagram: "#", facebook: "#" }
    },
    {
      name: "Sofia El Mansouri",
      title: "Experte en Coloration",
      image: "https://images.unsplash.com/photo-1509967419530-da38b4704bc6?auto=format&fit=crop&q=80&w=2195",
      specialties: ["Balayage", "Mèches", "Techniques Innovantes"],
      socialLinks: { instagram: "#" }
    },
  ];

  return (
    <section className="py-16">
      <div className="salon-container">
        <div className="text-center mb-12">
          <h2 className="section-title">
            <span className="heading-accent">Notre Équipe</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Rencontrez nos experts stylistes passionnés et qualifiés, prêts à vous offrir une expérience exceptionnelle.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {stylists.map((stylist, index) => (
            <StylistCard
              key={index}
              name={stylist.name}
              title={stylist.title}
              image={stylist.image}
              specialties={stylist.specialties}
              socialLinks={stylist.socialLinks}
            />
          ))}
        </div>
        
        <div className="mt-12 text-center">
          <Link to="/stylists">
            <Button>Découvrir Toute l'Équipe</Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedStylists;
