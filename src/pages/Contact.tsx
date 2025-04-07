import Layout from '@/components/Layout';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

const Contact = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Here you would normally send the contact form data to a backend
      // For now, we'll just simulate a delay and show success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Message envoyé",
        description: "Nous vous répondrons dès que possible.",
      });
      
      // Reset form
      setName("");
      setEmail("");
      setPhone("");
      setMessage("");
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue. Veuillez réessayer plus tard.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
            <span className="heading-accent">Contact</span>
          </h1>
          <p className="text-center text-gray-300 max-w-2xl mx-auto mt-4 mb-12">
            Vous avez des questions ou souhaitez prendre rendez-vous ? N'hésitez pas à nous contacter.
            Nous sommes là pour vous aider.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="md:col-span-2">
              <Card className="bg-cabbelero-black/60 backdrop-blur-sm border border-cabbelero-gold/20">
                <CardContent className="p-6">
                  <h2 className="text-xl font-serif font-bold mb-4 text-cabbelero-gold">Envoyez-nous un message</h2>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-cabbelero-light">Nom complet</Label>
                        <Input 
                          id="name" 
                          value={name} 
                          onChange={(e) => setName(e.target.value)} 
                          required 
                          className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-light focus:border-cabbelero-gold"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-cabbelero-light">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={email} 
                          onChange={(e) => setEmail(e.target.value)} 
                          required 
                          className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-light focus:border-cabbelero-gold"
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-cabbelero-light">Téléphone</Label>
                      <Input 
                        id="phone" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)} 
                        className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-light focus:border-cabbelero-gold"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="message" className="text-cabbelero-light">Message</Label>
                      <Textarea 
                        id="message" 
                        value={message} 
                        onChange={(e) => setMessage(e.target.value)} 
                        required 
                        className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-light focus:border-cabbelero-gold min-h-32"
                      />
                    </div>
                    
                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="bg-cabbelero-gold hover:bg-cabbelero-gold/90 text-cabbelero-black"
                    >
                      {loading ? (
                        <>
                          <div className="animate-spin mr-2 h-4 w-4 border-t-2 border-b-2 border-cabbelero-black rounded-full"></div>
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <Send className="mr-2 h-4 w-4" /> 
                          Envoyer le message
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
            
            {/* Contact Info */}
            <div>
              <Card className="bg-cabbelero-black/60 backdrop-blur-sm border border-cabbelero-gold/20 mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-serif font-bold mb-4 text-cabbelero-gold">Informations</h2>
                  
                  <div className="space-y-4">
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-cabbelero-gold flex items-center justify-center text-cabbelero-black flex-shrink-0">
                        <MapPin className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-cabbelero-light">Adresse</h3>
                        <p className="text-gray-400">123 Rue de la Coiffure<br />Casablanca, Maroc</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-cabbelero-gold flex items-center justify-center text-cabbelero-black flex-shrink-0">
                        <Phone className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-cabbelero-light">Téléphone</h3>
                        <p className="text-gray-400">+212 5 22 123 456</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-cabbelero-gold flex items-center justify-center text-cabbelero-black flex-shrink-0">
                        <Mail className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-cabbelero-light">Email</h3>
                        <p className="text-gray-400">contact@cabbelero.com</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4 items-start">
                      <div className="w-10 h-10 rounded-full bg-cabbelero-gold flex items-center justify-center text-cabbelero-black flex-shrink-0">
                        <Clock className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-cabbelero-light">Heures d'ouverture</h3>
                        <p className="text-gray-400">Lun - Sam: 9h00 - 19h00</p>
                        <p className="text-gray-400">Dim: 10h00 - 16h00</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="bg-cabbelero-black/60 backdrop-blur-sm border border-cabbelero-gold/20">
                <CardContent className="p-0">
                  <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106376.49576151962!2d-7.712694461356944!3d33.57254990000001!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7d2a0302df3e5%3A0xa372d82ae2bbe180!2sCasablanca%20Mall!5e0!3m2!1sen!2sus!4v1744135628762!5m2!1sen!2sus" 
                    width="100%" 
                    height="250" 
                    style={{ border: 0 }}
                    loading="lazy" 
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-b-lg"
                  ></iframe>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
