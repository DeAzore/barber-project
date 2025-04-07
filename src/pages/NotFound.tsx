import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[60vh] flex items-center justify-center bg-salon-cream">
        <div className="text-center p-8">
          <h1 className="text-6xl font-serif text-salon-dark mb-4">404</h1>
          <p className="text-xl text-salon-blue mb-6">Oops! Page introuvable</p>
          <p className="text-gray-600 mb-8 max-w-md">
            La page que vous recherchez n'existe pas ou a été déplacée.
          </p>
          <Link to="/">
            <Button className="bg-salon-blue hover:bg-salon-blue/90">
              <Home className="mr-2 h-4 w-4" />
              Retour à l'accueil
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
