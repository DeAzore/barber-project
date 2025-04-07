import { useState, useEffect } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription
} from "@/components/ui/card";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Stylist } from "@/types/booking";
import { Save, Info, RefreshCw, Clock, AlertCircle } from "lucide-react";

interface Shift {
  id: string;
  stylist_id: string;
  day_of_week: number;
  start_time: string;
  end_time: string;
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

const DEFAULT_TIMES = {
  1: { start: "09:00", end: "18:00" }, // Monday
  2: { start: "09:00", end: "18:00" }, // Tuesday
  3: { start: "09:00", end: "18:00" }, // Wednesday
  4: { start: "09:00", end: "18:00" }, // Thursday
  5: { start: "09:00", end: "18:00" }, // Friday
  6: { start: "09:00", end: "18:00" }, // Saturday
  7: { start: "00:00", end: "00:00" }  // Sunday (closed)
};

export default function ShiftsPage() {
  const [stylists, setStylists] = useState<Stylist[]>([]);
  const [selectedStylist, setSelectedStylist] = useState<string>("");
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  
  const days = [
    { id: 1, name: "Lundi" },
    { id: 2, name: "Mardi" },
    { id: 3, name: "Mercredi" },
    { id: 4, name: "Jeudi" },
    { id: 5, name: "Vendredi" },
    { id: 6, name: "Samedi" },
    { id: 7, name: "Dimanche" },
  ];

  useEffect(() => {
    fetchStylists();
  }, []);

  useEffect(() => {
    if (selectedStylist) {
      fetchShifts();
    }
  }, [selectedStylist]);

  const fetchStylists = async () => {
    try {
      const { data, error } = await supabase
        .from('stylists')
        .select('*')
        .order('name');
      
      if (error) throw error;
      
      setStylists(data || []);
      if (data && data.length > 0) {
        setSelectedStylist(data[0].id);
      }
    } catch (error) {
      console.error("Error fetching stylists:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les barbiers",
        variant: "destructive",
      });
    }
  };

  const fetchShifts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('shifts')
        .select('*')
        .eq('stylist_id', selectedStylist);
      
      if (error) throw error;
      
