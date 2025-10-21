import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search as SearchIcon, Play } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { Input } from '@/components/ui/input';
import { NetflixButton } from '@/components/ui/netflix-button';
import { RootState } from '@/store/store';

const Search = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredMovies, setFilteredMovies] = useState<any[]>([]);
  const { movies } = useSelector((state: RootState) => state.movies);

  useEffect(() => {
    if (searchQuery.trim()) {
      const filtered = movies.filter(movie =>
        movie.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        movie.genre.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMovies(filtered);
    } else {
      setFilteredMovies([]);
    }
  }, [searchQuery, movies]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto mb-8"
        >
          <h1 className="text-3xl font-bold text-foreground mb-6 text-center">
            Rechercher un film ou une série
          </h1>
          
          <div className="relative">
            <SearchIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Titre, genre, description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg bg-netflix-gray border-netflix-light-gray"
            />
          </div>
        </motion.div>

        {/* Résultats de recherche */}
        {searchQuery && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-foreground">
              {filteredMovies.length} résultat{filteredMovies.length !== 1 ? 's' : ''} pour "{searchQuery}"
            </h2>
            
            {filteredMovies.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredMovies.map((movie, index) => (
                  <motion.div
                    key={movie.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link to={`/movie/${movie.id}`}>
                      <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-card">
                        <img
                          src={movie.image}
                          alt={movie.title}
                          className="w-full h-full object-cover transition-transform group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjU2IiBoZWlnaHQ9IjE0NCIgdmlld0JveD0iMCAwIDI1NiAxNDQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyNTYiIGhlaWdodD0iMTQ0IiBmaWxsPSIjMTExMTExIi8+Cjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmaWxsPSIjNjY2NjY2IiBmb250LXNpemU9IjE0Ij5JbWFnZSBub24gZGlzcG9uaWJsZTwvdGV4dD4KPC9zdmc+';
                          }}
                        />
                        
                        <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="absolute inset-0 flex items-center justify-center">
                            <NetflixButton variant="netflix" size="icon" className="h-12 w-12">
                              <Play className="h-6 w-6" />
                            </NetflixButton>
                          </div>
                        </div>
                      </div>
                    </Link>
                    
                    <div className="mt-3 space-y-2">
                      <h3 className="font-semibold text-foreground group-hover:text-netflix-red transition-colors">
                        {movie.title}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span className="bg-netflix-gray px-2 py-1 rounded text-xs">
                          {movie.genre}
                        </span>
                        <span>{movie.year}</span>
                        <span>•</span>
                        <span>{movie.rating}</span>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {movie.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <SearchIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  Aucun résultat trouvé
                </h3>
                <p className="text-muted-foreground">
                  Essayez avec d'autres mots-clés ou explorez nos catégories
                </p>
                <Link to="/home" className="mt-4 inline-block">
                  <NetflixButton variant="netflix">
                    Retour à l'accueil
                  </NetflixButton>
                </Link>
              </div>
            )}
          </motion.div>
        )}

        {/* Suggestions quand pas de recherche */}
        {!searchQuery && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <SearchIcon className="h-20 w-20 text-muted-foreground mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Que voulez-vous regarder aujourd'hui ?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Recherchez parmi notre vaste collection de films et séries. 
              Tapez un titre, un genre ou une description pour commencer.
            </p>
            
            <div className="flex flex-wrap justify-center gap-3">
              {['Action', 'Romance', 'Thriller', 'Comédie', 'Science-Fiction', 'Horreur'].map((genre) => (
                <NetflixButton
                  key={genre}
                  variant="netflix-outline"
                  onClick={() => setSearchQuery(genre)}
                >
                  {genre}
                </NetflixButton>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Search;