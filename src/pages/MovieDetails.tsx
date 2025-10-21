import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { moviesService } from '@/services/api';
import { motion } from 'framer-motion';
import { Play, Plus, ArrowLeft, Star, Clock, Calendar } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { NetflixButton } from '@/components/ui/netflix-button';
import FavoriteButton from '@/components/ui/FavoriteButton';
import { RootState } from '@/store/store';

interface Movie {
  id: string | number;
  title: string;
  description: string;
  image: string;
  genre: string;
  year?: number;
  rating?: string | number;
  duration?: string;
}

const MovieDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { movies } = useSelector((state: RootState) => state.movies);
  const [movie, setMovie] = useState<Movie | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        if (!id) return;
        const data = await moviesService.getMovieById(id);
        const m = data.movie;
        const API = import.meta.env.VITE_API_BASE_URL;
        const adapted: Movie = {
          id: m.id,
          title: m.title,
          description: m.description,
          genre: m.genre,
          year: m.year,
          rating: m.rating,
          duration: m.duration,
          image: String(m.thumbnailUrl || '').startsWith('http') ? m.thumbnailUrl : `${API}${m.thumbnailUrl || ''}`,
        };
        setMovie(adapted);
      } catch (e) {
        console.error('Erreur chargement film:', e);
        // Recharger après 1 seconde en cas d'erreur
        setTimeout(() => {
          load();
        }, 1000);
      }
    };
    load();
  }, [id, navigate]);

  if (!movie) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-netflix-red"></div>
      </div>
    );
  }

  const similarMovies = movies
    .filter(m => m.genre === movie.genre && m.id !== movie.id)
    .slice(0, 6);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative h-[80vh] flex items-end">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${movie.image}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-transparent" />
        
        <div className="relative z-10 container mx-auto px-4 pb-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-3xl"
          >
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Retour
            </button>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
              {movie.title}
            </h1>
            
            <div className="flex items-center gap-4 text-white/80 mb-6">
              {movie.year && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{movie.year}</span>
                </div>
              )}
              {movie.duration && (
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  <span>{movie.duration}</span>
                </div>
              )}
              {movie.rating && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>{movie.rating}</span>
                </div>
              )}
              <div className="px-2 py-1 bg-netflix-red text-white text-sm rounded">
                {movie.genre}
              </div>
            </div>
            
            <p className="text-lg text-white/90 mb-8 leading-relaxed max-w-2xl">
              {movie.description}
            </p>
            
            <div className="flex gap-4">
              <Link to={`/watch/${movie.id}`}>
                <NetflixButton variant="hero" size="xl">
                  <Play className="h-6 w-6 mr-2" />
                  Regarder maintenant
                </NetflixButton>
              </Link>
              
              <FavoriteButton 
                movieId={String(movie.id)} 
                size="lg" 
                variant="secondary"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Description détaillée */}
      <section className="container mx-auto px-4 py-12">
        <div className="max-w-4xl">
          <h2 className="text-2xl font-bold text-white mb-4">À propos de ce film</h2>
          <p className="text-lg text-white/80 leading-relaxed">
            {movie.description}
          </p>
        </div>
      </section>

      {/* Films similaires */}
      {similarMovies.length > 0 && (
        <section className="container mx-auto px-4 pb-20">
          <h2 className="text-2xl font-bold text-white mb-6">Films similaires</h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {similarMovies.map((similarMovie) => (
              <motion.div
                key={similarMovie.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link to={`/movie/${similarMovie.id}`}>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-card">
                    <img
                      src={similarMovie.image}
                      alt={similarMovie.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      onContextMenu={(e) => e.preventDefault()}
                      onError={(e) => {
                        e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjE0NCIgdmlld0JveD0iMCAwIDI1NiAxNDQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMTQ0IiBmaWxsPSIjMTExMTExIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2NjY2IiBmb250LXNpemU9IjE0Ij5JbWFnZSBub24gZGlzcG9uaWJsZTwvdGV4dD4KPC9zdmc+';
                      }}
                    />
                    
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-0 left-0 right-0 p-3">
                        <h3 className="font-medium text-white text-sm">
                          {similarMovie.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default MovieDetails;
