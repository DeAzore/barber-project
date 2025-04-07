import { supabase } from "@/integrations/supabase/client";
import { Notification } from "@/types/notifications";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export const useNotifications = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const fetchNotifications = async (): Promise<Notification[]> => {
    if (!user) return [];

    try {
      const { data, error } = await supabase.functions.invoke('get-notifications', {
        body: { userId: user.id },
      });

      if (error) throw new Error(error.message);
      return data || [];
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  };

  const markNotificationAsRead = async (notificationId: string): Promise<Notification> => {
    try {
      const { data, error } = await supabase.functions.invoke('mark-notification-read', {
        body: { notificationId },
      });

      if (error) throw new Error(error.message);
      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  };

  const markAllAsRead = async (): Promise<void> => {
    try {
      const { error } = await supabase.functions.invoke('mark-all-notifications-read', {
        body: { userId: user?.id },
      });

      if (error) throw new Error(error.message);
    } catch (error) {
      console.error('Error marking all notifications as read:', error);
      throw error;
    }
  };

  const notificationsQuery = useQuery({
    queryKey: ['notifications', user?.id],
    queryFn: fetchNotifications,
    enabled: !!user,
    refetchInterval: 30000, // Refetch every 30 seconds
  });

  const markAsReadMutation = useMutation({
    mutationFn: markNotificationAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to mark notification as read: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: markAllAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications', user?.id] });
      toast({
        title: "Success",
        description: "All notifications marked as read",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to mark all notifications as read: ${error instanceof Error ? error.message : 'Unknown error'}`,
        variant: "destructive",
      });
    },
  });

  const unreadCount = notificationsQuery.data?.filter(n => !n.read).length || 0;
  
  return {
    notifications: notificationsQuery.data || [],
    unreadCount,
    isLoading: notificationsQuery.isLoading,
    error: notificationsQuery.error,
    refetch: notificationsQuery.refetch,
    markAsRead: markAsReadMutation.mutate,
    markAllAsRead: markAllAsReadMutation.mutate,
  };
};
