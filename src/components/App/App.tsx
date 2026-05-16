import SearchBar from "../SearchBar/SearchBar";
import css from "./App.module.css";
import { fetchMovies } from "../../services/movieService";
import { useEffect, useState } from "react";
import type { Movie } from "../../types/movie";
import MovieGrid from "../MovieGrid/MovieGrid";
import MovieModal from "../MovieModal/MovieModal";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

// Бібліотека react-paginate
import ReactPaginate from "react-paginate";
// Імпортуємо і toast, і Toaster
import { toast } from "react-hot-toast";

// Виправлення для Vite
const Paginate = (ReactPaginate as any).default || ReactPaginate;

const App = () => {
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");

  // 1. СПОЧАТКУ оголошуємо useQuery
  const { data, isLoading, isError, isPlaceholderData } = useQuery({
    queryKey: ["Movies", query, page],
    queryFn: () => fetchMovies(query, page),
    enabled: query !== "",
    placeholderData: keepPreviousData,
  });

  // 2. ПОТІМ використовуємо useEffect, який посилається на data
  useEffect(() => {
    if (data && data.results.length === 0 && query !== "") {
      toast.error("No movies found for your request.", {
        id: "no-results",
      });
    }
  }, [data, query]);

  const movies = data?.results || [];

  const onSubmit = (newQuery: string) => {
    // Валідація на порожній рядок
    if (newQuery.trim() === "") {
      toast.error("Please enter your search query.");
      return;
    }
    setQuery(newQuery);
    setPage(1);
  };

  const onSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const onClose = () => {
    setSelectedMovie(null);
  };

  const handlePageClick = (event: { selected: number }) => {
    setPage(event.selected + 1);
  };

  return (
    <div className={css.App}>
      <SearchBar onSubmit={onSubmit} />

      {isLoading && movies.length === 0 ? (
        <Loader />
      ) : isError ? (
        <ErrorMessage />
      ) : (
        <>
          {data?.total_pages && data.total_pages > 1 && (
            <div
              className={css.paginationWrapper}
              style={{ opacity: isPlaceholderData ? 0.5 : 1 }}
            >
              <Paginate
                pageCount={data.total_pages}
                pageRangeDisplayed={5}
                marginPagesDisplayed={1}
                onPageChange={handlePageClick}
                forcePage={page - 1}
                nextLabel="→"
                previousLabel="←"
                breakLabel="..."
                containerClassName={css.pagination}
                activeClassName={css.active}
                pageClassName={css.pageItem}
                previousClassName={css.prevItem}
                nextClassName={css.nextItem}
              />
            </div>
          )}

          {/* Якщо фільми є — показуємо сітку */}
          {movies.length > 0 && (
            <MovieGrid movies={movies} onSelect={onSelect} />
          )}
        </>
      )}

      {selectedMovie && <MovieModal movie={selectedMovie} onClose={onClose} />}
    </div>
  );
};

export default App;
