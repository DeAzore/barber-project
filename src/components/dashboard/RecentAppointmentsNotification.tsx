import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, MessageSquare, AlertTriangle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { sendAppointmentConfirmation } from "@/services/notificationService";
import { toast } from "@/hooks/use-toast";
import AppointmentConfirmDialog from "./appointments/AppointmentConfirmDialog";

interface Appointment {
  id: string;
  client_name: string;
  client_phone?: string;
  client_email?: string;
  booking_date: string;
  booking_time: string;
  service: {
    title: string;
  };
  stylist: {
    name: string;
  };
  status: string;
  confirmed: boolean;
  created_at: string;
}

export default function RecentAppointmentsNotification() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecentUnconfirmedAppointments();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('appointments-changes')
      .on('postgres_changes', { 
        event: '*', 
        schema: 'public', 
        table: 'bookings' 
      }, () => {
        // Refresh data when any change happens to bookings
        fetchRecentUnconfirmedAppointments();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchRecentUnconfirmedAppointments = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        'get-appointments',
        { body: { filter: "pending" } }
      );
      
      if (error) throw error;
      
      // Sort by created_at to show the newest first
      const sortedData = data ? [...data].sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }) : [];
      
      setAppointments(sortedData.slice(0, 3)); // Limit to the 3 most recent
    } catch (error) {
      console.error('Error fetching recent unconfirmed appointments:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleViewAppointment = (id: string) => {
    navigate(`/dashboard/appointments?id=${id}`);
  };

  const handleOpenConfirmDialog = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmAppointment = async (id: string, messageType: string, method: string) => {
    try {
      const result = await sendAppointmentConfirmation(id, messageType, method);
      
      if (result.success) {
        toast({
          title: "Rendez-vous confirmé",
          description: `Le rendez-vous a été ${messageType === "confirmation" ? "confirmé" : "mis à jour"} avec succès.`,
        });
        
        // Refresh appointments list
        fetchRecentUnconfirmedAppointments();
      }
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la confirmation du rendez-vous.",
        variant: "destructive",
      });
    }
  };

  if (appointments.length === 0 && !isLoading) return null;

  return (
    <>
      <Card className="border-cabbelero-gold/20 bg-cabbelero-gray mb-6 shadow-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-cabbelero-gold flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5" />
            Rendez-vous en attente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-16 bg-cabbelero-black/20 animate-pulse rounded" />
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map(appointment => (
                <div 
                  key={appointment.id}
                  className="p-3 bg-cabbelero-black/20 rounded-md"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium text-cabbelero-light">{appointment.client_name}</p>
                      <p className="text-sm text-cabbelero-light/70">
                        {appointment.service?.title} • {appointment.booking_date} à {appointment.booking_time}
                      </p>
                      <p className="text-xs text-cabbelero-light/50 mt-1">
                        Réservé {formatDistanceToNow(new Date(appointment.created_at), { 
                          addSuffix: true,
                          locale: fr 
                        })}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="h-8 border-green-600 text-green-600 hover:bg-green-600 hover:text-white"
                        onClick={() => handleOpenConfirmDialog(appointment)}
                      >
                        <MessageSquare className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Confirmer</span>
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 border-cabbelero-gold/60 text-cabbelero-gold hover:bg-cabbelero-gold hover:text-cabbelero-black"
                        onClick={() => handleViewAppointment(appointment.id)}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Voir</span>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
              <Button 
                variant="link" 
                className="text-cabbelero-gold hover:text-cabbelero-gold/80" 
                onClick={() => navigate('/dashboard/appointments?filter=pending')}
              >
                Voir tous les rendez-vous en attente
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
      
      <AppointmentConfirmDialog 
        isOpen={isConfirmDialogOpen}
        onClose={() => setIsConfirmDialogOpen(false)}
        appointment={selectedAppointment}
        onConfirm={handleConfirmAppointment}
      />
    </>
  );
}
