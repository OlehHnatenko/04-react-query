import css from'./App.module.css'
import { useState, useEffect } from 'react'
import toast, { Toaster } from 'react-hot-toast';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';
import type { Movie } from '../../types/movie';
import { fetchMovies } from '../../services/movieService';
import SearchBar from '../SearchBar/SearchBar'
import Loader from '../Loader/Loader';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import MovieGrid from '../MovieGrid/MovieGrid';
import MovieModal from '../MovieModal/MovieModal';


export default function App() {
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const { data, isLoading, isError, isSuccess } = useQuery({
    queryKey: ['movies', query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== '',
    placeholderData: keepPreviousData
  });
  useEffect(() => {
    if (data?.results.length === 0) {
      toast("No movies found for your request");
    }
  }, [data]);

  const totalPages = data?.total_pages ?? 0;
  

  const handleSearch = async (newQuery: string) => {
    setQuery(newQuery);
    setPage(1);
  
  };

  const handleSelectedMovie = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  
  const closeModal = () => setSelectedMovie(null);


  return (
    <div className={css.app}>
      
      <SearchBar onSubmit={handleSearch} />
      {isSuccess && totalPages > 1 && (
        <ReactPaginate
          pageCount={totalPages}
          pageRangeDisplayed={5}
          marginPagesDisplayed={5}
          onPageChange={({ selected }) => setPage(selected + 1)}
          forcePage={page - 1}
          containerClassName={css.pagination}
          activeClassName={css.active}
          nextLabel="→"
          previousLabel="←"
        />
      )}
      <Toaster />      
      {isLoading && <Loader />}
      {isError && <ErrorMessage />}
      
      {isSuccess && data.results.length > 0 && (
        <MovieGrid onSelect={handleSelectedMovie} movies={data.results} />
      )}

      {selectedMovie && (
        <MovieModal movie={selectedMovie} onClose={closeModal} />
      )}

    </div>
  );
};


