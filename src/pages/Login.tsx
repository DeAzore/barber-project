import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import Layout from '@/components/Layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

type UpdateProfileResponse = {
  id: string;
  updated_at: string;
  success: boolean;
  error?: string; // Added error property
};

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  const [signupData, setSignupData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: ''
  });

  if (user) {
    const from = (location.state as any)?.from?.pathname || "/";
    navigate(from, { replace: true });
  }

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      });

      if (error) {
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      toast({
        title: "Connexion réussie",
        description: "Vous êtes maintenant connecté.",
      });

    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (signupData.password !== signupData.confirmPassword) {
      toast({
        title: "Erreur",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: signupData.email,
        password: signupData.password,
        options: {
          data: {
            first_name: signupData.firstName,
            last_name: signupData.lastName
          }
        }
      });

      if (authError) {
        toast({
          title: "Erreur d'inscription",
          description: authError.message,
          variant: "destructive",
        });
        return;
      }

      if (authData?.user) {
        // For development, let's just show a success message
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé. Vous êtes maintenant connecté.",
        });
      }

    } catch (error) {
      console.error('Signup error:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  async function updateUserProfileRPC(profileData: any) {
    try {
      // In development mode, just return success
      return { success: true, id: profileData.user_id, updated_at: new Date().toISOString() };
    } catch (error) {
      console.error('Error updating user profile:', error);
      throw error;
    }
  }

  return (
    <Layout>
      <div className="py-20 bg-cabbelero-black min-h-screen">
        <div className="salon-container max-w-md mx-auto">
          <div className="text-center mb-8">
            <h1 className="section-title">
              <span className="heading-accent">Espace Client</span>
            </h1>
          </div>

          <Card className="shadow-lg border-cabbelero-gold/20 bg-cabbelero-gray">
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 bg-cabbelero-black">
                <TabsTrigger value="login" className="text-cabbelero-gold data-[state=active]:bg-cabbelero-gold data-[state=active]:text-cabbelero-black">
                  Connexion
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-cabbelero-gold data-[state=active]:bg-cabbelero-gold data-[state=active]:text-cabbelero-black">
                  Inscription
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin}>
                  <CardHeader>
                    <CardTitle className="text-xl text-cabbelero-gold">Connexion</CardTitle>
                    <CardDescription className="text-cabbelero-light/70">
                      Accédez à votre espace client pour gérer vos rendez-vous.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-cabbelero-light">Email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="votre@email.com" 
                        value={loginData.email}
                        onChange={handleLoginChange}
                        className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-light"
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <Label htmlFor="password" className="text-cabbelero-light">Mot de passe</Label>
                        <Button variant="link" type="button" className="p-0 h-auto text-xs text-cabbelero-gold hover:text-cabbelero-gold/80">
                          Mot de passe oublié?
                        </Button>
                      </div>
                      <Input 
                        id="password" 
                        name="password" 
                        type="password" 
                        placeholder="••••••••"
                        value={loginData.password}
                        onChange={handleLoginChange}
                        className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-light"
                        required 
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-cabbelero-gold text-cabbelero-black hover:bg-cabbelero-gold/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Connexion en cours..." : "Se connecter"}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
              
              <TabsContent value="signup">
                <form onSubmit={handleSignup}>
                  <CardHeader>
                    <CardTitle className="text-xl text-cabbelero-gold">Créer un compte</CardTitle>
                    <CardDescription className="text-cabbelero-light/70">
                      Inscrivez-vous pour réserver facilement vos rendez-vous.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-cabbelero-light">Prénom</Label>
                        <Input 
                          id="firstName" 
                          name="firstName" 
                          type="text" 
                          placeholder="Prénom"
                          value={signupData.firstName}
                          onChange={handleSignupChange}
                          className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-light"
                          required 
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-cabbelero-light">Nom</Label>
                        <Input 
                          id="lastName" 
                          name="lastName" 
                          type="text" 
                          placeholder="Nom"
                          value={signupData.lastName}
                          onChange={handleSignupChange}
                          className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-light"
                          required 
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone" className="text-cabbelero-light">Téléphone</Label>
                      <Input 
                        id="phone" 
                        name="phone" 
                        type="tel" 
                        placeholder="06 12 34 56 78"
                        value={signupData.phone}
                        onChange={handleSignupChange}
                        className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-light"
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-email" className="text-cabbelero-light">Email</Label>
                      <Input 
                        id="signup-email" 
                        name="email" 
                        type="email" 
                        placeholder="votre@email.com"
                        value={signupData.email}
                        onChange={handleSignupChange}
                        className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-light"
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="signup-password" className="text-cabbelero-light">Mot de passe</Label>
                      <Input 
                        id="signup-password" 
                        name="password" 
                        type="password" 
                        placeholder="••••••••"
                        value={signupData.password}
                        onChange={handleSignupChange}
                        className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-light"
                        required 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword" className="text-cabbelero-light">Confirmer le mot de passe</Label>
                      <Input 
                        id="confirmPassword" 
                        name="confirmPassword" 
                        type="password" 
                        placeholder="••••••••"
                        value={signupData.confirmPassword}
                        onChange={handleSignupChange}
                        className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-light"
                        required 
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button 
                      className="w-full bg-cabbelero-gold text-cabbelero-black hover:bg-cabbelero-gold/90"
                      disabled={isLoading}
                    >
                      {isLoading ? "Inscription en cours..." : "S'inscrire"}
                    </Button>
                  </CardFooter>
                </form>
              </TabsContent>
            </Tabs>
          </Card>
          
          <div className="mt-6 text-center text-cabbelero-light/70">
            <Link to="/" className="text-cabbelero-gold hover:text-cabbelero-gold/80">
              Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Login;
