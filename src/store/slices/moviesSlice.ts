import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Movie {
  id: number;
  title: string;
  description: string;
  image: string;
  video: string;
  genre: string;
  year: number;
  rating: string;
  duration: string;
}

interface MoviesState {
  movies: Movie[];
  featuredMovie: Movie | null;
  currentMovie: Movie | null;
  isLoading: boolean;
}

const initialState: MoviesState = {
  movies: [],
  featuredMovie: null,
  currentMovie: null,
  isLoading: false,
};

const moviesSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setMovies: (state, action: PayloadAction<Movie[]>) => {
      state.movies = action.payload;
      state.featuredMovie = action.payload[0] || null;
    },
    setCurrentMovie: (state, action: PayloadAction<Movie>) => {
      state.currentMovie = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setMovies, setCurrentMovie, setLoading } = moviesSlice.actions;
export default moviesSlice.reducer;