import { useAuth } from "@/contexts/AuthContext";
import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  BarChart3,
  Calendar,
  Clock,
  LogOut,
  MessageSquare,
  Settings,
  Star,
  Users,
  Scissors,
  Sun,
  Moon,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { NotificationsPopover } from "@/components/Notifications/NotificationsPopover";
import { Toggle } from "@/components/ui/toggle";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

interface AdminLayoutProps {
  children: ReactNode;
  requireAdmin?: boolean;
}

export default function AdminLayout({ 
  children, 
  requireAdmin = false 
}: AdminLayoutProps) {
  const { user, isLoading, isAdmin, isStaff, signOut } = useAuth();
  const location = useLocation();
  const currentPath = location.pathname;
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  useEffect(() => {
    // Check for saved theme preference in local storage
    const savedTheme = localStorage.getItem('cabbelero-theme');
    if (savedTheme) {
      setTheme(savedTheme as 'dark' | 'light');
    }
  }, []);

  useEffect(() => {
    // Apply theme class to document
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    
    // Save theme preference
    localStorage.setItem('cabbelero-theme', theme);
  }, [theme]);

  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cabbelero-gold"></div>
    </div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requireAdmin && !isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  if (!isStaff) {
    return <Navigate to="/" replace />;
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  const NavLink = ({ to, icon, label, isActive }: { to: string; icon: React.ReactNode; label: string; isActive: boolean }) => (
    <SidebarMenuItem>
      <Link to={to} className={`w-full ${isActive ? 'text-cabbelero-gold' : 'text-cabbelero-light'}`}>
        <div className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-cabbelero-black hover:text-cabbelero-gold transition-colors">
          {icon}
          <span>{label}</span>
        </div>
      </Link>
    </SidebarMenuItem>
  );

  return (
    <div className={`${theme === 'dark' ? 'bg-cabbelero-black' : 'bg-gray-100'} min-h-screen`}>
      <SidebarProvider defaultOpen={true}>
        <Sidebar className={theme === 'light' ? 'light-theme-sidebar' : ''}>
          <SidebarHeader className={`p-4 ${theme === 'light' ? 'bg-white border-b border-gray-200' : ''}`}>
            <div className="flex items-center gap-4">
              <NotificationsPopover />
              <div className={`${theme === 'dark' ? 'text-cabbelero-gold' : 'text-cabbelero-black'} font-serif text-2xl`}>
                Cabbelero
              </div>
              <SidebarTrigger />
              <div className="ml-auto">
                <Toggle 
                  aria-label="Toggle theme"
                  pressed={theme === 'light'}
                  onPressedChange={toggleTheme}
                  className={`p-2 ${theme === 'light' ? 'bg-gray-100' : 'bg-cabbelero-gray'}`}
                >
                  {theme === 'dark' ? (
                    <Sun className="h-4 w-4 text-cabbelero-gold" />
                  ) : (
                    <Moon className="h-4 w-4 text-cabbelero-black" />
                  )}
                </Toggle>
              </div>
            </div>
          </SidebarHeader>

          <SidebarContent className={theme === 'light' ? 'bg-white border-r border-gray-200' : ''}>
            <SidebarMenu>
              <NavLink 
                to="/dashboard"
                icon={<BarChart3 className="mr-2" />}
                label="Dashboard"
                isActive={currentPath === "/dashboard"}
              />

              <NavLink
                to="/dashboard/appointments" 
                icon={<Calendar className="mr-2" />}
                label="Rendez-vous"
                isActive={currentPath.includes("/dashboard/appointments")}
              />

              <NavLink
                to="/dashboard/clients" 
                icon={<Users className="mr-2" />}
                label="Clients"
                isActive={currentPath.includes("/dashboard/clients")}
              />

              <NavLink
                to="/dashboard/staff" 
                icon={<Scissors className="mr-2" />}
                label="Personnel"
                isActive={currentPath.includes("/dashboard/staff")}
              />

              <NavLink
                to="/dashboard/services" 
                icon={<Star className="mr-2" />}
                label="Services"
                isActive={currentPath.includes("/dashboard/services")}
              />

              <NavLink
                to="/dashboard/shifts" 
                icon={<Clock className="mr-2" />}
                label="Horaires"
                isActive={currentPath.includes("/dashboard/shifts")}
              />

              <NavLink
                to="/dashboard/reviews" 
                icon={<MessageSquare className="mr-2" />}
                label="Avis"
                isActive={currentPath.includes("/dashboard/reviews")}
              />

              {isAdmin && (
                <NavLink
                  to="/dashboard/settings" 
                  icon={<Settings className="mr-2" />}
                  label="Paramètres"
                  isActive={currentPath.includes("/dashboard/settings")}
                />
              )}
            </SidebarMenu>
          </SidebarContent>

          <SidebarFooter className={`p-4 ${theme === 'light' ? 'bg-white border-t border-gray-200' : ''}`}>
            <Button 
              variant={theme === 'light' ? 'outline' : 'outline'}
              className={`w-full flex items-center justify-center ${
                theme === 'light' 
                  ? 'border-cabbelero-black text-cabbelero-black hover:bg-gray-100' 
                  : 'border-cabbelero-gold text-cabbelero-gold hover:bg-cabbelero-black'
              }`}
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Déconnexion</span>
            </Button>
          </SidebarFooter>
        </Sidebar>

        <div className={`flex-1 p-6 lg:p-8 ml-[3rem] md:ml-64 transition-colors ${
          theme === 'light' ? 'text-gray-900' : 'text-cabbelero-light'
        }`}>
          {children}
        </div>
      </SidebarProvider>
    </div>
  );
}
