import { useState } from 'react';
import { Message, ChatResponse } from '../types/chat';
import MessageComponent from './Message';
import ChatHistory from './ChatHistory';
import { useChatHistory } from '../hooks/useChatHistory';

export default function Chat() {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const {
        histories,
        currentHistoryId,
        currentMessages,
        addMessage,
        createNewChat,
        switchChat,
        deleteChat
    } = useChatHistory();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!input.trim() || isLoading) return;

        const userMessage: Message = {
            content: input.trim(),
            isUser: true
        };

        addMessage(userMessage);
        setInput('');
        setIsLoading(true);
        setError(null);

        try {
            const apiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: input.trim() }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch response');
            }

            const data: ChatResponse = await response.json();
            const assistantMessage: Message = {
                content: data.response,
                isUser: false
            };

            addMessage(assistantMessage);
        } catch (err) {
            setError('Failed to connect to the server. Please try again later.');
            console.error('Error:', err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex h-screen">
            <ChatHistory
                histories={histories}
                currentHistoryId={currentHistoryId}
                onSwitchChat={switchChat}
                onDeleteChat={deleteChat}
                onCreateNewChat={createNewChat}
            />
            <div className="flex-1 flex flex-col">
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {currentMessages.map((message, index) => (
                        <MessageComponent key={index} message={message} />
                    ))}
                    {isLoading && (
                        <div className="flex items-center space-x-2 text-gray-500">
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
                            <span>Thinking...</span>
                        </div>
                    )}
                    {error && (
                        <div className="text-red-500 p-4 bg-red-50 rounded-lg">
                            {error}
                        </div>
                    )}
                </div>
                <form onSubmit={handleSubmit} className="p-4 border-t">
                    <div className="flex space-x-4">
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
                            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Send
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
} 