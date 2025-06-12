import React, { useState, useRef, useEffect } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import axios from "axios";

const ChatBot = ({ isChatOpen, toggleChat }) => {
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim()) return;

        const userMessage = inputMessage;
        setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
        setInputMessage("");
        setIsLoading(true);

        try {
            const response = await axios.post("/chatbot", {
                message: userMessage,
            });

            const botMessage = response.data.response;
            setMessages((prev) => [
                ...prev,
                {
                    text: botMessage,
                    sender: "bot",
                    botName: "JO BEST AI ASSISTANT",
                },
            ]);
        } catch (error) {
            console.error("Error:", error);
            setMessages((prev) => [
                ...prev,
                {
                    text: "Sorry, something went wrong. Please try again.",
                    sender: "bot",
                },
            ]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    };

    const formatMessage = (text) => {
        return text.split("\n").map((line, i) => (
            <span key={i}>
                {line}
                <br />
            </span>
        ));
    };

    const LoadingDots = () => (
        <div className="flex space-x-1 justify-start items-center px-4 py-2 bg-gray-700 text-white rounded-xl animate-pulse w-fit">
            <span className="dot bg-white w-2 h-2 rounded-full animate-bounce"></span>
            <span className="dot bg-white w-2 h-2 rounded-full animate-bounce delay-200"></span>
            <span className="dot bg-white w-2 h-2 rounded-full animate-bounce delay-400"></span>
        </div>
    );

    return (
        <div className="fixed bottom-3 right-8 z-50">
            {isChatOpen && (
                <div className="absolute bottom-20 right-0 w-96 h-[500px] rounded-3xl shadow-2xl overflow-hidden bg-gray-800 border border-gray-700 flex flex-col">
                    {/* Header */}
                    <div className="flex justify-between items-center p-4 border-b bg-gray-900 border-gray-700">
                        <div className="flex items-center">
                            <MessageCircle className="mr-2 text-red-500" />
                            <h2 className="text-xl font-bold text-white">
                                JO BEST AI ASSISTANT
                            </h2>
                        </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-custom bg-gray-800">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    msg.sender === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`max-w-[75%] p-4 rounded-2xl shadow-lg ${
                                        msg.sender === "user"
                                            ? "bg-red-600 text-white rounded-tr-none"
                                            : "bg-gray-700 text-white rounded-tl-none"
                                    }`}
                                >
                                    <div className="text-sm">
                                        {formatMessage(msg.text)}
                                    </div>
                                    {msg.botName && (
                                        <div className="text-xs mt-2 text-gray-300 italic">
                                            – {msg.botName}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <LoadingDots />
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input */}
                    <form
                        onSubmit={handleSubmit}
                        className="p-4 border-t bg-gray-900 border-gray-700"
                    >
                        <div className="relative flex items-center space-x-2">
                            <textarea
                                rows={2}
                                value={inputMessage}
                                onChange={(e) =>
                                    setInputMessage(e.target.value)
                                }
                                onKeyDown={handleKeyDown}
                                placeholder="Type your message..."
                                className="flex-grow p-2 pr-12 rounded-xl bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
                            />
                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`absolute right-2 bottom-2 p-3 rounded-full bg-red-600 hover:bg-red-700 transition-colors ${
                                    isLoading
                                        ? "opacity-50 cursor-not-allowed"
                                        : ""
                                }`}
                            >
                                <Send size={20} className="text-white" />
                            </button>
                        </div>
                    </form>
                </div>
            )}

            {/* Floating Button */}
            <button
                onClick={toggleChat}
                className="w-16 h-16 rounded-full flex items-center justify-center shadow-2xl transform transition-all duration-300 ease-in-out hover:scale-110 focus:outline-none bg-red-600 hover:bg-red-700"
            >
                {isChatOpen ? (
                    <X size={28} className="text-white" />
                ) : (
                    <MessageCircle size={28} className="text-white" />
                )}
            </button>
        </div>
    );
};

export default ChatBot;
