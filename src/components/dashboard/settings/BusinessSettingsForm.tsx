import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Save, Upload, Phone, MapPin, Mail, Globe, Building } from "lucide-react";
import { Tables } from "@/integrations/supabase/types";
import { BusinessSettings } from "@/types/notifications";

type BusinessSettingsWithOptionalId = Omit<BusinessSettings, 'id'> & { id?: string };

const DEFAULT_SETTINGS: BusinessSettingsWithOptionalId = {
  name: "Cabbelero Barbershop",
  description: "Salon de coiffure et barbier pour hommes",
  about_text: "Cabbelero est un salon de coiffure et barbier pour hommes situé au cœur de la ville. Notre équipe de professionnels expérimentés est là pour vous offrir une expérience de coiffure exceptionnelle dans une ambiance conviviale et décontractée.",
  address: "123 Rue de Paris, 75001 Paris",
  phone: "+33 1 23 45 67 89",
  email: "contact@cabbelero.com",
  website: "www.cabbelero.com",
  logo_url: "/placeholder.svg",
  currency: "EUR",
  created_at: new Date().toISOString(), // Add the missing created_at property
  updated_at: new Date().toISOString()  // Add the missing updated_at property
};

export default function BusinessSettingsForm() {
  const [settings, setSettings] = useState<BusinessSettingsWithOptionalId>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    setLoading(true);
    try {
      // Fetch settings from the business_settings table
      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .maybeSingle();

      if (error) {
        throw error;
      }
      
      // If we have settings in the database, use them, otherwise use defaults
      if (data) {
        setSettings(data as BusinessSettingsWithOptionalId);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const ensureBucketExists = async (): Promise<boolean> => {
    try {
      // First check if bucket exists
      const { data: buckets, error: listError } = await supabase
        .storage
        .listBuckets();
        
      if (listError) throw listError;
      
      const bucketExists = buckets?.some(bucket => bucket.name === 'business_assets');
      
      // If bucket doesn't exist, create it
      if (!bucketExists) {
        const { error: createError } = await supabase.storage.createBucket('business_assets', {
          public: true,
          fileSizeLimit: 2097152 // 2MB
        });
        
        if (createError) throw createError;
        
        console.log('Created business_assets bucket');
      }
      
      return true;
    } catch (error) {
      console.error("Error ensuring bucket exists:", error);
      return false;
    }
  };

  const handleSaveSettings = async () => {
    setSaving(true);
    try {
      // First, upload logo if a new one is selected
      let logoUrl = settings.logo_url;
      
      if (logoFile) {
        // Ensure bucket exists before uploading
        const bucketReady = await ensureBucketExists();
        if (!bucketReady) {
          throw new Error("Could not create or access storage bucket");
        }
        
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `logo-${Date.now()}.${fileExt}`;
        
        try {
          // Upload the file
          const { error: uploadError } = await supabase
            .storage
            .from('business_assets')
            .upload(fileName, logoFile, {
              cacheControl: '3600',
              upsert: true
            });
            
          if (uploadError) throw uploadError;
          
          // Get the public URL
          const { data: urlData } = supabase
            .storage
            .from('business_assets')
            .getPublicUrl(fileName);
            
          logoUrl = urlData.publicUrl;
          console.log('Logo uploaded successfully:', logoUrl);
        } catch (error) {
          console.error("Error uploading logo:", error);
          toast({
            title: "Erreur",
            description: "Impossible d'uploader le logo: " + (error instanceof Error ? error.message : "Erreur inconnue"),
            variant: "destructive",
          });
          // Continue with the save process even if logo upload fails
        }
      }
      
      // Update the settings in the database
      const settingsToUpsert = {
        ...settings,
        logo_url: logoUrl,
        updated_at: new Date().toISOString()
      };
      
      const { error } = await supabase
        .from('business_settings')
        .upsert(settingsToUpsert);
        
      if (error) throw error;
      
      toast({
        title: "Paramètres enregistrés",
        description: "Les paramètres ont été mis à jour avec succès",
      });
      
      // Reset form state
      setLogoFile(null);
      
      // Refresh settings from database
      fetchSettings();
    } catch (error) {
      console.error("Error saving settings:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les paramètres: " + (error instanceof Error ? error.message : "Erreur inconnue"),
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size
    if (file.size > 2 * 1024 * 1024) { // 2MB limit
      toast({
        title: "Fichier trop volumineux",
        description: "La taille du fichier ne doit pas dépasser 2MB.",
        variant: "destructive",
      });
      return;
    }
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setLogoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setLogoFile(file);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cabbelero-gold"></div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card className="bg-cabbelero-gray border-cabbelero-gold/20">
        <CardHeader>
          <CardTitle>Informations générales</CardTitle>
          <CardDescription>
            Paramètres généraux de votre entreprise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-name">Nom de l'entreprise</Label>
              <Input
                id="business-name"
                value={settings.name}
                onChange={(e) => setSettings({...settings, name: e.target.value})}
                placeholder="Nom de votre entreprise"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-description">Description courte</Label>
              <Input
                id="business-description"
                value={settings.description}
                onChange={(e) => setSettings({...settings, description: e.target.value})}
                placeholder="Description courte de votre entreprise"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-currency">Devise</Label>
              <Input
                id="business-currency"
                value={settings.currency}
                onChange={(e) => setSettings({...settings, currency: e.target.value})}
                placeholder="EUR"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="logo-upload">Logo</Label>
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-cabbelero-black/30 rounded-md overflow-hidden flex items-center justify-center">
                  {logoPreview ? (
                    <img 
                      src={logoPreview} 
                      alt="Logo preview" 
                      className="w-full h-full object-contain"
                    />
                  ) : settings.logo_url ? (
                    <img 
                      src={settings.logo_url} 
                      alt="Business logo" 
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <Building className="w-8 h-8 text-cabbelero-light/50" />
                  )}
                </div>
                <div className="flex-1">
                  <Label htmlFor="logo" className="cursor-pointer">
                    <div className="bg-cabbelero-black/20 hover:bg-cabbelero-black/30 flex items-center justify-center rounded-md p-2 transition-colors">
                      <Upload className="h-4 w-4 mr-2" />
                      <span>Choisir une image</span>
                    </div>
                    <input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="hidden"
                    />
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Format recommandé: SVG, PNG ou JPG. Taille max: 2MB.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-cabbelero-gray border-cabbelero-gold/20">
        <CardHeader>
          <CardTitle>Coordonnées</CardTitle>
          <CardDescription>
            Informations de contact de votre entreprise
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="business-address" className="flex items-center">
                <MapPin className="h-4 w-4 mr-2" />
                Adresse
              </Label>
              <Input
                id="business-address"
                value={settings.address}
                onChange={(e) => setSettings({...settings, address: e.target.value})}
                placeholder="Adresse complète"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-phone" className="flex items-center">
                <Phone className="h-4 w-4 mr-2" />
                Téléphone
              </Label>
              <Input
                id="business-phone"
                value={settings.phone}
                onChange={(e) => setSettings({...settings, phone: e.target.value})}
                placeholder="Numéro de téléphone"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-email" className="flex items-center">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Label>
              <Input
                id="business-email"
                value={settings.email}
                onChange={(e) => setSettings({...settings, email: e.target.value})}
                placeholder="Adresse email"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="business-website" className="flex items-center">
                <Globe className="h-4 w-4 mr-2" />
                Site web
              </Label>
              <Input
                id="business-website"
                value={settings.website}
                onChange={(e) => setSettings({...settings, website: e.target.value})}
                placeholder="URL du site web"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-cabbelero-gray border-cabbelero-gold/20 col-span-1 lg:col-span-2">
        <CardHeader>
          <CardTitle>Texte "À propos"</CardTitle>
          <CardDescription>
            Texte qui apparaît sur la page "À propos" de votre site
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Textarea 
            value={settings.about_text}
            onChange={(e) => setSettings({...settings, about_text: e.target.value})}
            placeholder="Parlez de votre entreprise, de votre histoire, de votre équipe..."
            className="min-h-[200px]"
          />
        </CardContent>
      </Card>
      
      <div className="col-span-1 lg:col-span-2 flex justify-end">
        <Button onClick={handleSaveSettings} disabled={saving} className="w-full sm:w-auto">
          {saving ? (
            <>
              <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2"></div>
              Enregistrement...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Enregistrer les paramètres
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
