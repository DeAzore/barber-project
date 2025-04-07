import Layout from '@/components/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Scissors, Award, Heart, Clock } from "lucide-react";
import { Link } from 'react-router-dom';

const About = () => {
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
            <span className="heading-accent">À Propos de Cabbelero</span>
          </h1>
          <p className="text-center text-gray-300 max-w-2xl mx-auto mt-4 mb-12">
            Découvrez l'histoire, les valeurs et la passion qui font de Cabbelero le salon de coiffure 
            masculin le plus authentique de la région.
          </p>
          
          {/* Our Story */}
          <div className="mb-16">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div>
                <h2 className="text-3xl font-serif font-bold mb-4 text-cabbelero-gold">Notre Histoire</h2>
                <div className="space-y-4 text-gray-300">
                  <p>
                    Fondé en 2015, Cabbelero est né de la passion d'un groupe de barbiers expérimentés qui partageaient 
                    une vision commune : créer un espace où l'art traditionnel de la coiffure masculine pourrait être célébré 
                    et perpétué avec une touche moderne.
                  </p>
                  <p>
                    Ce qui a commencé comme un petit salon avec seulement deux chaises s'est rapidement transformé en un 
                    lieu de référence pour les hommes exigeants qui recherchent non seulement une coupe de cheveux, mais 
                    une expérience complète dans un cadre authentique.
                  </p>
                  <p>
                    Aujourd'hui, avec notre équipe de barbiers hautement qualifiés et notre environnement unique, nous 
                    continuons à honorer les techniques traditionnelles tout en embrassant les nouvelles tendances et 
                    technologies pour offrir à nos clients le meilleur des deux mondes.
                  </p>
                </div>
              </div>
              <div className="relative">
                <img 
                  src="/lovable-uploads/021ca116-9766-4902-8579-0f5ad403c614.png" 
                  alt="Cabbelero Salon" 
                  className="rounded-lg shadow-xl w-full h-auto"
                />
                <div className="absolute -bottom-6 -right-6 bg-cabbelero-gold text-cabbelero-black p-4 rounded shadow-lg transform rotate-3">
                  <p className="font-serif font-bold text-xl">Depuis 2015</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Our Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-bold mb-8 text-center text-cabbelero-gold">Nos Valeurs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <Card className="bg-cabbelero-black/60 backdrop-blur-sm border border-cabbelero-gold/20">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-cabbelero-gold flex items-center justify-center mx-auto mb-4">
                    <Scissors className="h-8 w-8 text-cabbelero-black" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-2 text-cabbelero-gold">Excellence</h3>
                  <p className="text-gray-300">
                    Nous nous engageons à fournir un service et des résultats de la plus haute qualité, 
                    en perfectionnant constamment nos compétences et techniques.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-cabbelero-black/60 backdrop-blur-sm border border-cabbelero-gold/20">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-cabbelero-gold flex items-center justify-center mx-auto mb-4">
                    <Award className="h-8 w-8 text-cabbelero-black" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-2 text-cabbelero-gold">Authenticité</h3>
                  <p className="text-gray-300">
                    Nous restons fidèles aux traditions de la barberie tout en les adaptant aux besoins 
                    et aux styles contemporains.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-cabbelero-black/60 backdrop-blur-sm border border-cabbelero-gold/20">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-cabbelero-gold flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-cabbelero-black" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-2 text-cabbelero-gold">Communauté</h3>
                  <p className="text-gray-300">
                    Nous valorisons les relations que nous construisons avec nos clients et notre communauté, 
                    en créant un environnement accueillant pour tous.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="bg-cabbelero-black/60 backdrop-blur-sm border border-cabbelero-gold/20">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-cabbelero-gold flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-8 w-8 text-cabbelero-black" />
                  </div>
                  <h3 className="text-xl font-serif font-bold mb-2 text-cabbelero-gold">Innovation</h3>
                  <p className="text-gray-300">
                    Nous nous efforçons d'être à la pointe des tendances, des techniques et des produits 
                    pour offrir à nos clients des expériences modernes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Our Team */}
          <div className="mb-16">
            <h2 className="text-3xl font-serif font-bold mb-4 text-center text-cabbelero-gold">Notre Équipe</h2>
            <p className="text-center text-gray-300 max-w-2xl mx-auto mb-8">
              Chez Cabbelero, notre équipe est composée de barbiers passionnés et hautement qualifiés, 
              chacun apportant son propre style et sa propre expertise pour créer une expérience unique 
              pour chaque client.
            </p>
            <div className="text-center">
              <Link to="/stylists">
                <Button className="bg-cabbelero-gold hover:bg-cabbelero-gold/90 text-cabbelero-black">
                  Découvrir notre équipe
                </Button>
              </Link>
            </div>
          </div>
          
          {/* CTA */}
          <div className="bg-gradient-to-r from-cabbelero-gold/20 to-cabbelero-black p-8 rounded-lg text-center">
            <h3 className="text-2xl font-serif font-bold mb-4 text-cabbelero-gold">Prêt à vivre l'expérience Cabbelero ?</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Rejoignez-nous pour découvrir pourquoi nous sommes la destination préférée des hommes qui accordent 
              de l'importance à leur apparence. Réservez votre rendez-vous dès aujourd'hui et transformez votre style.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/booking">
                <Button className="bg-cabbelero-gold hover:bg-cabbelero-gold/90 text-cabbelero-black w-full sm:w-auto">
                  Réserver maintenant
                </Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="border-cabbelero-gold/40 text-cabbelero-gold hover:bg-cabbelero-gold/10 w-full sm:w-auto">
                  Contactez-nous
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default About;
