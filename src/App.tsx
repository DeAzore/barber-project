import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Services from "./pages/Services";
import Stylists from "./pages/Stylists";
import Booking from "./pages/Booking";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import Dashboard from "./pages/dashboard/Dashboard";
import AppointmentsList from "./pages/dashboard/AppointmentsList";
import StaffManagement from "./pages/dashboard/StaffManagement";
import ServicesManagement from "./pages/dashboard/ServicesManagement";
import ClientsList from "./pages/dashboard/ClientsList";
import ShiftsPage from "./pages/dashboard/ShiftsPage";
import SettingsPage from "./pages/dashboard/SettingsPage";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 30000,
      refetchOnWindowFocus: false,
    },
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/services" element={<Services />} />
            <Route path="/stylists" element={<Stylists />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile />} />
            
            {/* Dashboard Routes */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/appointments" element={<AppointmentsList />} />
            <Route path="/dashboard/staff" element={<StaffManagement />} />
            <Route path="/dashboard/services" element={<ServicesManagement />} />
            <Route path="/dashboard/clients" element={<ClientsList />} />
            <Route path="/dashboard/shifts" element={<ShiftsPage />} />
            <Route path="/dashboard/settings" element={<SettingsPage />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
