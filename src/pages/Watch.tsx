import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import SecureVideoPlayer from "@/components/SecureVideoPlayer";
import { moviesService } from "@/services/api";
import { RootState } from "@/store/store";
import { useSubscriptionCheck } from "@/hooks/useAuth";

interface Movie {
  id: string;
  title: string;
  description?: string;
  genre?: string;
  year?: number;
  duration?: string;
  rating?: number;
  isFeatured?: boolean;
  thumbnailUrl?: string;
  requiresSubscription?: boolean;
  subscriptionLevel?: string;
  director?: string;
  cast?: string[];
  language?: string;
  ageRating?: string;
  quality?: string;
}

const Watch = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { hasActiveSubscription, subscriptionLevel } = useSubscriptionCheck();
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [streamingUrl, setStreamingUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Charger les données du film
  useEffect(() => {
    const loadMovie = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const response = await moviesService.getMovieById(id);
        console.log('Réponse API film:', response);
        
        // L'API retourne l'objet film dans response.movie
        setMovie(response.movie);
        
        // Charger l'URL de streaming
        const streamUrl = await moviesService.getStreamingUrl(id);
        setStreamingUrl(streamUrl);
      } catch (err) {
        console.error('Erreur lors du chargement du film:', err);
        setError('Film non trouvé');
        toast({
          title: "Erreur",
          description: "Impossible de charger le film",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadMovie();
  }, [id, toast]);

  // Vérifier les droits d'accès
  useEffect(() => {
    if (isLoading) return;

    if (!isAuthenticated || !user) {
      toast({
        title: "Connexion requise",
        description: "Vous devez être connecté pour regarder ce film",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    // Vérifier si l'utilisateur a le bon abonnement pour ce film
    if (movie && movie.requiresSubscription) {
      const userSubscription = subscriptionLevel || 'free';
      
      if (userSubscription === 'free' || 
          (movie.subscriptionLevel === 'premium' && userSubscription !== 'premium')) {
        toast({
          title: "Abonnement requis",
          description: `Un abonnement ${movie.subscriptionLevel} est requis pour regarder ce film`,
          variant: "destructive",
        });
        navigate('/');
        return;
      }
    }
  }, [user, isAuthenticated, isLoading, movie, navigate, toast, subscriptionLevel]);

  const handleTimeUpdate = (currentTime: number, duration: number) => {
    // Sauvegarder la progression (optionnel)
    console.log(`Progression: ${currentTime}/${duration}`);
  };

  const handleVideoEnded = () => {
    toast({
      title: "Film terminé",
      description: "Merci d'avoir regardé ce film!",
    });
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 text-white animate-spin mx-auto mb-4" />
          <p className="text-white">Chargement...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !movie) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Film non trouvé</h1>
          <p className="text-gray-400 mb-6">Le film demandé n'existe pas ou n'est plus disponible.</p>
          <Button onClick={() => navigate(isAuthenticated ? '/browse' : '/')} className="bg-netflix-red hover:bg-red-700">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  console.log('Film chargé:', movie);

  return (
    <div className="bg-black">
      {/* Header avec bouton retour - fixe en haut */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/90 to-transparent p-4">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={() => navigate(isAuthenticated ? '/browse' : '/')}
            className="text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Retour
          </Button>
          
          <div className="text-white text-right">
            <h1 className="text-lg font-semibold">{movie.title}</h1>
            <p className="text-sm text-gray-300">{movie.year} • {movie.duration}</p>
          </div>
        </div>
      </div>

      {/* Lecteur vidéo sécurisé - plein écran */}
      <div className="w-full h-screen">
        <SecureVideoPlayer
          videoUrl={streamingUrl}
          movieTitle={movie.title}
          movieId={movie.id}
          poster={movie.thumbnailUrl}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleVideoEnded}
        />
      </div>

      {/* Informations du film - dessous du player */}
      <div className="bg-black py-8">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h2 className="text-2xl font-bold text-white mb-4">{movie.title}</h2>
            <div className="flex items-center space-x-4 mb-6 text-gray-300">
              <span>{movie.year}</span>
              <span>•</span>
              <span>{movie.duration}</span>
              <span>•</span>
              <span className="bg-gray-700 px-2 py-1 rounded text-xs">{movie.ageRating || 'Tous publics'}</span>
              <span>•</span>
              <span className="bg-netflix-red px-2 py-1 rounded text-xs text-white">
                {movie.quality || 'HD'}
              </span>
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              {movie.description}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-white font-semibold mb-2">Genre</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.genre && (
                    <span className="bg-gray-700 px-3 py-1 rounded-full text-sm text-white">
                      {movie.genre}
                    </span>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="text-white font-semibold mb-2">Langue</h3>
                <p className="text-gray-300">{movie.language || 'Français'}</p>
              </div>
              
              {movie.director && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Réalisateur</h3>
                  <p className="text-gray-300">{movie.director}</p>
                </div>
              )}
              
              {movie.cast && (
                <div>
                  <h3 className="text-white font-semibold mb-2">Distribution</h3>
                  <p className="text-gray-300">
                    {Array.isArray(movie.cast) ? movie.cast.join(', ') : movie.cast}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Watch;
