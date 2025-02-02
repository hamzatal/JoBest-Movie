import React, { useEffect, useState, useCallback } from "react";
import { 
  Play, 
  ChevronRight, 
  X, 
  Calendar,
  Star,
  Clock,
  Users,
  Info,
  Heart,
  Share2,
  Bookmark,
  SkipForward,
  SkipBack
} from "lucide-react";
import { motion, AnimatePresence } from 'framer-motion';
import axios from "axios";

const Banner = ({ isDarkMode }) => {
    const [movies, setMovies] = useState([]);
    const [currentMovieIndex, setCurrentMovieIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isTrailerOpen, setIsTrailerOpen] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLiked, setIsLiked] = useState(false);

    const TMDB_API_KEY = "ba4493b817fe50ef7a9d2c61203c7289";
    const TMDB_BASE_URL = "https://api.themoviedb.org/3";
    const ROTATION_INTERVAL = 8000; // 5 seconds

    const fetchMovies = async () => {
        try {
            setLoading(true);
            const response = await axios.get(`${TMDB_BASE_URL}/movie/popular`, {
                params: {
                    api_key: TMDB_API_KEY,
                    language: "en-US",
                    page: 1,
                }
            });

            const moviePromises = response.data.results.slice(0, 5).map(async (movie) => {
                const detailsResponse = await axios.get(`${TMDB_BASE_URL}/movie/${movie.id}`, {
                    params: {
                        api_key: TMDB_API_KEY,
                        append_to_response: "credits,videos"
                    }
                });

                return {
                    ...movie,
                    ...detailsResponse.data,
                    cast: detailsResponse.data.credits.cast.slice(0, 5),
                    trailer: detailsResponse.data.videos.results.find(video => video.type === "Trailer")?.key
                };
            });

            const detailedMovies = await Promise.all(moviePromises);
            setMovies(detailedMovies);
            setLoading(false);
        } catch (err) {
            setError("Failed to fetch movie data.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMovies();
    }, []);

    useEffect(() => {
        if (movies.length === 0) return;

        const interval = setInterval(() => {
            setCurrentMovieIndex((prev) => (prev + 1) % movies.length);
        }, ROTATION_INTERVAL);

        return () => clearInterval(interval);
    }, [movies]);

    const currentMovie = movies[currentMovieIndex];

    const formatRuntime = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return `${hours}h ${remainingMinutes}m`;
    };

    const MovieInfoBadge = ({ icon: Icon, text }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex items-center space-x-2 px-3 py-1 rounded-full ${
                isDarkMode ? 'bg-gray-800/80' : 'bg-gray-200/80'
            }`}
        >
            <Icon className="w-4 h-4" />
            <span className="text-sm">{text}</span>
        </motion.div>
    );

    const handlePrevMovie = () => {
        setCurrentMovieIndex((prev) => (prev - 1 + movies.length) % movies.length);
    };

    const handleNextMovie = () => {
        setCurrentMovieIndex((prev) => (prev + 1) % movies.length);
    };

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;
    if (error) return <div className="h-screen flex items-center justify-center">Error: {error}</div>;
    if (!currentMovie) return null;

    return (
        <div className="relative w-full h-screen overflow-hidden">
            {/* Background with fade transition */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentMovie.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                    className="absolute inset-0"
                >
                    {/* Background Image */}
                    <div
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-10000 ease-out scale-105"
                        style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${currentMovie.backdrop_path})`,
                        }}
                    />
                    {/* Gradient Overlay */}
                    <div
                        className={`absolute inset-0 ${
                            isDarkMode
                                ? 'bg-gradient-to-t from-gray-900 via-gray-900/90 to-gray-900/60'
                                : 'bg-gradient-to-t from-white via-white/90 to-white/60'
                        }`}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Content */}
            <div className="relative z-10 container mx-auto px-6 h-full flex items-center">
                <div className="grid md:grid-cols-3 gap-8 items-center">
                    {/* Movie Info (Left Column) */}
                    <motion.div
                        key={`info-${currentMovie.id}`}
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="col-span-2 space-y-6"
                    >
                        <div className="space-y-4">
                            <motion.h1
                                className={`text-6xl font-bold ${
                                    isDarkMode ? 'text-white' : 'text-gray-900'
                                }`}
                            >
                                {currentMovie.title}
                            </motion.h1>
                            
                            <div className="flex space-x-4">
                                <MovieInfoBadge
                                    icon={Star}
                                    text={`${currentMovie.vote_average.toFixed(1)}/10`}
                                />
                                <MovieInfoBadge
                                    icon={Calendar}
                                    text={currentMovie.release_date.split('-')[0]}
                                />
                                <MovieInfoBadge
                                    icon={Clock}
                                    text={formatRuntime(currentMovie.runtime)}
                                />
                            </div>
                        </div>

                        <motion.p
                            className={`text-lg max-w-2xl ${
                                isDarkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}
                        >
                            {currentMovie.overview}
                        </motion.p>

                        <div className="space-y-2">
                            <h3 className={`text-lg font-semibold ${
                                isDarkMode ? 'text-white' : 'text-gray-900'
                            }`}>
                                Featured Cast
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {currentMovie.cast.map((actor) => (
                                    <span
                                        key={actor.id}
                                        className={`px-3 py-1 rounded-full text-sm ${
                                            isDarkMode
                                                ? 'bg-gray-800/80 text-gray-300'
                                                : 'bg-gray-200/80 text-gray-700'
                                        }`}
                                    >
                                        {actor.name}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => setIsTrailerOpen(true)}
                                className="group flex items-center space-x-2 px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                            >
                                <Play className="w-5 h-5 group-hover:animate-pulse" />
                                <span>Watch Trailer</span>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                            </motion.button>

                            {/* <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsLiked(!isLiked)}
                                className={`p-3 rounded-full ${
                                    isDarkMode ? 'bg-gray-800/80' : 'bg-gray-200/80'
                                } ${isLiked ? 'text-red-500' : ''}`}
                            >
                                <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                            </motion.button> */}

                            {/* <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsBookmarked(!isBookmarked)}
                                className={`p-3 rounded-full ${
                                    isDarkMode ? 'bg-gray-800/80' : 'bg-gray-200/80'
                                } ${isBookmarked ? 'text-blue-500' : ''}`}
                            >
                                <Bookmark className={`w-5 h-5 ${isBookmarked ? 'fill-current' : ''}`} />
                            </motion.button> */}
                        </div>
                    </motion.div>

                    {/* Poster (Right Column) */}
                    <motion.div
                        key={`poster-${currentMovie.id}`}
                        initial={{ opacity: 0, x: 50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className="relative"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="relative w-64 mx-auto aspect-[2/3] rounded-xl overflow-hidden shadow-3xl"
                        >
                            <img
                                src={`https://image.tmdb.org/t/p/w500${currentMovie.poster_path}`}
                                alt={currentMovie.title}
                                className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </motion.div>

                        {/* Navigation Buttons */}
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handlePrevMovie}
                                className={`p-3 rounded-full ${
                                    isDarkMode ? 'bg-gray-800/80' : 'bg-gray-200/80'
                                }`}
                            >
                                <SkipBack className="w-5 h-5" />
                            </motion.button>
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleNextMovie}
                                className={`p-3 rounded-full ${
                                    isDarkMode ? 'bg-gray-800/80' : 'bg-gray-200/80'
                                }`}
                            >
                                <SkipForward className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Trailer Modal */}
            <AnimatePresence>
                {isTrailerOpen && currentMovie.trailer && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.9 }}
                            className="relative w-[80vw] h-[80vh] rounded-3xl overflow-hidden bg-black shadow-2xl"
                        >
                            <button
                                onClick={() => setIsTrailerOpen(false)}
                                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                            <iframe
                                className="w-full h-full"
                                src={`https://www.youtube.com/embed/${currentMovie.trailer}?autoplay=1&enablejsapi=1`}
                                allow="autoplay; encrypted-media"
                                allowFullScreen
                                title="Movie Trailer"
                            />
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default Banner;