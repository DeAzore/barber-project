import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

const Profile = () => {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: profile?.first_name || '',
    lastName: profile?.last_name || '',
    phone: profile?.phone || ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);
        
      if (error) throw error;
      
      // Refresh profile data after update
      await refreshProfile();
      
      toast({
        title: "Profil mis à jour",
        description: "Vos informations ont été mises à jour avec succès.",
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour de votre profil.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <Layout>
      <div className="py-20 bg-cabbelero-black min-h-screen">
        <div className="salon-container max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="section-title">
              <span className="heading-accent">Mon Profil</span>
            </h1>
          </div>

          <Card className="shadow-lg border-cabbelero-gold/20 bg-cabbelero-gray">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-cabbelero-gold">Informations personnelles</CardTitle>
              <CardDescription className="text-cabbelero-light/70">
                Modifiez vos informations personnelles
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-cabbelero-light">Prénom</Label>
                    <Input 
                      id="firstName" 
                      name="firstName" 
                      value={formData.firstName || ''}
                      onChange={handleChange}
                      className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-light"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-cabbelero-light">Nom</Label>
                    <Input 
                      id="lastName" 
                      name="lastName" 
                      value={formData.lastName || ''}
                      onChange={handleChange}
                      className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-light"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-cabbelero-light">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={user.email || ''}
                    disabled
                    className="bg-cabbelero-black/50 border-cabbelero-gold/30 text-cabbelero-light/70"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-cabbelero-light">Téléphone</Label>
                  <Input 
                    id="phone" 
                    name="phone" 
                    value={formData.phone || ''}
                    onChange={handleChange}
                    className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-light"
                  />
                </div>
                
                <Button 
                  type="submit"
                  className="w-full bg-cabbelero-gold text-cabbelero-black hover:bg-cabbelero-gold/90"
                  disabled={isLoading}
                >
                  {isLoading ? "Mise à jour..." : "Mettre à jour"}
                </Button>
              </form>
            </CardContent>
            
            <CardFooter className="border-t border-cabbelero-gold/20 pt-4">
              <Button 
                variant="outline" 
                onClick={handleSignOut}
                className="w-full border-cabbelero-gold/30 text-cabbelero-gold hover:bg-cabbelero-gold/10"
              >
                <LogOut className="mr-2 h-4 w-4" /> Se déconnecter
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
