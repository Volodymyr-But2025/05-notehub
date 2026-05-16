import axios from "axios";
import type { Movie } from "../types/movie";
interface MovieResponse {
  results: Movie[];
  page: number;
  total_results: number;
  total_pages: number;
}

export const fetchMovies = async (
  query: string,
  page: number = 1,
): Promise<MovieResponse> => {
  try {
    const response = await axios.get<MovieResponse>(
      `https://api.themoviedb.org/3/search/movie`,
      {
        params: {
          query: query,
          include_adult: true,
          language: "en-US",
          page: page,
        },
        headers: {
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_TOKEN}`,
        },
      },
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};
