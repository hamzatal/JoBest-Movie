import React from "react";
import { Home, Clapperboard, Linkedin, Github } from "lucide-react";
import { Link } from "@inertiajs/react";

const TeamMember = ({ name, role, program, studentId, linkedin, github }) => (
    <div className="bg-gray-800 bg-opacity-70 rounded-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl mx-auto mb-6">
        <div className="w-24 h-24 mx-auto mb-4 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center text-3xl font-bold text-white shadow-lg">
            {name.split(' ')[0][0] + name.split(' ')[name.split(' ').length - 1][0]}
        </div>
        <h3 className="text-2xl font-bold mb-2">{name}</h3>
        <div className="w-16 h-1 bg-red-500 mx-auto mb-3"></div>
        <p className="text-lg text-gray-300 mb-1 font-medium">{role}</p>
        <p className="text-base text-gray-400 mb-1">{program}</p>
        <p className="text-base text-gray-400 mb-4">ID: {studentId}</p>
        <p className="text-gray-400 mb-4 mx-auto text-sm">
            Passionate developer dedicated to creating exceptional movie streaming experiences.
        </p>
        <div className="flex justify-center space-x-4">
            {linkedin && (
                <a 
                    href={linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:text-red-500 transition-colors transform hover:scale-110"
                >
                    <Linkedin className="w-6 h-6" />
                </a>
            )}
            {github && (
                <a 
                    href={github} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-white hover:text-red-500 transition-colors transform hover:scale-110"
                >
                    <Github className="w-6 h-6" />
                </a>
            )}
        </div>
    </div>
);

const AboutUsPage = () => {
    const movieBackground = "/images/background.jpg";
    
    const teamMembers = [
        {
            name: "Saleh Qasim Hassan Al-Jarrah",
            role: "Team Member",
            program: "Software Engineering",
            studentId: "202120120",
            linkedin: "https://www.linkedin.com/",
            github: "https://github.com/"
        },
        {
            name: "Qusay Murad Fathi Abu Aqouleh",
            role: "Team Member",
            program: "Computer Science",
            studentId: "202120221",
            linkedin: "https://www.linkedin.com/",
            github: "https://github.com/"
        },
        {
            name: "Hazm Ishaq Al-Khasawneh",
            role: "Team Member",
            program: "Software Engineering",
            studentId: "202120216",
            linkedin: "https://www.linkedin.com/",
            github: "https://github.com/"
        },
        {
            name: "Omar Adnan Mahmoud Salman",
            role: "Team Member",
            program: "Computer Science",
            studentId: "202110129",
            linkedin: "https://www.linkedin.com/",
            github: "https://github.com/"
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white relative overflow-hidden">
            {/* Background with Opacity - Keeping original size */}
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
                        <h2 className="text-4xl font-bold mb-4 text-center">Meet Our <span className="text-red-500">Team</span></h2>
                        <p className="text-gray-400 text-center mb-12 text-xl">The talent behind JO BEST's innovation</p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {teamMembers.map((member, index) => (
                                <TeamMember 
                                    key={index}
                                    name={member.name}
                                    role={member.role}
                                    program={member.program}
                                    studentId={member.studentId}
                                    linkedin={member.linkedin}
                                    github={member.github}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUsPage;