import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu, X, Scissors, User } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, isAdmin, isStaff } = useAuth();

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const navLinks = [
    { name: 'Accueil', path: '/' },
    { name: 'Services', path: '/services' },
    { name: 'Nos Barbiers', path: '/stylists' },
    { name: 'Réservation', path: '/booking' },
    { name: 'À Propos', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-cabbelero-black border-b border-cabbelero-gold/20 py-2' : 'bg-transparent py-4'
      }`}
    >
      <div className="salon-container flex items-center justify-between">
        <div className="flex items-center">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/cf6174a0-d66b-4992-8d7a-de752c70aa2d.png" 
              alt="Cabbelero Logo" 
              className="h-12 w-12 mr-3" 
            />
            <span className="text-cabbelero-light font-serif text-2xl font-bold">Cabb<span className="text-cabbelero-gold">elero</span></span>
          </Link>
        </div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-3 lg:space-x-6">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className="text-cabbelero-light hover:text-cabbelero-gold transition-colors duration-200 whitespace-nowrap px-2"
            >
              {link.name}
            </Link>
          ))}
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/booking">
            <Button className="bg-cabbelero-gold hover:bg-cabbelero-gold/90 text-cabbelero-black whitespace-nowrap">
              <Scissors className="mr-2 h-4 w-4" />
              Réserver
            </Button>
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-3">
              {isStaff && (
                <Link to="/dashboard">
                  <Button variant="outline" className="border-cabbelero-gold/40 text-cabbelero-gold hover:bg-cabbelero-gold/10 whitespace-nowrap">
                    Dashboard
                  </Button>
                </Link>
              )}
              <Link to="/profile">
                <Button variant="ghost" className="text-cabbelero-light hover:text-cabbelero-gold">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          ) : (
            <Link to="/login">
              <Button variant="outline" className="border-cabbelero-gold/40 text-cabbelero-gold hover:bg-cabbelero-gold/10 whitespace-nowrap">
                Connexion
              </Button>
            </Link>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="flex md:hidden">
          <button onClick={toggleMenu} className="text-cabbelero-light hover:text-cabbelero-gold transition-colors">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-cabbelero-black border-t border-cabbelero-gold/20 w-full p-4 shadow-lg animate-fade-in">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-cabbelero-light hover:text-cabbelero-gold py-2 px-4 rounded-md transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-cabbelero-gold/20 flex flex-col space-y-3">
              <Link to="/booking" className="w-full" onClick={() => setIsOpen(false)}>
                <Button className="w-full justify-center bg-cabbelero-gold hover:bg-cabbelero-gold/90 text-cabbelero-black">
                  <Scissors className="mr-2 h-4 w-4" /> Réserver
                </Button>
              </Link>
              
              {user ? (
                <>
                  {isStaff && (
                    <Link to="/dashboard" className="w-full" onClick={() => setIsOpen(false)}>
                      <Button variant="outline" className="w-full justify-center border-cabbelero-gold/40 text-cabbelero-gold hover:bg-cabbelero-gold/10">
                        Dashboard
                      </Button>
                    </Link>
                  )}
                  <Link to="/profile" className="w-full" onClick={() => setIsOpen(false)}>
                    <Button variant="ghost" className="w-full justify-center text-cabbelero-light hover:text-cabbelero-gold">
                      Mon profil
                    </Button>
                  </Link>
                </>
              ) : (
                <Link to="/login" className="w-full" onClick={() => setIsOpen(false)}>
                  <Button variant="outline" className="w-full justify-center border-cabbelero-gold/40 text-cabbelero-gold hover:bg-cabbelero-gold/10">
                    Connexion
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