      if (data && data.length > 0) {
        setShifts(data);
      } else {
        // Initialize default shifts for each day of the week
        const defaultShifts = days.map(day => ({
          id: `temp-${day.id}`,
          stylist_id: selectedStylist,
          day_of_week: day.id,
          start_time: DEFAULT_TIMES[day.id as keyof typeof DEFAULT_TIMES].start,
          end_time: DEFAULT_TIMES[day.id as keyof typeof DEFAULT_TIMES].end,
          is_available: day.id !== 7, // Sunday is closed by default
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }));
        setShifts(defaultShifts);
      }
    } catch (error) {
      console.error("Error fetching shifts:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les horaires",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveShifts = async () => {
    setSaving(true);
    try {
      // Separate new shifts from existing ones
      const existingShifts = shifts.filter(shift => !shift.id.startsWith('temp-'));
      const newShifts = shifts.filter(shift => shift.id.startsWith('temp-')).map(shift => ({
        stylist_id: shift.stylist_id,
        day_of_week: shift.day_of_week,
        start_time: shift.start_time,
        end_time: shift.end_time,
        is_available: shift.is_available,
      }));
      
      // Update existing shifts
      if (existingShifts.length > 0) {
        for (const shift of existingShifts) {
          const { error } = await supabase
            .from('shifts')
            .update({
              start_time: shift.start_time,
              end_time: shift.end_time,
              is_available: shift.is_available,
              updated_at: new Date().toISOString(),
            })
            .eq('id', shift.id);
          
          if (error) throw error;
        }
      }
      
      // Insert new shifts
      if (newShifts.length > 0) {
        const { error } = await supabase
          .from('shifts')
          .insert(newShifts);
        
        if (error) throw error;
      }
      
      toast({
        title: "Horaires enregistrés",
        description: "Les horaires ont été mis à jour avec succès",
      });
      
      // Refresh shifts to get the proper IDs for new shifts
      fetchShifts();
    } catch (error) {
      console.error("Error saving shifts:", error);
      toast({
        title: "Erreur",
        description: "Impossible d'enregistrer les horaires",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const updateShift = (dayId: number, field: keyof Shift, value: any) => {
    setShifts(shifts.map(shift => 
      shift.day_of_week === dayId ? { ...shift, [field]: value } : shift
    ));
  };

  const toggleClosed = (dayId: number) => {
    const isClosed = !shifts.find(s => s.day_of_week === dayId)?.is_available;
    updateShift(dayId, 'is_available', isClosed);
    
    // If we're opening the day and the times are 00:00, set default times
    if (isClosed) {
      const shift = shifts.find(s => s.day_of_week === dayId);
      if (shift?.start_time === "00:00" && shift?.end_time === "00:00") {
        updateShift(dayId, 'start_time', DEFAULT_TIMES[dayId as keyof typeof DEFAULT_TIMES].start);
        updateShift(dayId, 'end_time', DEFAULT_TIMES[dayId as keyof typeof DEFAULT_TIMES].end);
      }
    }
  };

  const handleClosedDay = (dayId: number) => {
    updateShift(dayId, 'is_available', false);
    updateShift(dayId, 'start_time', "00:00");
    updateShift(dayId, 'end_time', "00:00");
  };

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-cabbelero-gold mb-6">Gestion des horaires</h1>
        
        <Card className="bg-cabbelero-gray border-cabbelero-gold/20 mb-6">
          <CardHeader className="pb-2">
            <CardTitle>Horaires des barbiers</CardTitle>
            <CardDescription>
              Définissez les horaires de disponibilité pour chaque barbier
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="w-full sm:w-64">
                  <Label htmlFor="stylist-select" className="mb-2 block">Sélectionner un barbier</Label>
                  <Select 
                    value={selectedStylist} 
                    onValueChange={setSelectedStylist}
                  >
                    <SelectTrigger id="stylist-select">
                      <SelectValue placeholder="Sélectionner un barbier" />
                    </SelectTrigger>
                    <SelectContent>
                      {stylists.map((stylist) => (
                        <SelectItem key={stylist.id} value={stylist.id}>
                          {stylist.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex mt-4 sm:mt-0">
                  <Button 
                    variant="outline" 
                    onClick={fetchShifts}
                    className="mr-2"
                    disabled={loading || !selectedStylist}
                  >
                    <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                    Actualiser
                  </Button>
                  <Button 
                    onClick={handleSaveShifts}
                    disabled={saving || !selectedStylist || shifts.length === 0}
                  >
                    <Save className="mr-2 h-4 w-4" />
                    Enregistrer
                  </Button>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cabbelero-gold"></div>
                </div>
              ) : (
                <div className="space-y-4 mt-4">
                  {!selectedStylist ? (
                    <div className="text-center py-4 text-muted-foreground flex flex-col items-center">
                      <AlertCircle className="h-8 w-8 text-cabbelero-light/30 mb-3" />
                      <p>Veuillez sélectionner un barbier pour voir ses horaires</p>
                    </div>
                  ) : stylists.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground flex flex-col items-center">
                      <AlertCircle className="h-8 w-8 text-cabbelero-light/30 mb-3" />
                      <p>Aucun barbier trouvé. Veuillez d'abord ajouter des barbiers.</p>
                    </div>
                  ) : shifts.length === 0 ? (
                    <div className="text-center py-4 text-muted-foreground">
                      <p>Aucun horaire trouvé pour ce barbier</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-cabbelero-gold/20">
                            <th className="text-left py-3 px-4">Jour</th>
                            <th className="text-left py-3 px-4">Ouvert</th>
                            <th className="text-left py-3 px-4">Heure d'ouverture</th>
                            <th className="text-left py-3 px-4">Heure de fermeture</th>
                            <th className="text-left py-3 px-4">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {days.map(day => {
                            const shift = shifts.find(s => s.day_of_week === day.id);
                            return shift ? (
                              <tr key={day.id} className="border-b border-cabbelero-gold/10 hover:bg-cabbelero-gold/5">
                                <td className="py-3 px-4 font-medium">{day.name}</td>
                                <td className="py-3 px-4">
                                  <div className="flex items-center">
                                    <Switch 
                                      checked={shift.is_available} 
                                      onCheckedChange={() => toggleClosed(day.id)}
                                    />
                                    <span className="ml-2">
                                      {shift.is_available ? 'Ouvert' : 'Fermé'}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3 px-4">
                                  <Input 
                                    type="time" 
                                    value={shift.start_time} 
                                    onChange={(e) => updateShift(day.id, 'start_time', e.target.value)}
                                    disabled={!shift.is_available}
                                    className="w-32"
                                  />
                                </td>
                                <td className="py-3 px-4">
                                  <Input 
                                    type="time" 
                                    value={shift.end_time} 
                                    onChange={(e) => updateShift(day.id, 'end_time', e.target.value)}
                                    disabled={!shift.is_available}
                                    className="w-32"
                                  />
                                </td>
                                <td className="py-3 px-4">
                                  {shift.is_available && (
                                    <Button 
                                      variant="outline" 
                                      size="sm"
                                      onClick={() => handleClosedDay(day.id)}
                                    >
                                      <Clock className="h-4 w-4 mr-1" /> Jour fermé
                                    </Button>
                                  )}
                                </td>
                              </tr>
                            ) : null;
                          })}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
        
        <div className="flex items-start p-4 bg-cabbelero-gold/5 border border-cabbelero-gold/20 rounded-lg">
          <Info className="h-5 w-5 text-cabbelero-gold mr-3 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-cabbelero-gold mb-1">À propos des horaires</h3>
            <p className="text-sm">
              Les horaires définis ici sont utilisés pour déterminer les disponibilités lors de la prise de rendez-vous. 
              Si un barbier n'est pas disponible certains jours ou à certaines heures, les clients ne pourront pas 
              réserver pendant ces périodes. Pour fermer un jour, désactivez le switch "Ouvert" ou utilisez le bouton "Jour fermé".
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
