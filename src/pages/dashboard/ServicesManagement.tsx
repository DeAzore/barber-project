import AdminLayout from "@/layouts/AdminLayout";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Service } from "@/types/booking";

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<Service | null>(null);
  
  // Form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [duration, setDuration] = useState("");
  const [icon, setIcon] = useState("scissors");
  const { toast } = useToast();

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching services:', error);
        toast({
          title: "Erreur",
          description: "Impossible de charger les services",
          variant: "destructive",
        });
        return;
      }
      
      setServices(data || []);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (service?: Service) => {
    if (service) {
      setIsEditing(true);
      setCurrentService(service);
      setTitle(service.title);
      setDescription(service.description);
      setPrice(service.price.toString());
      setDuration(service.duration.toString());
      setIcon(service.icon);
    } else {
      setIsEditing(false);
      setCurrentService(null);
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setPrice("");
    setDuration("");
    setIcon("scissors");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title || !description || !price || !duration) {
      toast({
        title: "Erreur",
        description: "Tous les champs sont obligatoires",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isEditing && currentService) {
        const { error } = await supabase
          .from('services')
          .update({
            title,
            description,
            price: Number(price),
            duration: Number(duration),
            icon,
          })
          .eq('id', currentService.id);

        if (error) throw error;
        toast({
          title: "Succès",
          description: "Service mis à jour avec succès",
        });
      } else {
        const { error } = await supabase
          .from('services')
          .insert({
            title,
            description,
            price: Number(price),
            duration: Number(duration),
            icon,
          });

        if (error) throw error;
        toast({
          title: "Succès",
          description: "Service créé avec succès",
        });
      }
      
      // Refresh the services list
      fetchServices();
      // Close the dialog
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Error saving service:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement du service",
        variant: "destructive",
      });
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce service?")) {
      try {
        const { error } = await supabase
          .from('services')
          .delete()
          .eq('id', serviceId);

        if (error) throw error;
        
        toast({
          title: "Succès",
          description: "Service supprimé avec succès",
        });
        
        // Refresh services list
        fetchServices();
      } catch (error) {
        console.error('Error deleting service:', error);
        toast({
          title: "Erreur",
          description: "Une erreur est survenue lors de la suppression du service",
          variant: "destructive",
        });
      }
    }
  };

  const iconOptions = [
    { value: "scissors", label: "Ciseaux" },
    { value: "palette", label: "Palette" },
    { value: "sparkles", label: "Étincelles" },
    { value: "paintbrush", label: "Pinceau" }
  ];

  return (
    <AdminLayout>
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-cabbelero-gold">Gestion des Services</h1>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="mr-2 h-4 w-4" /> Ajouter un service
          </Button>
        </div>

        <Card className="bg-cabbelero-gray border-cabbelero-gold/20">
          <CardHeader>
            <CardTitle>Liste des services</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <p className="text-center py-4">Chargement...</p>
            ) : services.length === 0 ? (
              <p className="text-center py-4">Aucun service trouvé.</p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Titre</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Prix</TableHead>
                    <TableHead>Durée</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell className="font-medium">{service.title}</TableCell>
                      <TableCell className="max-w-xs truncate">{service.description}</TableCell>
                      <TableCell>{service.price} MAD</TableCell>
                      <TableCell>{service.duration} min</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleOpenDialog(service)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="destructive" size="sm" onClick={() => handleDeleteService(service.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Dialog for adding/editing services */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{isEditing ? "Modifier un service" : "Ajouter un service"}</DialogTitle>
              <DialogDescription>
                {isEditing 
                  ? "Modifiez les informations du service ci-dessous." 
                  : "Remplissez ce formulaire pour ajouter un nouveau service."}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Titre</Label>
                <Input 
                  id="title" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="Ex: Coupe homme"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={description} 
                  onChange={(e) => setDescription(e.target.value)} 
                  placeholder="Description du service"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="price">Prix (MAD)</Label>
                  <Input 
                    id="price" 
                    value={price} 
                    onChange={(e) => setPrice(e.target.value)} 
                    type="number"
                    min="0"
                    placeholder="Prix"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Durée (minutes)</Label>
                  <Input 
                    id="duration" 
                    value={duration} 
                    onChange={(e) => setDuration(e.target.value)} 
                    type="number"
                    min="0"
                    placeholder="Durée"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="icon">Icône</Label>
                <Select value={icon} onValueChange={setIcon}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une icône" />
                  </SelectTrigger>
                  <SelectContent>
                    {iconOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsDialogOpen(false)}>
                  Annuler
                </Button>
                <Button type="submit">
                  {isEditing ? "Mettre à jour" : "Ajouter"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
}
