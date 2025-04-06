import React, { useEffect, useState } from "react";
import { Home, Clapperboard, Film, AlertCircle, ChevronsLeft } from "lucide-react";
import { Link } from "@inertiajs/react";

const NotFoundPage = () => {
    const movieBackground = "/images/background.jpg";
    const [animationComplete, setAnimationComplete] = useState(false);
    
    useEffect(() => {
        // Trigger animation after component mount
        const timer = setTimeout(() => {
            setAnimationComplete(true);
        }, 500);
        
        return () => clearTimeout(timer);
    }, []);

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background with Opacity */}
            <div
                className="absolute inset-0 bg-cover bg-center opacity-40 z-0"
                style={{
                    backgroundImage: `url(${movieBackground})`,
                }}
            ></div>

            {/* Dark Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black to-transparent opacity-80 z-0"></div>

            {/* Content */}
            <div className="relative z-10">
                {/* Navbar */}
                <nav className="flex justify-between items-center p-6">
                    <div className="flex items-center">
                        <Clapperboard className="w-10 h-10 text-red-500 mr-3" />
                        <h1 className="text-3xl font-bold">
                            JO <span className="text-red-500">BEST</span>
                        </h1>
                    </div>
                    <Link
                        href={route("home")}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-transform transform hover:scale-105 flex items-center"
                    >
                        Home <Home className="ml-2 w-5 h-5" />
                    </Link>
                </nav>

                {/* 404 Content */}
                <div className="container mx-auto px-1 py-1 flex flex-col items-center justify-center min-h-[40vh]">
                    <div className={`text-center max-w-3xl mb-0 transition-all duration-700 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        {/* Animated Icon */}
                        <div className="inline-block mb-8 relative">
                            <div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-20"></div>
                            <div className="relative z-10 bg-gray-800 p-6 rounded-full shadow-lg">
                                <AlertCircle className="w-24 h-24 text-red-500 animate-pulse" />
                            </div>
                        </div>
                        
                        <h1 className="text-8xl font-extrabold mb-6 leading-tight">
                            4<span className="text-red-500 inline-block animate-bounce">0</span>4
                        </h1>
                        <h2 className="text-3xl font-bold mb-6">Page Not Found</h2>
                      
                    </div>

                    <div className={`w-full max-w-md mb-16 transition-all duration-700 delay-300 transform ${animationComplete ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                        {/* Film reel animation */}
                       
                        
                        {/* Action buttons */}
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link
                                href={route("home")}
                                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center"
                            >
                                <Home className="mr-2 w-5 h-5" />
                                Back to Home
                            </Link>
                            <button
                                onClick={() => window.history.back()}
                                className="w-full sm:w-auto bg-gray-700 hover:bg-gray-600 text-white px-8 py-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center mt-4 sm:mt-0"
                            >
                                <ChevronsLeft className="mr-2 w-5 h-5" />
                                Go Back
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;