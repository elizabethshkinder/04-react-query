import { useEffect, useState } from 'react'
import toast, {Toaster}  from 'react-hot-toast';
import ReactPaginate from 'react-paginate';
import { useQuery } from '@tanstack/react-query';

import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';

import SearchBar from '../SearchBar/SearchBar';
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';

import css from './App.module.css'

export default function App() {
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: Boolean(query.trim()),
    
  });

  const totalPages = data?.total_pages ?? 0;
  const movies = data?.results ?? [];

  useEffect(() => {
    if (!query.trim()) return;

    if (!isLoading && !isError && movies.length === 0) {
      toast.error('No movies found for your request.');
    }
  }, [query, isLoading, isError, movies.length]);

  function onSubmit(newQuery: string): void {
    setSelectedMovie(null);
    setQuery(newQuery);
    setPage(1);
  }

  return (
    <>
      <Toaster />
      <SearchBar onSubmit={onSubmit} />

      {isLoading && <Loader />}
      {isError && <ErrorMessage />}

      {movies.length > 0 && (
        <>
          <MovieGrid movies={movies} onSelect={setSelectedMovie} />

          {totalPages > 1 && (
            <ReactPaginate
              pageCount={totalPages}
              pageRangeDisplayed={5}
              marginPagesDisplayed={1}
              onPageChange={({ selected }) => setPage(selected + 1)}
              forcePage={page - 1}
              containerClassName={css.pagination}
              activeClassName={css.active}
              nextLabel="→"
              previousLabel="←"
            />
          )}
        </>
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />
      )}
    </>
  );
}

