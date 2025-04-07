import React, { useState, useEffect } from "react";
import AdminLayout from "@/layouts/AdminLayout";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { CheckCircle, Clock, X, MessageSquare, AlertCircle, Trash2 } from "lucide-react";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { sendAppointmentConfirmation, sendAppointmentReminder } from "@/services/notificationService";
import { createAppointmentNotification } from "@/services/notificationsSystemService";
import { useSearchParams } from "react-router-dom";
import AppointmentConfirmDialog from "@/components/dashboard/appointments/AppointmentConfirmDialog";

type Appointment = {
  id: string;
  client_name: string;
  client_phone: string;
  booking_date: string;
  booking_time: string;
  service: {
    title: string;
  } | null;
  stylist: {
    name: string;
  } | null;
  status: string;
  confirmed: boolean;
  whatsapp_notifications: boolean;
};

async function fetchAppointments(filter = "all") {
  try {
    const { data, error } = await supabase.functions.invoke<Appointment[]>(
      'get-appointments',
      { body: { filter } }
    );
    
    if (error) {
      console.error('Error invoking get-appointments function:', error);
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching appointments:', error);
    return [];
  }
}

async function updateAppointmentStatus(appointmentId: string, status: string, confirmed: boolean) {
  try {
    const { data, error } = await supabase.functions.invoke(
      'update-appointment-status',
      { 
        body: { 
          appointment_id: appointmentId, 
          status_value: status,
          confirmed_value: confirmed
        } 
      }
    );
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error updating appointment status:', error);
    return false;
  }
}

async function deleteAppointment(appointmentId: string) {
  try {
    const { data, error } = await supabase.functions.invoke(
      'delete-appointment',
      { body: { appointment_id: appointmentId } }
    );
    
    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return { success: false, error };
  }
}

export default function AppointmentsList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [sendingNotification, setSendingNotification] = useState<string | null>(null);
  const [deletingAppointment, setDeletingAppointment] = useState<string | null>(null);
  const [searchParams] = useSearchParams();
  const highlightedAppointmentId = searchParams.get('id');
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    loadAppointments();
  }, [filter]);

  // Highlight scroll to appointment if ID is provided in URL
  useEffect(() => {
    if (highlightedAppointmentId && !isLoading) {
      const element = document.getElementById(`appointment-${highlightedAppointmentId}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        element.classList.add('bg-amber-100/10');
        setTimeout(() => {
          element.classList.remove('bg-amber-100/10');
        }, 3000);
      }
    }
  }, [highlightedAppointmentId, isLoading, appointments]);

  async function loadAppointments() {
    setIsLoading(true);
    try {
      const data = await fetchAppointments(filter);
      console.log("Appointments fetched:", data);
      setAppointments(data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les rendez-vous",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }

  async function handleUpdateAppointmentStatus(
    id: string, 
    status: string, 
    confirmed: boolean, 
    appointment: Appointment
  ) {
    try {
      const success = await updateAppointmentStatus(id, status, confirmed);

      if (success) {
        setAppointments(appointments.map(apt => 
          apt.id === id 
            ? { ...apt, status, confirmed } 
            : apt
        ));

        toast({
          title: "Succès",
          description: "Le statut du rendez-vous a été mis à jour",
        });
        
        // Create a notification about the status change
        await createAppointmentNotification(
          id,
          appointment.client_name,
          formatDate(appointment.booking_date),
          appointment.booking_time,
          status
        );
      } else {
        throw new Error("Failed to update appointment status");
      }
    } catch (error) {
      console.error('Error updating appointment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de mettre à jour le statut",
        variant: "destructive",
      });
    }
  }

  async function handleDeleteAppointment(id: string) {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer ce rendez-vous ?")) {
      return;
    }
    
    setDeletingAppointment(id);
    try {
      const result = await deleteAppointment(id);
      
      if (result.success) {
        setAppointments(appointments.filter(apt => apt.id !== id));
        
        toast({
          title: "Succès",
          description: "Le rendez-vous a été supprimé",
        });
      } else {
        throw new Error("Failed to delete appointment");
      }
    } catch (error) {
      console.error('Error deleting appointment:', error);
      toast({
        title: "Erreur",
        description: "Impossible de supprimer le rendez-vous",
        variant: "destructive",
      });
    } finally {
      setDeletingAppointment(null);
    }
  }

  async function confirmAppointmentWithWhatsApp(id: string, messageType: string = "confirmation") {
    setSendingNotification(id);
    try {
      const appointment = appointments.find(apt => apt.id === id);
      if (!appointment) {
        throw new Error("Appointment not found");
      }
      
      let result;
      
      if (messageType === "reminder") {
        result = await sendAppointmentReminder(id);
      } else {
        result = await sendAppointmentConfirmation(id);
      }
      
      if (result.success) {
        setAppointments(appointments.map(apt => 
          apt.id === id 
            ? { ...apt, status: 'confirmed', confirmed: true } 
            : apt
        ));
        
        toast({
          title: "Succès",
          description: messageType === "reminder" 
            ? "Le rappel WhatsApp a été envoyé" 
            : "La confirmation WhatsApp a été envoyée",
        });
        
        // Create a notification about the WhatsApp message
        await createAppointmentNotification(
          id,
          appointment.client_name,
          formatDate(appointment.booking_date),
          appointment.booking_time,
          messageType === "reminder" ? 'reminder' : 'confirmed'
        );
      }
    } catch (error) {
      console.error('Error sending WhatsApp:', error);
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer le message WhatsApp",
        variant: "destructive",
      });
    } finally {
      setSendingNotification(null);
    }
  }

  function formatDate(dateString: string) {
    try {
      return format(new Date(dateString), 'EEEE d MMMM yyyy', { locale: fr });
    } catch (error) {
      console.error('Invalid date:', dateString);
      return dateString;
    }
  }

  const handleOpenConfirmDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setConfirmDialogOpen(true);
  };

  const handleConfirmAppointment = async (id: string, messageType: string) => {
    await confirmAppointmentWithWhatsApp(id, messageType);
    setConfirmDialogOpen(false);
  };

  return (
    <AdminLayout>
      <div>
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-cabbelero-gold">Rendez-vous</h1>
          <div className="flex items-center gap-4">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-[180px] bg-cabbelero-gray border-cabbelero-gold/20">
                <SelectValue placeholder="Filtrer" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="today">Aujourd'hui</SelectItem>
                <SelectItem value="upcoming">À venir</SelectItem>
                <SelectItem value="confirmed">Confirmés</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              variant="outline" 
              className="border-cabbelero-gold text-cabbelero-gold hover:bg-cabbelero-gold hover:text-cabbelero-black"
              onClick={() => loadAppointments()}
            >
              Rafraîchir
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cabbelero-gold"></div>
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-12 flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-cabbelero-light/50 mb-4" />
            <p className="text-cabbelero-light opacity-70">Aucun rendez-vous trouvé</p>
          </div>
        ) : (
          <div className="rounded-md border border-cabbelero-gold/20 overflow-hidden">
            <Table>
              <TableHeader className="bg-cabbelero-gray">
                <TableRow>
                  <TableHead className="text-cabbelero-light">Date</TableHead>
                  <TableHead className="text-cabbelero-light">Heure</TableHead>
                  <TableHead className="text-cabbelero-light">Client</TableHead>
                  <TableHead className="text-cabbelero-light">Service</TableHead>
                  <TableHead className="text-cabbelero-light">Barbier</TableHead>
                  <TableHead className="text-cabbelero-light">Statut</TableHead>
                  <TableHead className="text-cabbelero-light">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {appointments.map((appointment) => (
                  <TableRow 
                    key={appointment.id} 
                    id={`appointment-${appointment.id}`}
                    className={`bg-cabbelero-black border-cabbelero-gray/20 transition-colors ${
                      highlightedAppointmentId === appointment.id ? 'bg-amber-100/10' : ''
                    }`}
                  >
                    <TableCell className="font-medium text-cabbelero-light">
                      {formatDate(appointment.booking_date)}
                    </TableCell>
                    <TableCell className="text-cabbelero-light">
                      {appointment.booking_time}
                    </TableCell>
                    <TableCell className="text-cabbelero-light">
                      <div>
                        <div>{appointment.client_name}</div>
                        <div className="text-sm text-cabbelero-light/70">{appointment.client_phone}</div>
                      </div>
                    </TableCell>
                    <TableCell className="text-cabbelero-light">
                      {appointment.service?.title || "Service inconnu"}
                    </TableCell>
                    <TableCell className="text-cabbelero-light">
                      {appointment.stylist?.name || "Barbier inconnu"}
                    </TableCell>
                    <TableCell>
                      <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${appointment.confirmed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'}`}>
                        {appointment.confirmed ? (
                          <CheckCircle className="w-3 h-3 mr-1" />
                        ) : (
                          <Clock className="w-3 h-3 mr-1" />
                        )}
                        {appointment.confirmed ? 'Confirmé' : 'En attente'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        {appointment.whatsapp_notifications && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                            disabled={sendingNotification === appointment.id}
                            onClick={() => handleOpenConfirmDialog(appointment)}
                            title="Message WhatsApp"
                          >
                            {sendingNotification === appointment.id ? (
                              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <MessageSquare className="w-4 h-4" />
                            )}
                          </Button>
                        )}
                        
                        {!appointment.confirmed && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'confirmed', true, appointment)}
                            title="Confirmer"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {appointment.confirmed && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-yellow-600 text-yellow-600 hover:bg-yellow-600 hover:text-white"
                            onClick={() => handleUpdateAppointmentStatus(appointment.id, 'pending', false, appointment)}
                            title="Remettre en attente"
                          >
                            <Clock className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                          onClick={() => handleUpdateAppointmentStatus(appointment.id, 'cancelled', false, appointment)}
                          title="Annuler"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                        
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                          onClick={() => handleDeleteAppointment(appointment.id)}
                          disabled={deletingAppointment === appointment.id}
                          title="Supprimer"
                        >
                          {deletingAppointment === appointment.id ? (
                            <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                          ) : (
                            <Trash2 className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <AppointmentConfirmDialog
          isOpen={confirmDialogOpen}
          onClose={() => setConfirmDialogOpen(false)}
          appointment={selectedAppointment}
          onConfirm={handleConfirmAppointment}
        />
      </div>
    </AdminLayout>
  );
}
