import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus } from 'lucide-react';
import { NetflixButton } from '@/components/ui/netflix-button';

export const GuestNavbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="fixed top-0 w-full z-50 bg-gradient-to-b from-background/90 to-transparent backdrop-blur-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/home" className="flex items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="text-2xl font-bold text-netflix-red"
            >
              NETFLIX
            </motion.div>
          </Link>

          {/* Boutons de connexion/inscription */}
          <div className="flex items-center space-x-4">
            <NetflixButton
              variant="ghost"
              size="sm"
              onClick={() => navigate("/login")}
              className="text-foreground hover:text-netflix-red"
            >
              <LogIn className="h-4 w-4 mr-2" />
              Connexion
            </NetflixButton>
            <NetflixButton
              variant="netflix"
              size="sm"
              onClick={() => navigate("/register")}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              S'inscrire
            </NetflixButton>
          </div>
        </div>
      </div>
    </nav>
  );
};
