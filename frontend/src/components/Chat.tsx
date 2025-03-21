import { useState, useRef, useEffect } from 'react';
import Message from './Message';
import { Message as MessageType, ChatResponse } from '../types/chat';

export default function Chat() {
    const [messages, setMessages] = useState<MessageType[]>([
        {
            content: "Hello! I am your AI assistant. Please, ask me anything!",
            isUser: false
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isLoading) return;

        const userMessage = inputValue.trim();
        setInputValue('');
        
        setMessages(prev => [...prev, { content: userMessage, isUser: true }]);
        setIsLoading(true);

        try {
            const response = await fetch('http://localhost:8000/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userMessage }),
            });

            const data: ChatResponse = await response.json();
            
            setMessages(prev => [...prev, { content: data.response, isUser: false }]);
        } catch (error) {
            console.error('Error:', error);
            setMessages(prev => [...prev, {
                content: "Sorry, I'm having trouble connecting to the server. Please try again later.",
                isUser: false
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto">
            <div className="bg-white shadow-md p-4">
                <h1 className="text-xl font-semibold text-gray-800">AI Chat Assistant</h1>
                <p className="text-sm text-gray-500">We typically reply within a few seconds</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message, index) => (
                    <Message key={index} message={message} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSubmit} className="p-4 border-t">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`p-2 rounded-lg ${
                            isLoading
                                ? 'bg-gray-300 cursor-not-allowed'
                                : 'bg-blue-500 hover:bg-blue-600 text-white'
                        }`}
                    >
                        <svg
                            className="w-6 h-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                            />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
} 