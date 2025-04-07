import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function DarkModeToggle() {
  const { isAdmin, isStaff } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Get current theme from localStorage or default to system preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    // Determine if dark mode is active
    const isDark = savedTheme === 'dark' || (!savedTheme && prefersDarkMode);
    setIsDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    
    // Update DOM and localStorage
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  // For admin/staff show a different style
  const buttonClass = isAdmin || isStaff 
    ? "text-cabbelero-light/70 hover:text-cabbelero-gold" 
    : "text-slate-600 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white";

  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={toggleDarkMode}
      className={buttonClass}
      aria-label="Basculer le mode sombre"
    >
      {isDarkMode ? (
        <Sun className="h-5 w-5" />
      ) : (
        <Moon className="h-5 w-5" />
      )}
    </Button>
  );
}
