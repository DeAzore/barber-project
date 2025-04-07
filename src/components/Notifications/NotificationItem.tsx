import { Notification } from "@/types/notifications";
import { formatDistanceToNow } from "date-fns";
import { fr } from "date-fns/locale";
import { Check, Clock, AlertCircle, Calendar, Bell } from "lucide-react";
import { cn } from "@/lib/utils";

interface NotificationItemProps {
  notification: Notification;
  onMarkRead: (id: string) => void;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "appointment":
      return <Calendar className="h-5 w-5 text-blue-500" />;
    case "warning":
      return <AlertCircle className="h-5 w-5 text-amber-500" />;
    case "error":
      return <AlertCircle className="h-5 w-5 text-red-500" />;
    case "success":
      return <Check className="h-5 w-5 text-green-500" />;
    default:
      return <Bell className="h-5 w-5 text-cabbelero-gold" />;
  }
};

export default function NotificationItem({ notification, onMarkRead }: NotificationItemProps) {
  const handleMarkAsRead = () => {
    if (!notification.read) {
      onMarkRead(notification.id);
    }
  };

  return (
    <div 
      className={cn(
        "flex items-start gap-3 p-3 cursor-pointer border-b border-gray-700",
        notification.read ? "opacity-70" : "bg-cabbelero-gray"
      )}
      onClick={handleMarkAsRead}
    >
      <div className="mt-1">{getNotificationIcon(notification.type)}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold truncate">{notification.title}</p>
        <p className="text-sm opacity-80 line-clamp-2">{notification.content}</p>
        <div className="flex items-center gap-2 mt-1">
          <Clock className="h-3 w-3 opacity-60" />
          <span className="text-xs opacity-60">
            {formatDistanceToNow(new Date(notification.created_at), { 
              addSuffix: true,
              locale: fr 
            })}
          </span>
        </div>
      </div>
      {!notification.read && (
        <div className="h-3 w-3 rounded-full bg-blue-500"></div>
      )}
    </div>
  );
}
