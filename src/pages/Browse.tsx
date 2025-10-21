import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Play, Info, Plus } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { NetflixButton } from '@/components/ui/netflix-button';
import { RootState } from '@/store/store';

const Browse = () => {
  const { movies } = useSelector((state: RootState) => state.movies);
  const [selectedGenre, setSelectedGenre] = useState<string>('Tous');

  const genres = ['Tous', ...new Set(movies.map(movie => movie.genre))];
  
  const filteredMovies = selectedGenre === 'Tous' 
    ? movies 
    : movies.filter(movie => movie.genre === selectedGenre);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-8">
            Parcourir
          </h1>

          {/* Genre Filter */}
          <div className="flex flex-wrap gap-3 mb-8">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  selectedGenre === genre
                    ? 'bg-netflix-red text-white'
                    : 'bg-white/10 text-white/80 hover:bg-white/20 hover:text-white'
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Movies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMovies.map((movie, index) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ scale: 1.05 }}
                className="group"
              >
                <Link to={`/movie/${movie.id}`}>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gradient-card">
                    <img
                      src={movie.image}
                      alt={movie.title}
                      className="w-full h-full object-cover transition-transform group-hover:scale-110"
                      onContextMenu={(e) => e.preventDefault()}
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
                          <Link to={`/watch/${movie.id}`}>
                            <NetflixButton variant="ghost" size="icon" className="h-8 w-8">
                              <Play className="h-4 w-4" />
                            </NetflixButton>
                          </Link>
                          <NetflixButton variant="ghost" size="icon" className="h-8 w-8">
                            <Plus className="h-4 w-4" />
                          </NetflixButton>
                        </div>
                      </div>
                      
                      <div className="absolute top-2 right-2">
                        <Link to={`/movie/${movie.id}`}>
                          <NetflixButton variant="ghost" size="icon" className="h-8 w-8">
                            <Info className="h-4 w-4" />
                          </NetflixButton>
                        </Link>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {filteredMovies.length === 0 && (
            <div className="text-center py-20">
              <p className="text-white/70 text-lg">
                Aucun film trouvé pour ce genre.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Browse;