import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto max-w-7xl px-4 md:px-8 flex items-center justify-center">
        <div className="text-center py-20">
          <h1 className="text-6xl md:text-7xl font-bold text-primary mb-4">
            404
          </h1>
          <p className="text-2xl text-foreground mb-2">Page not found</p>
          <p className="text-muted-foreground mb-8">
            Oops! The page you're looking for doesn't exist yet.
          </p>
          <Link to="/">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Return to Home
            </Button>
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
