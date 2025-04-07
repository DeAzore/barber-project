import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-salon-dark text-white pt-16 pb-8">
      <div className="salon-container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <h3 className="font-serif text-2xl mb-6">Salon<span className="text-salon-gold">Maroc</span></h3>
            <p className="mb-6 text-gray-300">
              Votre destination pour des services de coiffure et de beauté exceptionnels au Maroc. Nous offrons une expérience luxueuse et professionnelle.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-salon-gold transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-white hover:text-salon-gold transition-colors">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-white hover:text-salon-gold transition-colors">
                <Twitter size={20} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-6 text-salon-gold">Navigation Rapide</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-300 hover:text-white transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/stylists" className="text-gray-300 hover:text-white transition-colors">
                  Nos Coiffeurs
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-300 hover:text-white transition-colors">
                  Réservation
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  À Propos
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-6 text-salon-gold">Services</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Coupes de Cheveux
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Coloration
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Soins du Visage
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Manucure & Pédicure
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-gray-300 hover:text-white transition-colors">
                  Maquillage Événementiel
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-serif text-lg mb-6 text-salon-gold">Contact</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="mr-3 h-5 w-5 text-salon-gold" />
                <span className="text-gray-300">123 Avenue Hassan II, Casablanca, Maroc</span>
              </li>
              <li className="flex items-center">
                <Phone className="mr-3 h-5 w-5 text-salon-gold" />
                <a href="tel:+212522123456" className="text-gray-300 hover:text-white transition-colors">
                  +212 522 123 456
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="mr-3 h-5 w-5 text-salon-gold" />
                <a href="mailto:contact@salonmaroc.ma" className="text-gray-300 hover:text-white transition-colors">
                  contact@salonmaroc.ma
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            &copy; {currentYear} SalonMaroc. Tous droits réservés.
          </p>
          <div className="mt-4 md:mt-0 flex space-x-6 text-sm">
            <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
              Politique de Confidentialité
            </Link>
            <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
              Conditions d'Utilisation
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
