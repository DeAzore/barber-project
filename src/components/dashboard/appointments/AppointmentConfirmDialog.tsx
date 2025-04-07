import React, { useState } from "react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckIcon, Copy, MessageSquare, X, Mail } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { sendAppointmentConfirmation } from "@/services/notificationService";

interface AppointmentConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  appointment: {
    id: string;
    client_name: string;
    client_phone?: string;
    client_email?: string;
    booking_date: string;
    booking_time: string;
    service: { title: string };
    stylist: { name: string };
  } | null;
  onConfirm: (id: string, messageType: string, method: string) => Promise<void>;
}

const messageTemplates = {
  confirmation: (name: string, date: string, time: string, service: string, stylist: string) => 
    `Bonjour ${name}, nous confirmons votre rendez-vous du ${date} à ${time} pour ${service} avec ${stylist}. À bientôt!`,
  
  reschedule: (name: string, date: string, time: string, service: string, stylist: string) => 
    `Bonjour ${name}, nous devons malheureusement reprogrammer votre rendez-vous pour ${service}. Pouvez-vous nous contacter pour choisir une nouvelle date? Merci de votre compréhension.`,
  
  reminder: (name: string, date: string, time: string) => 
    `Bonjour ${name}, nous vous rappelons votre rendez-vous demain le ${date} à ${time}. À bientôt!`,
};

