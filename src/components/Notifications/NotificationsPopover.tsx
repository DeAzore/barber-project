import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Bell } from "lucide-react";
import { useNotifications } from "@/services/notificationsService";
import NotificationItem from "./NotificationItem";
import { Drawer, DrawerContent, DrawerTrigger } from "@/components/ui/drawer";
import { useIsMobile } from "@/hooks/use-mobile";
import { ScrollArea } from "@/components/ui/scroll-area";

export const NotificationsPopover = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const isMobile = useIsMobile();

  const hasNotifications = notifications.length > 0;
  const hasUnreadNotifications = unreadCount > 0;

  const NotificationsList = () => (
    <>
      <div className="px-4 py-2 border-b border-gray-700">
        <h3 className="font-semibold">Notifications</h3>
        <p className="text-sm opacity-70">
          {hasNotifications
            ? `Vous avez ${unreadCount} notifications non lues`
            : "Aucune notification"}
        </p>
      </div>
      <ScrollArea className="h-[500px] max-h-[50vh]">
        {hasNotifications ? (
          notifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkRead={markAsRead}
            />
          ))
        ) : (
          <div className="p-4 text-center text-sm opacity-70">
            Aucune notification pour le moment
          </div>
        )}
      </ScrollArea>
      {hasUnreadNotifications && (
        <div className="p-2 border-t border-gray-700 flex justify-center">
          <Button 
            variant="link" 
            className="text-xs"
            onClick={() => markAllAsRead()}
          >
            Marquer tout comme lu
          </Button>
        </div>
      )}
    </>
  );

  // Mobile drawer implementation
  if (isMobile) {
    return (
      <Drawer>
        <DrawerTrigger asChild>
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Button>
        </DrawerTrigger>
        <DrawerContent>
          <NotificationsList />
        </DrawerContent>
      </Drawer>
    );
  }

  // Desktop popover implementation
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 bg-cabbelero-black text-white border border-cabbelero-gold/20">
        <NotificationsList />
      </PopoverContent>
    </Popover>
  );
};
