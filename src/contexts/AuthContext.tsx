import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import { Loader2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";

// Define the profile type
export type Profile = {
  id: string;
  role: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
};

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  isAdmin: boolean;
  isStaff: boolean;
  profile: Profile | null;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  signIn: async () => {},
  signOut: async () => {},
  isAdmin: false,
  isStaff: false,
  profile: null,
  refreshProfile: async () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

const getUserRole = async (userId: string): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (error) throw error;
    return data?.role || "client";
  } catch (error) {
    console.error("Error fetching user role:", error);
    return "client";
  }
};

// Handle theme based on user preference or system preference
const setThemeBasedOnPreference = (isDark: boolean) => {
  if (isDark) {
    document.documentElement.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  } else {
    document.documentElement.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  }
};

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [userRole, setUserRole] = useState<string>("client");
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch user profile data
  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();
        
      if (error) {
        console.error("Error fetching profile:", error);
        return null;
      }
      
      return data as Profile;
    } catch (error) {
      console.error("Error in fetchProfile:", error);
      return null;
    }
  };
  
  // Function to refresh the profile data
  const refreshProfile = async () => {
    if (!user) return;
    
    try {
      const profileData = await fetchProfile(user.id);
      if (profileData) {
        setProfile(profileData);
        setUserRole(profileData.role);
      }
    } catch (error) {
      console.error("Error refreshing profile:", error);
    }
  };

  // Initialize theme preference
  useEffect(() => {
    // Get user's theme preference from localStorage or use system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      setThemeBasedOnPreference(savedTheme === 'dark');
    } else {
      setThemeBasedOnPreference(prefersDark);
    }
  }, []);

  // Initialize auth state
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      try {
        // Get user from session
        const { data } = await supabase.auth.getSession();
        const user = data?.session?.user || null;
        
        setUser(user);
        
        if (user) {
          // Fetch profile data
          const profileData = await fetchProfile(user.id);
          setProfile(profileData);
          
          const role = profileData?.role || await getUserRole(user.id);
          setUserRole(role);
          
          // For staff/admin users, set dark mode by default unless they have a preference
          if (role === "admin" || role === "staff") {
            const savedTheme = localStorage.getItem('theme');
            if (!savedTheme) {
              setThemeBasedOnPreference(true);
            }
          }
        }
      } catch (error) {
        console.error("Error during auth initialization:", error);
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const user = session?.user || null;
        setUser(user);
        
        if (user) {
          // Fetch profile data when auth state changes
          const profileData = await fetchProfile(user.id);
          setProfile(profileData);
          
          const role = profileData?.role || await getUserRole(user.id);
          setUserRole(role);
          
          // Redirect based on role after login
          if (event === 'SIGNED_IN') {
            if (role === 'admin' || role === 'staff') {
              navigate('/dashboard');
            } else {
              navigate('/profile');
            }
          }
        } else {
          setProfile(null);
          
          // Redirect to login after logout
          if (event === 'SIGNED_OUT') {
            navigate('/login');
          }
        }
      }
    );

    // Cleanup
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, [navigate]);

  // Restrict access to admin routes
  useEffect(() => {
    if (!isLoading) {
      // Check if trying to access dashboard without being logged in
      if (location.pathname.startsWith('/dashboard') && !user) {
        navigate('/login');
        return;
      }

      // Check if trying to access dashboard without proper role
      if (
        location.pathname.startsWith('/dashboard') &&
        user &&
        userRole !== 'admin' &&
        userRole !== 'staff'
      ) {
        navigate('/profile');
        toast({
          title: "Accès refusé",
          description: "Vous n'avez pas les permissions nécessaires pour accéder à cette page.",
          variant: "destructive",
        });
      }
    }
  }, [location.pathname, user, userRole, isLoading, navigate]);

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;
    } catch (error: any) {
      console.error("Error signing in:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-cabbelero-black">
        <Loader2 className="h-10 w-10 text-cabbelero-gold animate-spin" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        signIn,
        signOut,
        isAdmin: userRole === "admin",
        isStaff: userRole === "staff" || userRole === "admin",
        profile,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
