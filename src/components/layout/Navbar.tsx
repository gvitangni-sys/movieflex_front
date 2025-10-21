import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { Search, Bell, User, LogOut, Menu, X } from 'lucide-react';
import { RootState } from '@/store/store';
import { logout } from '@/store/slices/authSlice';
import { NetflixButton } from '@/components/ui/netflix-button';
import { useToast } from '@/hooks/use-toast';
import { notificationsService } from '@/services/api';

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const count = await notificationsService.getUnreadCount();
        setUnreadCount(count);
      } catch (error) {
        console.error('Erreur lors de la récupération du compteur de notifications:', error);
      }
    };

    if (user) {
      fetchUnreadCount();
      // Rafraîchir le compteur toutes les 30 secondes
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => clearInterval(interval);
    }
  }, [user]);

  const handleLogout = () => {
    dispatch(logout());
    toast({
      title: "Déconnexion",
      description: "À bientôt sur Netflix !",
    });
    navigate('/login');
  };

  const navItems = [
    { name: 'Accueil', path: '/home' },
    { name: 'Parcourir', path: '/browse' },
    { name: 'Ma liste', path: '/my-list' },
  ];

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

          {/* Navigation Desktop */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-foreground hover:text-netflix-red transition-colors"
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Recherche */}
            <Link to="/search">
              <NetflixButton variant="ghost" size="icon">
                <Search className="h-5 w-5" />
              </NetflixButton>
            </Link>

            {/* Notifications */}
            <Link to="/notifications">
              <NetflixButton variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                {/* Badge de notification */}
                {unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-netflix-red rounded-full animate-pulse"></div>
                )}
              </NetflixButton>
            </Link>

            {/* Profil */}
            <div className="relative">
              <NetflixButton
                variant="ghost"
                size="icon"
                onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              >
                <User className="h-5 w-5" />
              </NetflixButton>

              {isProfileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-card border border-netflix-light-gray"
                >
                  <div className="p-3 border-b border-netflix-light-gray">
                    <div className="font-medium text-foreground">{user?.email}</div>
                    <div className="text-sm text-muted-foreground">Abonné</div>
                  </div>
                  
                  <div className="p-1">
                    <Link
                      to="/profile"
                      className="flex items-center gap-2 w-full p-2 text-left hover:bg-netflix-gray rounded"
                      onClick={() => setIsProfileMenuOpen(false)}
                    >
                      <User className="h-4 w-4" />
                      Mon profil
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full p-2 text-left hover:bg-netflix-gray rounded text-destructive"
                    >
                      <LogOut className="h-4 w-4" />
                      Se déconnecter
                    </button>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Menu mobile */}
            <div className="md:hidden">
              <NetflixButton
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </NetflixButton>
            </div>
          </div>
        </div>

        {/* Menu mobile */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="md:hidden bg-card/95 backdrop-blur-sm rounded-lg mt-2 mb-4"
          >
            <div className="p-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="block py-2 text-foreground hover:text-netflix-red transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </nav>
  );
};