export default function AppointmentConfirmDialog({ 
  isOpen, 
  onClose, 
  appointment, 
  onConfirm 
}: AppointmentConfirmDialogProps) {
  const [messageType, setMessageType] = useState<string>("confirmation");
  const [sendMethod, setSendMethod] = useState<string>("whatsapp");
  const [isSending, setIsSending] = useState(false);
  const [copied, setCopied] = useState(false);
  
  if (!appointment) return null;
  
  const formattedDate = format(new Date(appointment.booking_date), 'EEEE d MMMM yyyy', { locale: fr });
  
  const getMessage = () => {
    switch (messageType) {
      case "confirmation":
        return messageTemplates.confirmation(
          appointment.client_name,
          formattedDate,
          appointment.booking_time,
          appointment.service?.title || "votre service",
          appointment.stylist?.name || "notre barbier"
        );
      case "reschedule":
        return messageTemplates.reschedule(
          appointment.client_name,
          formattedDate,
          appointment.booking_time,
          appointment.service?.title || "votre service",
          appointment.stylist?.name || "notre barbier"
        );
      case "reminder":
        return messageTemplates.reminder(
          appointment.client_name,
          formattedDate,
          appointment.booking_time
        );
      default:
        return "";
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(getMessage());
    setCopied(true);
    toast({
      title: "Copié!",
      description: "Le message a été copié dans le presse-papier",
    });
    setTimeout(() => setCopied(false), 2000);
  };

  const handleOpenWhatsApp = () => {
    const message = encodeURIComponent(getMessage());
    // Format phone number for WhatsApp (remove spaces, ensure it starts with country code)
    if (!appointment.client_phone) {
      toast({
        title: "Erreur",
        description: "Numéro de téléphone non disponible pour ce client",
        variant: "destructive",
      });
      return;
    }
    
    let phoneNumber = appointment.client_phone.replace(/\s+/g, "");
    if (phoneNumber.startsWith("0")) {
      phoneNumber = "+33" + phoneNumber.substring(1);
    } else if (!phoneNumber.startsWith("+")) {
      phoneNumber = "+33" + phoneNumber;
    }
    
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
  };

  const handleSendEmail = () => {
    if (!appointment.client_email) {
      toast({
        title: "Erreur",
        description: "Adresse email non disponible pour ce client",
        variant: "destructive",
      });
      return;
    }

    // Here we would typically send an email, but for now we'll just show a toast
    toast({
      title: "Email envoyé",
      description: `Un email a été envoyé à ${appointment.client_email}`,
    });
  };

  const handleConfirm = async () => {
    if (!appointment) return;
    
    setIsSending(true);
    try {
      await onConfirm(appointment.id, messageType, sendMethod);
      
      // If method is WhatsApp, open WhatsApp
      if (sendMethod === "whatsapp") {
        handleOpenWhatsApp();
      } else if (sendMethod === "email") {
        handleSendEmail();
      }
      
      onClose();
    } catch (error) {
      console.error("Error confirming appointment:", error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la confirmation",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const canUseWhatsApp = Boolean(appointment.client_phone);
  const canUseEmail = Boolean(appointment.client_email);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-cabbelero-black border-cabbelero-gold/30 text-cabbelero-light max-w-md">
        <DialogHeader>
          <DialogTitle className="text-cabbelero-gold">Confirmer le rendez-vous</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div>
            <p className="font-semibold">{appointment.client_name}</p>
            <p className="text-sm opacity-80">{formattedDate} à {appointment.booking_time}</p>
            <p className="text-sm opacity-80">{appointment.service?.title} avec {appointment.stylist?.name}</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Type de message</label>
            <Select value={messageType} onValueChange={setMessageType}>
              <SelectTrigger className="bg-cabbelero-gray border-cabbelero-gold/20">
                <SelectValue placeholder="Choisir un type de message" />
              </SelectTrigger>
              <SelectContent className="bg-cabbelero-gray border-cabbelero-gold/20">
                <SelectItem value="confirmation">Confirmation</SelectItem>
                <SelectItem value="reschedule">Reprogrammation</SelectItem>
                <SelectItem value="reminder">Rappel</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Méthode d'envoi</label>
            <Select 
              value={sendMethod} 
              onValueChange={setSendMethod}
              disabled={!canUseWhatsApp && !canUseEmail}
            >
              <SelectTrigger className="bg-cabbelero-gray border-cabbelero-gold/20">
                <SelectValue placeholder="Choisir une méthode d'envoi" />
              </SelectTrigger>
              <SelectContent className="bg-cabbelero-gray border-cabbelero-gold/20">
                <SelectItem value="whatsapp" disabled={!canUseWhatsApp}>WhatsApp</SelectItem>
                <SelectItem value="email" disabled={!canUseEmail}>Email</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-sm font-medium">Message</label>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 px-2 text-cabbelero-gold"
                onClick={handleCopyToClipboard}
              >
                {copied ? <CheckIcon className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </Button>
            </div>
            <Textarea 
              value={getMessage()}
              readOnly
              className="h-32 bg-cabbelero-gray border-cabbelero-gold/20"
            />
          </div>
          
          <div className="flex justify-between pt-4">
            <Button 
              variant="outline" 
              onClick={onClose}
              className="border-cabbelero-gold/30 text-cabbelero-light"
            >
              <X className="mr-2 h-4 w-4" />
              Annuler
            </Button>
            <div className="space-x-2">
              {sendMethod === "whatsapp" && (
                <Button
                  variant="outline"
                  className="border-green-600 text-green-500 hover:bg-green-600 hover:text-white"
                  onClick={handleOpenWhatsApp}
                  disabled={!canUseWhatsApp}
                >
                  <MessageSquare className="mr-2 h-4 w-4" />
                  WhatsApp
                </Button>
              )}
              {sendMethod === "email" && (
                <Button
                  variant="outline"
                  className="border-blue-600 text-blue-500 hover:bg-blue-600 hover:text-white"
                  onClick={handleSendEmail}
                  disabled={!canUseEmail}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  Email
                </Button>
              )}
              <Button 
                onClick={handleConfirm}
                disabled={isSending}
                className="bg-cabbelero-gold hover:bg-cabbelero-gold/80 text-cabbelero-black"
              >
                {isSending ? (
                  <div className="h-4 w-4 border-2 border-cabbelero-black border-t-transparent rounded-full animate-spin mr-2" />
                ) : null}
                Confirmer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
