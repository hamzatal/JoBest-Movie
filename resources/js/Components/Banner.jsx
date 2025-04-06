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
    const [autoSlideEnabled, setAutoSlideEnabled] = useState(true); // Flag to control auto slide
    const [timeRemaining, setTimeRemaining] = useState(8); // Time until next movie in seconds

    const TMDB_API_KEY = "ba4493b817fe50ef7a9d2c61203c7289";
    const TMDB_BASE_URL = "https://api.themoviedb.org/3";
    const ROTATION_INTERVAL = 8000; // 8 seconds

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

    // Timer countdown effect
    useEffect(() => {
        if (!autoSlideEnabled || movies.length === 0) return;

        // Reset timer when movie changes
        setTimeRemaining(ROTATION_INTERVAL / 1000);

        const timerInterval = setInterval(() => {
            setTimeRemaining(prev => {
                if (prev <= 1) {
                    return ROTATION_INTERVAL / 1000;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timerInterval);
    }, [currentMovieIndex, autoSlideEnabled, movies.length]);

    // Auto-rotation effect
    useEffect(() => {
        if (!autoSlideEnabled || movies.length === 0) return;

        const interval = setInterval(() => {
            setCurrentMovieIndex((prev) => (prev + 1) % movies.length);
        }, ROTATION_INTERVAL);

        return () => clearInterval(interval);
    }, [movies, autoSlideEnabled]);

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
            className={`flex items-center space-x-2 px-3 py-1 rounded-full ${isDarkMode ? 'bg-gray-800/80' : 'bg-gray-200/80'}`}
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

    const handleTrailerOpen = () => {
        setIsTrailerOpen(true);
        setAutoSlideEnabled(false); // Disable auto slide when trailer is open
    };

    const handleTrailerClose = () => {
        setIsTrailerOpen(false);
        setAutoSlideEnabled(true); // Re-enable auto slide when trailer is closed
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
                        className={`absolute inset-0 ${isDarkMode ? 'bg-gradient-to-t from-gray-900 via-gray-900/90 to-gray-900/60' : 'bg-gradient-to-t from-white via-white/90 to-white/60'}`}
                    />
                </motion.div>
            </AnimatePresence>

            {/* Timer Bar */}
            {autoSlideEnabled && (
                <div className="absolute top-0 left-0 right-0 z-20 h-1 bg-gray-800/30">
                    <motion.div
                        key={`timer-${currentMovieIndex}`}
                        className="h-full bg-red-600"
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{ 
                            duration: timeRemaining,
                            ease: "linear"
                        }}
                    />
                </div>
            )}

            {/* Timer Display */}
            {autoSlideEnabled && (
                <motion.div 
                    className={`absolute bottom-7 left-12  z-300 px-5 py-2 rounded-full ${isDarkMode ? 'bg-gray-800/80 text-white' : 'bg-white/80 text-gray-900'} flex items-center space-x-2`}
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <Clock className="w-4 h-4" />
                    <div className="flex items-center">
                        <motion.span 
                            key={timeRemaining}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-sm font-medium"
                        >
                            {movies.length > 0 && `العرض التالي في ${timeRemaining} ثواني`}
                        </motion.span>
                    </div>
                </motion.div>
            )}

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
                                className={`text-6xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
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
                            className={`text-lg max-w-2xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
                        >
                            {currentMovie.overview}
                        </motion.p>

                        <div className="space-y-2">
                            <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                Featured Cast
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {currentMovie.cast.map((actor) => (
                                    <span
                                        key={actor.id}
                                        className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-gray-800/80 text-gray-300' : 'bg-gray-200/80 text-gray-700'}`}
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
                                onClick={handleTrailerOpen}
                                className="group flex items-center space-x-2 px-6 py-3 rounded-xl bg-red-600 text-white hover:bg-red-700 transition-all duration-300"
                            >
                                <Play className="w-5 h-5 group-hover:animate-pulse" />
                                <span>Watch Trailer</span>
                                <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
                            </motion.button>
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
                            
                            {/* Movie Index Indicator */}
                            <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded-md text-xs">
                                {currentMovieIndex + 1} / {movies.length}
                            </div>
                        </motion.div>

                        {/* Navigation Buttons */}
                        <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2 flex space-x-4">
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handlePrevMovie}
                                className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-800/80' : 'bg-gray-200/80'}`}
                            >
                                <SkipBack className="w-5 h-5" />
                            </motion.button>
                            
                            {/* Movie Progress Dots */}
                            <div className="flex items-center space-x-2 px-4">
                                {movies.map((_, idx) => (
                                    <motion.div
                                        key={idx}
                                        className={`h-2 rounded-full ${idx === currentMovieIndex ? 'w-6 bg-red-600' : 'w-2 bg-gray-500/50'}`}
                                        initial={false}
                                        animate={{ 
                                            width: idx === currentMovieIndex ? 24 : 8,
                                            backgroundColor: idx === currentMovieIndex ? '#dc2626' : '#6b7280' 
                                        }}
                                        transition={{ duration: 0.3 }}
                                    />
                                ))}
                            </div>
                            
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleNextMovie}
                                className={`p-3 rounded-full ${isDarkMode ? 'bg-gray-800/80' : 'bg-gray-200/80'}`}
                            >
                                <SkipForward className="w-5 h-5" />
                            </motion.button>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Next Movie Preview */}
            {/* {movies.length > 1 && autoSlideEnabled && (
                <motion.div
                    className="absolute top-12 right-8 z-20 flex items-center space-x-4"
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                >
                    <div className={`p-4 rounded-xl ${isDarkMode ? 'bg-gray-800/80' : 'bg-white/80'} flex items-center space-x-3`}>
                        <div className="w-16 h-24 rounded-md overflow-hidden">
                            <img 
                                src={`https://image.tmdb.org/t/p/w200${movies[(currentMovieIndex + 1) % movies.length].poster_path}`} 
                                alt="Next Movie" 
                                className="w-full h-full object-cover"
                            />
                        </div>
                        <div>
                            <div className={`text-xs font-medium mb-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>العرض التالي</div>
                            <div className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                                {movies[(currentMovieIndex + 1) % movies.length].title}
                            </div>
                        </div>
                    </div>
                </motion.div>
            )} */}

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
                                onClick={handleTrailerClose}
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