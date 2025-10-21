import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, Search, ArrowLeft } from "lucide-react";
import { NetflixButton } from "@/components/ui/netflix-button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-radial from-netflix-red/20 to-transparent"></div>
      </div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center z-10 max-w-2xl mx-auto px-4"
      >
        {/* 404 Number */}
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-8xl md:text-9xl font-bold text-netflix-red mb-4 tracking-tight"
        >
          404
        </motion.h1>
        
        {/* Error Message */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="space-y-4 mb-8"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            Contenu introuvable
          </h2>
          <p className="text-lg text-white/80 leading-relaxed">
            Cette page n'existe pas ou a été déplacée. Explorez notre catalogue de films et séries exceptionnels.
          </p>
          <p className="text-sm text-white/60">
            Route demandée : <code className="bg-white/10 px-2 py-1 rounded text-netflix-red">{location.pathname}</code>
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <Link to="/home">
            <NetflixButton variant="netflix" size="lg" className="w-full sm:w-auto">
              <Home className="h-5 w-5 mr-2" />
              Accueil
            </NetflixButton>
          </Link>
          
          <Link to="/search">
            <NetflixButton variant="netflix-outline" size="lg" className="w-full sm:w-auto">
              <Search className="h-5 w-5 mr-2" />
              Rechercher
            </NetflixButton>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Page précédente
          </button>
        </motion.div>

        {/* Suggestions */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 p-6 bg-white/5 backdrop-blur-sm rounded-lg border border-white/10"
        >
          <h3 className="text-white font-semibold mb-3">Suggestions :</h3>
          <ul className="text-white/70 text-sm space-y-2 text-left">
            <li>• Vérifiez l'URL saisie</li>
            <li>• Retournez à l'accueil pour explorer notre catalogue</li>
            <li>• Utilisez la recherche pour trouver vos contenus préférés</li>
            <li>• Naviguez par genre depuis la page d'accueil</li>
          </ul>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default NotFound;
