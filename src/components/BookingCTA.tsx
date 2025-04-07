import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";

const BookingCTA = () => {
  return (
    <section className="py-20 relative overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-fixed opacity-20"
        style={{ 
          backgroundImage: "url('https://images.unsplash.com/photo-1600948836101-f9ffda59d250?auto=format&fit=crop&q=80&w=2036')",
        }}
      ></div>
      
      <div className="absolute inset-0 bg-salon-dark/80"></div>
      
      <div className="salon-container relative z-10">
        <div className="max-w-3xl mx-auto text-center text-white">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-serif mb-6">
            Prêt à Transformer Votre Style?
          </h2>
          <p className="text-lg md:text-xl text-gray-200 mb-8">
            Réservez votre rendez-vous dès maintenant et laissez nos experts stylistes révéler votre beauté naturelle.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-salon-gold text-2xl font-bold mb-2">01</div>
              <h3 className="font-serif text-xl mb-2">Choisissez un Service</h3>
              <p className="text-gray-300 text-sm">Parcourez notre gamme de services de beauté et sélectionnez celui qui vous convient.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-salon-gold text-2xl font-bold mb-2">02</div>
              <h3 className="font-serif text-xl mb-2">Sélectionnez une Date</h3>
              <p className="text-gray-300 text-sm">Choisissez une date et une heure qui s'adaptent parfaitement à votre emploi du temps.</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm p-6 rounded-lg">
              <div className="text-salon-gold text-2xl font-bold mb-2">03</div>
              <h3 className="font-serif text-xl mb-2">Confirmez & Relaxez</h3>
              <p className="text-gray-300 text-sm">Recevez votre confirmation et préparez-vous à vivre une expérience exceptionnelle.</p>
            </div>
          </div>
          
          <Link to="/booking">
            <Button size="lg" className="bg-salon-gold hover:bg-salon-gold/90 text-white px-8 py-6 text-lg">
              Réserver Mon Rendez-vous
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default BookingCTA;
