export interface Notification {
  id: string;
  user_id: string;
  type: 'appointment' | 'system' | 'reminder';
  title: string;
  message: string;
  metadata: {
    appointmentId?: string;
    link?: string;
  };
  read: boolean;
  created_at: string;
  updated_at: string;
}
