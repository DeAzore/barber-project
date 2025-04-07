import { useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

interface TestimonialProps {
  quote: string;
  name: string;
  title: string;
  rating: number;
  image?: string;
}

const Testimonial = ({ quote, name, title, rating, image }: TestimonialProps) => {
  const stars = Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${i < rating ? 'text-salon-gold fill-salon-gold' : 'text-gray-300'}`}
    />
  ));

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg flex flex-col h-full">
      <div className="flex items-center mb-6">
        {image ? (
          <img
            src={image}
            alt={name}
            className="h-12 w-12 rounded-full object-cover mr-4"
          />
        ) : (
          <div className="h-12 w-12 rounded-full bg-salon-blue flex items-center justify-center text-white font-medium mr-4">
            {name.charAt(0)}
          </div>
        )}
        <div>
          <p className="font-medium text-salon-dark">{name}</p>
          <p className="text-sm text-gray-500">{title}</p>
        </div>
      </div>
      <div className="flex mb-4">{stars}</div>
      <p className="text-gray-700 italic flex-grow">{quote}</p>
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      quote: "Je suis ravie de ma nouvelle coupe ! L'équipe a su écouter mes attentes et le résultat est exactement ce que je souhaitais. L'ambiance du salon est apaisante et l'accueil chaleureux.",
      name: "Layla Benjelloun",
      title: "Cliente régulière",
      rating: 5
    },
    {
      quote: "Un service exceptionnel du début à la fin. J'ai adoré mon expérience de coloration avec Sofia qui a su me conseiller parfaitement sur la teinte adaptée à mon teint.",
      name: "Karim Tazi",
      title: "Client satisfait",
      rating: 5
    },
    {
      quote: "Première visite au salon et certainement pas la dernière ! Les tarifs sont justes pour la qualité de service offerte. Merci à Amina pour ses conseils précieux.",
      name: "Nadia El Fassi",
      title: "Nouvelle cliente",
      rating: 4
    },
    {
      quote: "Je recommande vivement SalonMaroc pour leur professionnalisme et leur expertise. Je sors toujours du salon avec une coiffure impeccable qui dure longtemps.",
      name: "Ahmed Berrada",
      title: "Client fidèle",
      rating: 5
    },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const showTestimonials = () => {
    const itemsPerSlide = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    return testimonials.slice(currentIndex, currentIndex + itemsPerSlide);
  };

  const nextSlide = () => {
    const itemsPerSlide = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    const maxIndex = testimonials.length - itemsPerSlide;
    setCurrentIndex(prev => Math.min(prev + 1, maxIndex));
  };

  const prevSlide = () => {
    setCurrentIndex(prev => Math.max(prev - 1, 0));
  };

  const canGoNext = () => {
    const itemsPerSlide = window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1;
    return currentIndex < testimonials.length - itemsPerSlide;
  };

  const canGoPrev = () => {
    return currentIndex > 0;
  };

  return (
    <section className="py-16 bg-salon-cream">
      <div className="salon-container">
        <div className="text-center mb-12">
          <h2 className="section-title">
            <span className="heading-accent">Témoignages</span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Découvrez ce que nos clients disent de leur expérience chez SalonMaroc.
          </p>
        </div>
        
        <div className="relative">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {showTestimonials().map((testimonial, index) => (
              <div key={index} className="animate-fade-in">
                <Testimonial
                  quote={testimonial.quote}
                  name={testimonial.name}
                  title={testimonial.title}
                  rating={testimonial.rating}
                />
              </div>
            ))}
          </div>
          
          <div className="flex justify-center mt-8 gap-3">
            <button
              onClick={prevSlide}
              disabled={!canGoPrev()}
              className={`p-2 rounded-full border ${
                canGoPrev() 
                  ? 'border-salon-dark text-salon-dark hover:bg-salon-dark hover:text-white' 
                  : 'border-gray-300 text-gray-300 cursor-not-allowed'
              } transition-colors`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={nextSlide}
              disabled={!canGoNext()}
              className={`p-2 rounded-full border ${
                canGoNext() 
                  ? 'border-salon-dark text-salon-dark hover:bg-salon-dark hover:text-white' 
                  : 'border-gray-300 text-gray-300 cursor-not-allowed'
              } transition-colors`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
