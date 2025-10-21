import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Play, Info, Plus, LogIn, UserPlus } from "lucide-react";
import { MainNavbar } from "@/components/layout/MainNavbar";
import { NetflixButton } from "@/components/ui/netflix-button";
import { RootState } from "@/store/store";
import { setMovies } from "@/store/slices/moviesSlice";
import { moviesService } from "@/services/api";
import { useToast } from "@/hooks/use-toast";
import { useAuthCheck } from "@/hooks/useAuth";

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { movies, featuredMovie } = useSelector(
    (state: RootState) => state.movies
  );
  const { isAuthenticated, user } = useSelector(
    (state: RootState) => state.auth
  );
  const { isAuthenticated: authChecked } = useAuthCheck();

  const loadMovies = async () => {
    try {
      const data = await moviesService.getMovies();
      // Adapter le format attendu par le slice si nécessaire
      const API = import.meta.env.VITE_API_BASE_URL;
      const adapted = data.movies.map(
        (m: {
          id: string;
          title: string;
          description: string;
          genre: string;
          year: number;
          rating: string;
          duration: string;
          thumbnailUrl?: string;
        }) => ({
          id: m.id,
          title: m.title,
          description: m.description,
          genre: m.genre,
          year: m.year,
          rating: m.rating,
          duration: m.duration,
          image: String(m.thumbnailUrl || "").startsWith("http")
            ? m.thumbnailUrl
            : `${API}${m.thumbnailUrl || ""}`,
        })
      );
      dispatch(setMovies(adapted));
    } catch (e) {
      console.error("Erreur chargement films:", e);
    }
  };

  useEffect(() => {
    loadMovies();
  }, [dispatch]);

  const getMoviesByGenre = (genre: string) => {
    return movies.filter((movie) => movie.genre === genre);
  };

  const genres = [...new Set(movies.map((movie) => movie.genre))];

  const handleMovieClick = (movieId: string) => {
    if (!isAuthenticated) {
      // Rediriger directement vers la page de connexion
      navigate("/login");
      return;
    }

    if (!user?.isSubscriptionActive || user?.subscription === "free") {
      toast({
        title: "Abonnement requis",
        description:
          "Vous devez avoir un abonnement actif pour regarder ce film. Veuillez souscrire à un abonnement.",
        variant: "destructive",
      });
      navigate("/payment");
      return;
    }

    navigate(`/watch/${movieId}`);
  };

  const handleMovieDetailsClick = (movieId: string) => {
    if (!isAuthenticated) {
      // Rediriger directement vers la page de connexion
      navigate("/login");
      return;
    }
    navigate(`/movie/${movieId}`);
  };

  const handleWatchFeatured = () => {
    if (!featuredMovie) return;
    handleMovieClick(featuredMovie.id);
  };

  if (!featuredMovie) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Utiliser la navbar principale qui choisit automatiquement */}
      <MainNavbar />

      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url('${featuredMovie.image}')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-overlay" />

        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-2xl">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-4xl md:text-6xl font-bold text-white mb-4"
            >
              {featuredMovie.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-white/90 mb-6 leading-relaxed"
            >
              {featuredMovie.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <button
                onClick={handleWatchFeatured}
                className="w-full sm:w-auto"
              >
                <NetflixButton
                  variant="hero"
                  size="xl"
                  className="w-full sm:w-auto justify-center"
                >
                  <Play className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                  Regarder
                </NetflixButton>
              </button>

              <button
                onClick={() => handleMovieDetailsClick(featuredMovie.id)}
                className="w-full sm:w-auto"
              >
                <NetflixButton
                  variant="secondary"
                  size="xl"
                  className="w-full sm:w-auto justify-center"
                >
                  <Info className="h-5 w-5 sm:h-6 sm:w-6 mr-2" />
                  Plus d'infos
                </NetflixButton>
              </button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      <div className="relative z-10 -mt-32 space-y-12 pb-20">
        {genres.map((genre, genreIndex) => {
          const genreMovies = getMoviesByGenre(genre);
          if (genreMovies.length === 0) return null;

          return (
            <motion.section
              key={genre}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: genreIndex * 0.1 }}
              className="container mx-auto px-4"
            >
              <h2 className="text-2xl font-bold text-white mb-6">{genre}</h2>

              <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                {genreMovies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    className="flex-shrink-0 group"
                  >
                    <button
                      onClick={() => handleMovieDetailsClick(movie.id)}
                      className="w-full text-left"
                    >
                      <div className="relative w-64 h-36 rounded-lg overflow-hidden bg-gradient-card">
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          onContextMenu={(e) => e.preventDefault()}
                          onError={(e) => {
                            e.currentTarget.src =
                              "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjE0NCIgdmlld0JveD0iMCAwIDI1NiAxNDQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMTQ0IiBmaWxsPSIjMTExMTExIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2NjY2IiBmb250LXNpemU9IjE0Ij5JbWFnZSBub24gZGlzcG9uaWJsZTwvdGV4dD4KPC9zdmc+";
                          }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h3 className="font-semibold text-white text-sm mb-1">
                              {movie.title}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-white/80">
                              <span>{movie.year}</span>
                              <span>•</span>
                              <span>{movie.rating}</span>
                              <span>•</span>
                              <span>{movie.duration}</span>
                            </div>
                          </div>

                          <div className="absolute top-2 right-2">
                            <NetflixButton
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Plus className="h-4 w-4" />
                            </NetflixButton>
                          </div>
                        </div>
                      </div>
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.section>
          );
        })}
      </div>
    </div>
  );
};

export default Home;
