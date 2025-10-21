import { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { favoritesService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { NetflixButton } from './netflix-button';

interface FavoriteButtonProps {
  movieId: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'netflix' | 'netflix-outline' | 'secondary' | 'hero';
}

const FavoriteButton = ({ movieId, size = 'md', variant = 'ghost' }: FavoriteButtonProps) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkFavoriteStatus();
  }, [movieId]);

  const checkFavoriteStatus = async () => {
    try {
      const isInFavorites = await favoritesService.isInFavorites(movieId);
      setIsFavorite(isInFavorites);
    } catch (error) {
      console.error('Erreur lors de la vérification des favoris:', error);
    }
  };

  const handleToggleFavorite = async () => {
    if (loading) return;
    
    try {
      setLoading(true);
      
      if (isFavorite) {
        await favoritesService.removeFromFavorites(movieId);
        setIsFavorite(false);
        toast({
          title: "Retiré des favoris",
          description: "Film retiré de votre liste",
        });
      } else {
        await favoritesService.addToFavorites(movieId);
        setIsFavorite(true);
        toast({
          title: "Ajouté aux favoris",
          description: "Film ajouté à votre liste",
        });
      }
    } catch (error) {
      console.error('Erreur lors de la modification des favoris:', error);
      toast({
        title: "Erreur",
        description: "Impossible de modifier vos favoris",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm': return 'h-8 w-8';
      case 'lg': return 'h-12 w-12';
      default: return 'h-10 w-10';
    }
  };

  const getIconSize = () => {
    switch (size) {
      case 'sm': return 'h-3 w-3';
      case 'lg': return 'h-5 w-5';
      default: return 'h-4 w-4';
    }
  };

  return (
    <NetflixButton
      variant={variant}
      size="icon"
      className={`${getButtonSize()} ${isFavorite ? 'text-red-500 hover:text-red-400' : 'text-white hover:text-red-500'}`}
      onClick={handleToggleFavorite}
      disabled={loading}
      title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
    >
      <Heart 
        className={getIconSize()} 
        fill={isFavorite ? "currentColor" : "none"}
      />
    </NetflixButton>
  );
};

export default FavoriteButton;
