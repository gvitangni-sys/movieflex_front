import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, X, Plus } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { NetflixButton } from '@/components/ui/netflix-button';
import { RootState } from '@/store/store';
import { favoritesService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

interface FavoriteMovie {
  _id: string;
  title: string;
  thumbnailUrl: string;
  year: number;
  rating: string;
  duration: string;
}

const MyList = () => {
  const { movies } = useSelector((state: RootState) => state.movies);
  const [favorites, setFavorites] = useState<FavoriteMovie[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      setLoading(true);
      const userFavorites = await favoritesService.getFavorites();
      setFavorites(userFavorites);
    } catch (error) {
      console.error('Erreur lors du chargement des favoris:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger vos favoris",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const removeFromList = async (movieId: string) => {
    try {
      await favoritesService.removeFromFavorites(movieId);
      setFavorites(prev => prev.filter(movie => movie._id !== movieId));
      toast({
        title: "Succès",
        description: "Film retiré de vos favoris",
      });
    } catch (error) {
      console.error('Erreur lors du retrait des favoris:', error);
      toast({
        title: "Erreur",
        description: "Impossible de retirer le film des favoris",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
            Ma liste
          </h1>
          <p className="text-white/80 mb-8">
            {favorites.length} {favorites.length === 1 ? 'titre' : 'titres'}
          </p>

          {loading ? (
            <div className="text-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
              <p className="text-white/70">Chargement de vos favoris...</p>
            </div>
          ) : favorites.length === 0 ? (
            <div className="text-center py-20">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mb-6"
              >
                <Plus className="h-16 w-16 text-white/40 mx-auto" />
              </motion.div>
              <h2 className="text-xl font-semibold text-white mb-4">
                Votre liste est vide
              </h2>
              <p className="text-white/70 mb-8 max-w-md mx-auto">
                Ajoutez des films et séries à votre liste pour les retrouver facilement plus tard.
              </p>
              <Link to="/home">
                <NetflixButton variant="netflix">
                  Explorer le catalogue
                </NetflixButton>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((movie, index) => (
                <motion.div
                  key={movie._id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group relative"
                >
                  <Link to={`/movie/${movie._id}`}>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-card">
                      <img
                        src={movie.thumbnailUrl}
                        alt={movie.title}
                        className="w-full h-full object-cover transition-transform group-hover:scale-110"
                        onError={(e) => {
                          e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjE0NCIgdmlld0JveD0iMCAwIDI1NiAxNDQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMTQ0IiBmaWxsPSIjMTExMTExIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2NjY2IiBmb250LXNpemU9IjE0Ij5JbWFnZSBub24gZGlzcG9uaWJsZTwvdGV4dD4KPC9zdmc+';
                        }}
                      />
                      
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="font-semibold text-white text-sm mb-1">
                            {movie.title}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-white/80 mb-2">
                            <span>{movie.year}</span>
                            <span>•</span>
                            <span>{movie.rating}</span>
                            <span>•</span>
                            <span>{movie.duration}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Link to={`/watch/${movie._id}`}>
                              <NetflixButton variant="ghost" size="icon" className="h-8 w-8">
                                <Play className="h-4 w-4" />
                              </NetflixButton>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                  
                  {/* Remove Button */}
                  <button
                    onClick={() => removeFromList(movie._id)}
                    title="Retirer des favoris"
                    className="absolute top-2 right-2 w-8 h-8 bg-black/60 hover:bg-black/80 rounded-full flex items-center justify-center text-white transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default MyList;
