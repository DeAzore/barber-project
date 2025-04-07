import AdminLayout from "@/layouts/AdminLayout";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, Calendar, Users, Scissors, AlertCircle } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/hooks/use-toast";
import RecentAppointmentsNotification from "@/components/dashboard/RecentAppointmentsNotification";

type DashboardStats = {
  bookingsToday: number;
  bookingsWeek: number;
  totalClients: number;
  totalStylists: number;
};

type DashboardStatsResponse = {
  bookings_today: number;
  bookings_week: number;
  total_clients: number;
  total_stylists: number;
};

// Function to fetch dashboard stats
async function fetchDashboardStats() {
  try {
    console.log("Fetching dashboard stats...");
    const { data, error } = await supabase.functions.invoke<DashboardStatsResponse>(
      'get-dashboard-stats'
    );
    
    if (error) {
      console.error("Error invoking get-dashboard-stats:", error);
      throw error;
    }
    
    console.log("Dashboard stats received:", data);
    return data || { 
      bookings_today: 0, 
      bookings_week: 0, 
      total_clients: 0, 
      total_stylists: 0 
    };
  } catch (error) {
    console.error('Error in fetchDashboardStats:', error);
    toast({
      title: "Erreur",
      description: "Impossible de charger les statistiques du dashboard",
      variant: "destructive",
    });
    return { 
      bookings_today: 0, 
      bookings_week: 0, 
      total_clients: 0, 
      total_stylists: 0 
    };
  }
}

// Function to fetch recent appointments
async function fetchRecentAppointments() {
  try {
    const { data, error } = await supabase.functions.invoke('get-appointments', {
      body: { filter: "upcoming", limit: 5 }
    });
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent appointments:', error);
    return [];
  }
}

export default function Dashboard() {
  const { isAdmin } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    bookingsToday: 0,
    bookingsWeek: 0,
    totalClients: 0,
    totalStylists: 0
  });
  const [recentAppointments, setRecentAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setIsLoading(true);
      try {
        // Fetch stats and recent appointments in parallel
        const [statsData, appointmentsData] = await Promise.all([
          fetchDashboardStats(),
          fetchRecentAppointments()
        ]);
        
        setStats({
          bookingsToday: statsData.bookings_today || 0,
          bookingsWeek: statsData.bookings_week || 0,
          totalClients: statsData.total_clients || 0,
          totalStylists: statsData.total_stylists || 0
        });
        
        setRecentAppointments(appointmentsData);
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    loadDashboardData();
    
    // Subscribe to realtime changes
    const channel = supabase
      .channel('dashboard-changes')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'bookings' 
      }, () => {
        // Refresh data when a new appointment is created
        loadDashboardData();
      })
      .subscribe();
      
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <AdminLayout>
      <div>
        <h1 className="text-2xl font-bold text-cabbelero-gold mb-6">Tableau de bord</h1>
        
        {/* Recent unconfirmed appointments notification */}
        <RecentAppointmentsNotification />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-cabbelero-gray border-cabbelero-gold/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-cabbelero-light">
                Rendez-vous aujourd'hui
              </CardTitle>
              <Calendar className="h-5 w-5 text-cabbelero-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cabbelero-gold">
                {isLoading ? (
                  <div className="h-8 w-16 bg-cabbelero-black/20 animate-pulse rounded" />
                ) : (
                  stats.bookingsToday
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-cabbelero-gray border-cabbelero-gold/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-cabbelero-light">
                Rendez-vous cette semaine
              </CardTitle>
              <BarChart3 className="h-5 w-5 text-cabbelero-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cabbelero-gold">
                {isLoading ? (
                  <div className="h-8 w-16 bg-cabbelero-black/20 animate-pulse rounded" />
                ) : (
                  stats.bookingsWeek
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-cabbelero-gray border-cabbelero-gold/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-cabbelero-light">
                Clients
              </CardTitle>
              <Users className="h-5 w-5 text-cabbelero-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cabbelero-gold">
                {isLoading ? (
                  <div className="h-8 w-16 bg-cabbelero-black/20 animate-pulse rounded" />
                ) : (
                  stats.totalClients
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-cabbelero-gray border-cabbelero-gold/20">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-sm font-medium text-cabbelero-light">
                Barbiers
              </CardTitle>
              <Scissors className="h-5 w-5 text-cabbelero-gold" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-cabbelero-gold">
                {isLoading ? (
                  <div className="h-8 w-16 bg-cabbelero-black/20 animate-pulse rounded" />
                ) : (
                  stats.totalStylists
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Appointments */}
        <div className="mt-8">
          <h2 className="text-xl text-cabbelero-gold font-medium mb-4">
            Rendez-vous récents
          </h2>
          <Card className="bg-cabbelero-gray border-cabbelero-gold/20">
            <CardContent className="p-4">
              {isLoading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-cabbelero-black/20 animate-pulse rounded" />
                  ))}
                </div>
              ) : recentAppointments && recentAppointments.length > 0 ? (
                <div className="space-y-3">
                  {recentAppointments.map((appointment: any) => (
                    <div key={appointment.id} className="p-3 bg-cabbelero-black/40 rounded-md flex justify-between items-center">
                      <div>
                        <p className="text-cabbelero-light font-medium">{appointment.client_name}</p>
                        <p className="text-cabbelero-light/70 text-sm">
                          {appointment.booking_date} à {appointment.booking_time}
                        </p>
                      </div>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium
                        ${appointment.confirmed 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'}`}>
                        {appointment.confirmed ? 'Confirmé' : 'En attente'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8">
                  <AlertCircle className="h-10 w-10 text-cabbelero-light/30 mb-3" />
                  <p className="text-cabbelero-light/70">Aucun rendez-vous récent</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Performance Stats */}
        {isAdmin && (
          <div className="mt-8">
            <h2 className="text-xl text-cabbelero-gold font-medium mb-4">
              Performance
            </h2>
            <Card className="bg-cabbelero-gray border-cabbelero-gold/20">
              <div className="p-4">
                {isLoading ? (
                  <div className="h-32 bg-cabbelero-black/20 animate-pulse rounded" />
                ) : (
                  <div className="flex flex-col items-center justify-center py-8">
                    <AlertCircle className="h-10 w-10 text-cabbelero-light/30 mb-3" />
                    <p className="text-cabbelero-light/70">Les statistiques de performance seront disponibles prochainement</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
