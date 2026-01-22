import axios from 'axios';
import type { Movie } from '../types/movie';

interface MovieSearchResponse {
    results: Movie [];
}

const TMDB_TOKEN = import.meta.env.VITE_TMDB_TOKEN;

const tmdbApi = axios.create({
    baseURL: 'https://api.themoviedb.org',
    headers: {
        Authorization: `Bearer ${TMDB_TOKEN}`,
    },
});


export async function fetchMovies (query: string): Promise<Movie[]> {

    if (!query.trim()) return [];

    const params = {
        query,
        include_adult: false,
        language: 'en-GB',
        page: 1,
    };

    const {data} = await tmdbApi.get<MovieSearchResponse>(
        '/3/search/movie',
        {params}
    );

    return data.results;            

};
