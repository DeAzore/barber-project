import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notifications";

export const createAppointmentNotification = async (
  userId: string,
  appointmentId: string,
  message: string
): Promise<Notification> => {
  try {
    const { data, error } = await supabase.functions.invoke('create-notification', {
      body: {
        userId,
        type: 'appointment',
        metadata: {
          appointmentId,
          message
        }
      }
    });

    if (error) throw new Error(error.message);
    return data as Notification;
  } catch (error) {
    console.error('Notification creation failed:', error);
    throw error;
  }
};

export const markAllNotificationsRead = async (userId: string): Promise<void> => {
  await supabase.functions.invoke('mark-all-notifications-read', {
    body: { userId }
  });
};

export const markNotificationRead = async (notificationId: string): Promise<void> => {
  await supabase.functions.invoke('mark-notification-read', {
    body: { notificationId }
  });
};
