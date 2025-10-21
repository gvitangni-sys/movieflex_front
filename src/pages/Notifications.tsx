import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Bell, Calendar, CheckCircle, AlertTriangle } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { NetflixButton } from '@/components/ui/netflix-button';
import { RootState } from '@/store/store';
import { useToast } from '@/hooks/use-toast';
import { notificationsService } from '@/services/api';

interface Notification {
  _id: string;
  type: 'subscription_renewal' | 'system' | 'promotion';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  expiresAt?: string;
  actionUrl?: string;
}

const Notifications = () => {
  const { user } = useSelector((state: RootState) => state.auth);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const notificationsData = await notificationsService.getNotifications();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Erreur lors du chargement des notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    try {
      await notificationsService.markAsRead(notificationId);
      setNotifications(prev => 
        prev.map(notif => 
          notif._id === notificationId ? { ...notif, isRead: true } : notif
        )
      );
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer la notification comme lue",
        variant: "destructive",
      });
    }
  };

  const markAllAsRead = async () => {
    try {
      await notificationsService.markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, isRead: true }))
      );
      toast({
        title: "Succès",
        description: "Toutes les notifications ont été marquées comme lues",
      });
    } catch (error) {
      console.error('Erreur lors du marquage de toutes les notifications:', error);
      toast({
        title: "Erreur",
        description: "Impossible de marquer toutes les notifications comme lues",
        variant: "destructive",
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'subscription_renewal':
        return <Calendar className="h-5 w-5 text-yellow-500" />;
      case 'system':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'promotion':
        return <AlertTriangle className="h-5 w-5 text-green-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'subscription_renewal':
        return 'border-l-yellow-500 bg-yellow-500/5';
      case 'system':
        return 'border-l-blue-500 bg-blue-500/5';
      case 'promotion':
        return 'border-l-green-500 bg-green-500/5';
      default:
        return 'border-l-gray-500 bg-gray-500/5';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Aujourd'hui";
    if (diffDays === 1) return 'Hier';
    if (diffDays < 7) return `Il y a ${diffDays} jours`;
    if (diffDays < 30) return `Il y a ${Math.floor(diffDays / 7)} semaines`;
    return date.toLocaleDateString('fr-FR');
  };

  const unreadCount = notifications.filter(notif => !notif.isRead).length;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <Link to="/home">
                <NetflixButton variant="ghost" size="icon">
                  <ArrowLeft className="h-5 w-5" />
                </NetflixButton>
              </Link>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  Notifications
                </h1>
                <p className="text-white/80">
                  {unreadCount > 0 
                    ? `${unreadCount} notification${unreadCount > 1 ? 's' : ''} non lue${unreadCount > 1 ? 's' : ''}`
                    : 'Toutes les notifications sont lues'
                  }
                </p>
              </div>
            </div>

            {unreadCount > 0 && (
              <NetflixButton 
                variant="netflix-outline" 
                onClick={markAllAsRead}
                className="hidden md:flex"
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Tout marquer comme lu
              </NetflixButton>
            )}
          </div>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-white/70">Chargement des notifications...</p>
            </div>
          ) : notifications.length === 0 ? (
            <div className="text-center py-20">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-6"
              >
                <Bell className="h-16 w-16 text-white/40 mx-auto" />
              </motion.div>
              <h2 className="text-xl font-semibold text-white mb-4">
                Aucune notification
              </h2>
              <p className="text-white/70 mb-8 max-w-md mx-auto">
                Vous serez notifié ici des renouvellements d'abonnement et des actualités importantes.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Bouton "Tout marquer comme lu" pour mobile */}
              {unreadCount > 0 && (
                <div className="md:hidden">
                  <NetflixButton 
                    variant="netflix-outline" 
                    onClick={markAllAsRead}
                    className="w-full"
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Tout marquer comme lu
                  </NetflixButton>
                </div>
              )}

              {/* Liste des notifications */}
              {notifications.map((notification, index) => (
                <motion.div
                  key={notification._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`border-l-4 rounded-r-lg p-4 transition-all duration-200 ${
                    notification.isRead 
                      ? 'bg-card/50 border-l-gray-400' 
                      : `${getNotificationColor(notification.type)} border-l-4`
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className={`font-semibold ${
                          notification.isRead ? 'text-white/80' : 'text-white'
                        }`}>
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-netflix-red rounded-full flex-shrink-0 mt-2 ml-2"></div>
                        )}
                      </div>
                      
                      <p className="text-white/70 mb-3 leading-relaxed">
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-white/50">
                          {formatDate(notification.createdAt)}
                        </span>
                        
                        <div className="flex items-center gap-2">
                          {notification.actionUrl && (
                            <Link to={notification.actionUrl}>
                              <NetflixButton variant="ghost" size="sm">
                                Voir
                              </NetflixButton>
                            </Link>
                          )}
                          
                          {!notification.isRead && (
                            <NetflixButton 
                              variant="netflix-outline" 
                              size="sm"
                              onClick={() => markAsRead(notification._id)}
                            >
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Lu
                            </NetflixButton>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Notifications;
