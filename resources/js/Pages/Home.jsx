import React, { useState, useEffect } from "react";
import NavBar from "../components/Nav";
import Banner from "../Components/Banner";
import Footer from "../Components/Footer";
import ChatBot from "../Components/ChatBot";
import ModernMoviesGrid from "../Components/MoviesGrid";
import { movieEndpoints } from "../Components/tmdb";
import {
    X,
    SparklesIcon,
    TrendingUp,
    Clapperboard,
    Rocket,
    Ghost,
    Drama,
    Heart,
    Wand2,
    Skull,
    MessageCircle,
    CheckCircle,
    AlertTriangle,
    Bookmark,
    BookmarkPlus
} from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

const Home = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const [wishlist, setWishlist] = useState([]);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isTooltipVisible, setIsTooltipVisible] = useState(true);

    const movieCategories = [
        {
            title: "Featured Movies",
            apiUrl: movieEndpoints.featured,
            icon: <SparklesIcon className="mr-2 text-yellow-400" />
        },
        {
            title: "Trending Movies",
            apiUrl: movieEndpoints.trending,
            icon: <TrendingUp className="mr-2 text-orange-500" />
        },
        {
            title: "Action Movies",
            apiUrl: movieEndpoints.action,
            icon: <Clapperboard className="mr-2 text-red-500" />
        },
        {
            title: "Sci-Fi Movies",
            apiUrl: movieEndpoints['sci-fi'],
            icon: <Rocket className="mr-2 text-blue-500" />
        },
        {
            title: "Horror Movies",
            apiUrl: movieEndpoints.horror,
            icon: <Ghost className="mr-2 text-purple-500" />
        },
        {
            title: "Drama Movies",
            apiUrl: movieEndpoints.drama,
            icon: <Drama className="mr-2 text-green-500" />
        },
        {
            title: "Romantic Movies",
            apiUrl: movieEndpoints.romantic,
            icon: <Heart className="mr-2 text-pink-500" />
        },
        {
            title: "Fantasy Movies",
            apiUrl: movieEndpoints.fantasy,
            icon: <Wand2 className="mr-2 text-indigo-500" />
        },
        {
            title: "Crime Movies",
            apiUrl: movieEndpoints.crime,
            icon: <Skull className="mr-2 text-gray-700" />
        },
    ];

    useEffect(() => {
        const tooltipTimer = setTimeout(() => {
            setIsTooltipVisible(false);
        }, 5000);

        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
            setWishlist(JSON.parse(savedWishlist));
        }

        return () => clearTimeout(tooltipTimer);
    }, []);

    // Custom toast component that matches the NavBar design language
    const CustomToast = ({ closeToast, toastProps, icon, title, message, color }) => (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ type: "spring", stiffness: 400, damping: 20 }}
            className={`flex items-center py-3 px-4 rounded-lg shadow-lg backdrop-blur-md ${
                isDarkMode 
                ? "bg-gray-900/90 text-white border border-gray-800/50" 
                : "bg-white/90 text-gray-900 border border-gray-200/50"
            }`}
        >
            <div className={`mr-3 p-2 rounded-full ${color}`}>
                {icon}
            </div>
            <div className="flex-1">
                <p className="font-medium text-sm">{title}</p>
                <p className={`text-xs ${isDarkMode ? "text-gray-300" : "text-gray-600"}`}>{message}</p>
            </div>
            <button 
                onClick={closeToast} 
                className={`ml-2 p-1 rounded-full hover:${isDarkMode ? "bg-gray-800" : "bg-gray-100"}`}
            >
                <X size={16} />
            </button>
        </motion.div>
    );

    const handleAddToWishlist = (movie) => {
        if (!wishlist.some((m) => m.id === movie.id)) {
            const newWishlist = [...wishlist, movie];
            setWishlist(newWishlist);
            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
            
            toast((props) => (
                <CustomToast
                    {...props}
                    icon={<BookmarkPlus className="w-5 h-5 text-white" />}
                    title={`${movie.title} added to watchlist`}
                    message="You can find it in your watchlist section"
                    color="bg-green-500"
                />
            ), {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                closeButton: false
            });
        } else {
            toast((props) => (
                <CustomToast
                    {...props}
                    icon={<AlertTriangle className="w-5 h-5 text-white" />}
                    title={`${movie.title} is already in watchlist`}
                    message="This movie is already saved in your list"
                    color="bg-amber-500"
                />
            ), {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                closeButton: false
            });
        }
    };

    const handleRemoveFromWishlist = (movieId) => {
        const movie = wishlist.find((m) => m.id === movieId);
        const newWishlist = wishlist.filter((m) => m.id !== movieId);
        setWishlist(newWishlist);
        localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        
        toast((props) => (
            <CustomToast
                {...props}
                icon={<Bookmark className="w-5 h-5 text-white" />}
                title={`${movie?.title} removed from watchlist`}
                message="The movie has been removed from your list"
                color="bg-gray-500"
            />
        ), {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            closeButton: false
        });
    };

    const handleLogout = () => {
        console.log("Logging out");
    };

    const toggleChat = () => setIsChatOpen(!isChatOpen);

    const resetChat = () => {
        console.log("Resetting chat");
    };

    const handleCloseTooltip = () => {
        setIsTooltipVisible(false);
    };

    return (
        <div
            className={`min-h-screen transition-colors duration-300 ${
                isDarkMode
                    ? "bg-gradient-to-br from-gray-900 to-gray-800 text-white"
                    : "bg-gradient-to-br from-gray-50 to-white text-gray-900"
            }`}
        >
            <NavBar
                isDarkMode={isDarkMode}
                wishlist={wishlist}
                handleLogout={handleLogout}
            />

            <Banner isDarkMode={isDarkMode} />

            <main className="pt-24 px-6 max-w-7xl mx-auto">
                {movieCategories.map((category) => (
                    <div key={category.apiUrl} className="mb-12">
                        <ModernMoviesGrid
                            title={category.title}
                            apiUrl={category.apiUrl}
                            icon={category.icon}
                            isDarkMode={isDarkMode}
                            onAddToWishlist={handleAddToWishlist}
                            onRemoveFromWishlist={handleRemoveFromWishlist}
                        />
                    </div>
                ))}
            </main>

            <Footer isDarkMode={isDarkMode} />

            <div className="fixed bottom-24 right-6 z-50 flex flex-col items-center">
                {isTooltipVisible && (
                    <div
                        className={`relative mb-0 p-5 bg-white text-black rounded-lg shadow-lg text-sm transition-all duration-300 animate-fade-in-down whitespace-nowrap`}
                    >
                        <button
                            onClick={handleCloseTooltip}
                            className="absolute top-1 right-1 text-gray-500 hover:text-gray-800"
                        >
                            <X size={20} />
                        </button>
                        <div className="flex items-center">
                            <MessageCircle className="mr-1 text-blue-500" />
                            <p>Need help? Chat with our AI assistant</p>
                        </div>
                    </div>
                )}
                <ChatBot
                    isChatOpen={isChatOpen}
                    toggleChat={toggleChat}
                    resetChat={resetChat}
                />
            </div>

            <ToastContainer 
                position="top-right"
                newestOnTop
                limit={3}
                className="mt-16"
                toastStyle={{
                    background: 'transparent',
                    boxShadow: 'none',
                    padding: 0
                }}
                closeButton={false}
            />
        </div>
    );
};

export default Home;