import axios from 'axios';

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TMDB_API_KEY = 'ba4493b817fe50ef7a9d2c61203c7289';

const tmdbApi = axios.create({
    baseURL: TMDB_BASE_URL,
    params: {
        api_key: TMDB_API_KEY,
    },
});

export const fetchMovies = async (endpoint, params = {}) => {
    try {
        const response = await tmdbApi.get(endpoint, { params });
        return transformMovieData(response.data.results);
    } catch (error) {
        console.error('Error fetching from TMDB:', error);
        throw error;
    }
};

export const fetchMovieDetails = async (movieId) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}`, {
            params: {
                append_to_response: 'videos,credits',
            },
        });
        return transformMovieDetails(response.data);
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
    }
};

const transformMovieData = (movies) => {
    return movies.map(movie => ({
        id: movie.id,
        title: movie.title,
        poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
        backdrop_url: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
        release_date: movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA',
        rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
        genre: movie.genre_ids ? 'Mixed' : 'N/A', // سنقوم بتحديث هذا لاحقاً
        overview: movie.overview,
    }));
};

const transformMovieDetails = (movie) => ({
    id: movie.id,
    title: movie.title,
    poster_url: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
    backdrop_url: `https://image.tmdb.org/t/p/original${movie.backdrop_path}`,
    release_date: movie.release_date ? new Date(movie.release_date).getFullYear() : 'TBA',
    rating: movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A',
    genres: movie.genres ? movie.genres.map(genre => genre.name).join(', ') : 'N/A',
    overview: movie.overview,
    runtime: movie.runtime,
    trailer_url: movie.videos?.results?.[0]?.key ? 
        `https://www.youtube.com/watch?v=${movie.videos.results[0].key}` : null,
    cast: movie.credits?.cast?.slice(0, 5).map(actor => actor.name).join(', '),
});

export const movieEndpoints = {
    featured: '/movie/now_playing',
    trending: '/trending/movie/week',
    action: '/discover/movie?with_genres=28',
    'sci-fi': '/discover/movie?with_genres=878',
    horror: '/discover/movie?with_genres=27',
    drama: '/discover/movie?with_genres=18',
    romantic: '/discover/movie?with_genres=10749',
    fantasy: '/discover/movie?with_genres=14',
    crime: '/discover/movie?with_genres=80',
};