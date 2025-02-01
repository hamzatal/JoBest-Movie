// pages/Home.jsx
import React, { useState, useEffect } from "react";
import NavBar from "../components/NavBar";
import Banner from "../components/Banner";
import Footer from "../components/Footer";
import ChatBot from "../components/ChatBot";
import ModernMoviesGrid from "../components/ModernMoviesGrid";
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
    MessageCircle
} from "lucide-react";

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

    const handleAddToWishlist = (movie) => {
        if (!wishlist.some((m) => m.id === movie.id)) {
            const newWishlist = [...wishlist, movie];
            setWishlist(newWishlist);
            localStorage.setItem('wishlist', JSON.stringify(newWishlist));
        }
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
                        />
                    </div>
                ))}
            </main>

            <Footer isDarkMode={isDarkMode} />

            <div className="fixed bottom-24 right-6 z-50 flex flex-col items-center">
                {isTooltipVisible && (
                    <div
                        className={`relative mb-5 p-5 bg-white text-black rounded-lg shadow-lg text-sm transition-all duration-300 animate-fade-in-down whitespace-nowrap`}
                    >
                        <button
                            onClick={handleCloseTooltip}
                            className="absolute top-1 right-1 text-gray-500 hover:text-gray-800"
                        >
                            <X size={20} />
                        </button>
                        <div className="flex items-center">
                            <MessageCircle className="mr-2 text-blue-500" />
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
        </div>
    );
};

export default Home;