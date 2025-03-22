import { useState } from 'react';
import { Message as MessageComponent } from './Message';
import ChatHistory from './ChatHistory';
import { useChatHistory } from '../hooks/useChatHistory';

export default function Chat() {
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [streamingContent, setStreamingContent] = useState('');

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

        const userMessage = input.trim();
        setInput('');
        setIsLoading(true);

        addMessage({
            role: 'user',
            content: userMessage,
        });

        try {
            const apiUrl = process.env.NEXT_PUBLIC_CHAT_API_URL || 'http://localhost:8000';
            const response = await fetch(`${apiUrl}/ask`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt: userMessage }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('text/event-stream')) {
                const reader = response.body?.getReader();
                if (!reader) throw new Error('No reader available');

                let accumulatedContent = '';
                const decoder = new TextDecoder();

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;

                    const chunk = decoder.decode(value);
                    const lines = chunk.split('\n');

                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.done) {
                                    setIsLoading(false);
                                    break;
                                }
                                if (parsed.content) {
                                    accumulatedContent += parsed.content;
                                    setStreamingContent(accumulatedContent);
                                }
                            } catch (e) {
                                setError(e as string);
                                console.error('Error parsing SSE data:', e);
                            }
                        }
                    }
                }
            } else {
                const data = await response.json();
                addMessage({
                    role: 'assistant',
                    content: data.response,
                });
                setIsLoading(false);
            }
        } catch (error) {
            console.error('Error:', error);
            setError(error as string);
            addMessage({
                role: 'assistant',
                content: 'Sorry, there was an error processing your request.',
            });
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
                    {streamingContent && (
                        <MessageComponent
                            message={{
                                content: streamingContent,
                                role: 'assistant'
                            }}
                        />
                    )}
                    {isLoading && !streamingContent && (
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