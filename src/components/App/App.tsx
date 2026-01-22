import { useState } from 'react'
import toast, {Toaster}  from 'react-hot-toast';

import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';

import SearchBar from '../SearchBar/SearchBar';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';

import './App.module.css'

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);


  async function handleSearch(query: string): Promise<void> {
    
    try {
      setMovies([]);
      setIsError(false);
      setIsLoading(true);

      const results = await fetchMovies(query);

      if (results.length === 0) {
        toast.error('No movies found for your request.');
        return;
      }

      setMovies(results);
    } catch {
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectMovie = (movie: Movie) => setSelectedMovie(movie);
  const handleCloseModal = () => setSelectedMovie(null);


  return (
    <div>
      <SearchBar onSubmit={handleSearch} />
      <Toaster position="top-center" />

      {isLoading && <Loader />}
      {!isLoading && isError && <ErrorMessage />}
      {!isLoading && !isError && movies.length > 0 && (
        <MovieGrid movies={movies} onSelect={handleSelectMovie} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={handleCloseModal} />
      )}
    </div>
  );
}