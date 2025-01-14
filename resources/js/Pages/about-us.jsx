import React from "react";
import { Home, Clapperboard, Linkedin, Github } from "lucide-react";
import { Link } from "@inertiajs/react";

const TeamMember = ({ name, role, linkedin, github }) => (
    <div className="bg-gray-800 bg-opacity-70 rounded-xl p-8 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl max-w-2xl mx-auto">
        <div className="w-40 h-40 mx-auto mb-6 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-5xl font-bold text-white shadow-lg">
            {name.split(' ')[0][0] + name.split(' ')[1][0]}
        </div>
        <h3 className="text-3xl font-bold mb-3">{name}</h3>
        <div className="w-24 h-1 bg-red-500 mx-auto mb-4"></div>
        <p className="text-xl text-gray-300 mb-6 font-medium">{role}</p>
        <p className="text-gray-400 mb-8 max-w-lg mx-auto">
            Passionate developer dedicated to creating exceptional movie streaming experiences. 
            Bringing technical expertise and creativity to make JO BEST the ultimate destination for cinema lovers.
        </p>
        <div className="flex justify-center space-x-6">
            {linkedin && (
                <a 
                    href={linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:text-red-500 transition-colors transform hover:scale-110"
                >
                    <Linkedin className="w-8 h-8" />
                </a>
            )}
            {github && (
                <a 
                    href={github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:text-red-500 transition-colors transform hover:scale-110"
                >
                    <Github className="w-8 h-8" />
                </a>
            )}
        </div>
    </div>
);

const AboutUsPage = () => {
    const movieBackground = "/images/background.jpg";
    
    const teamMember = {
        name: "Haneen Abumazrou",
        role: "Lead Developer",
        linkedin: "https://www.linkedin.com/in/haneen-abumazrou/",
        github: "https://github.com/HaneenAbumazrou"
    };

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

                {/* About Us Content */}
                <div className="container mx-auto px-6 py-6 flex flex-col items-center justify-center">
                    <div className="text-center max-w-4xl mb-16">
                        <h1 className="text-6xl font-extrabold mb-6 leading-tight">
                            About JO <span className="text-red-500">BEST</span>
                        </h1>
                        <p className="text-xl mb-8 leading-relaxed">
                            At JO BEST, we believe movies are more than just entertainment—they're an experience.
                            Our mission is to bring cinematic magic to everyone, everywhere, by offering a curated
                            collection of blockbuster hits, hidden gems, and exclusive originals.
                        </p>
                        <p className="text-xl mb-8 leading-relaxed">
                            Founded with a passion for storytelling, JO BEST is committed to delivering high-quality
                            streaming services and fostering a community of movie lovers. We aim to redefine how you experience entertainment,
                            whether you're a casual viewer or a cinema aficionado.
                        </p>
                        <p className="text-xl mb-8 leading-relaxed">
                            Join us as we bring the silver screen closer to you—because at JO BEST, the magic of movies never stops.
                        </p>
                    </div>

                    {/* Team Section */}
                    <div className="w-full max-w-6xl mb-16">
                        <h2 className="text-4xl font-bold mb-4 text-center">Meet Our <span className="text-red-500">Developer</span></h2>
                        <p className="text-gray-400 text-center mb-12 text-xl">The talent behind JO BEST's innovation</p>
                        <TeamMember 
                            name={teamMember.name}
                            role={teamMember.role}
                            linkedin={teamMember.linkedin}
                            github={teamMember.github}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;