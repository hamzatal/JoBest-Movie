import React, { useState } from "react";
import { Home, Clapperboard } from "lucide-react";
import { Link } from "@inertiajs/react";

const ContactPage = () => {
    const movieBackground = "/images/background.jpg";
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [status, setStatus] = useState({
        success: null,
        message: ''
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/contacts', formData);
            setStatus({ success: true, message: response.data.message });
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            setStatus({
                success: false,
                message: error.response?.data?.message || 'An error occurred.'
            });
        }
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
                            Jo <span className="text-red-500">Best</span>
                        </h1>
                    </div>
                    <Link
                        href={route("home")}
                        className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-full transition-transform transform hover:scale-105 flex items-center"
                    >
                        Home <Home className="ml-2 w-5 h-5" />
                    </Link>
                </nav>

                {/* Contact Form Section */}
                <div className="container mx-auto px-6 py-12 flex flex-col items-center justify-center">
                    <div className="text-center max-w-4xl mb-12">
                        <h1 className="text-6xl font-extrabold mb-6 leading-tight">
                            Contact <span className="text-red-500">Us</span>
                        </h1>
                        <p className="text-xl mb-8 leading-relaxed">
                            We value your feedback and are here to help! Whether you have questions, suggestions,
                            or just want to share your thoughts about Jo Best, we'd love to hear from you.
                            Our team is committed to providing you with the best possible movie streaming experience.
                        </p>
                    </div>

                    <div className="w-full max-w-xl bg-gray-800 bg-opacity-70 rounded-xl p-8 shadow-2xl">
                        <h2 className="text-3xl font-bold mb-6 text-center">
                            Send Us a <span className="text-red-500">Message</span>
                        </h2>
                        
                        {status.message && (
                            <div
                                className={`mb-4 p-4 rounded-lg ${
                                    status.success ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                                }`}
                            >
                                {status.message}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">
                                    Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                                    placeholder="Enter the subject"
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-white"
                                    rows="5"
                                    placeholder="Write your message here..."
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                className="w-full bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-transform transform hover:scale-105 flex items-center justify-center space-x-2"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;