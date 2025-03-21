import { useState, useRef, useEffect } from 'react';
import MessageComponent from './Message';
import { Message } from '../types/chat';

export default function Chat() {
    const [messages, setMessages] = useState<Message[]>([
        {
            content: "Hello! I am your AI assistant. Please, ask me anything!",
            isUser: false
        }
    ]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim()) return;

        const newMessage: Message = { content: input, isUser: true };
        setMessages(prev => [...prev, newMessage]);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const apiUrl = process.env.CHAT_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: input }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();
            const assistantMessage: Message = { content: data.response, isUser: false };
            setMessages(prev => [...prev, assistantMessage]);
        } catch (error) {
            setError('Failed to get response from the server. Please try again.');
            console.error('Error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
            <div className="flex-1 overflow-y-auto mb-4 space-y-4">
                {messages.map((message, index) => (
                    <MessageComponent key={index} message={message} />
                ))}
                <div ref={messagesEndRef} />
                {isLoading && (
                    <div className="text-gray-500 italic">
                        Assistant is typing...
                    </div>
                )}
                {error && (
                    <div className="text-red-500">
                        {error}
                    </div>
                )}
            </div>
            <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                    disabled={isLoading}
                />
                <button
                    type="submit"
                    disabled={isLoading || !input.trim()}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                    Send
                </button>
            </form>
        </div>
    );
} 