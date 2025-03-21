import { ChatHistory as ChatHistoryType } from '../types/chat';

interface ChatHistoryProps {
    histories: ChatHistoryType[];
    currentHistoryId: string | null;
    onSwitchChat: (id: string) => void;
    onDeleteChat: (id: string) => void;
    onCreateNewChat: () => void;
}

export default function ChatHistory({
    histories,
    currentHistoryId,
    onSwitchChat,
    onDeleteChat,
    onCreateNewChat
}: ChatHistoryProps) {
    const formatDate = (timestamp: number) => {
        return new Date(timestamp).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="w-64 bg-gray-100 p-4 flex flex-col h-full">
            <button
                onClick={onCreateNewChat}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
                New Chat
            </button>
            <div className="flex-1 overflow-y-auto space-y-2">
                {histories.map(history => (
                    <div
                        key={history.id}
                        className={`p-3 rounded-lg cursor-pointer flex justify-between items-center ${
                            currentHistoryId === history.id
                                ? 'bg-blue-100'
                                : 'hover:bg-gray-200'
                        }`}
                    >
                        <div
                            className="flex-1"
                            onClick={() => onSwitchChat(history.id)}
                        >
                            <div className="font-medium truncate text-gray-900">
                                {history.messages[1]?.content || 'New Chat'}
                            </div>
                            <div className="text-sm text-gray-500">
                                {formatDate(history.timestamp)}
                            </div>
                        </div>
                        <button
                            onClick={() => onDeleteChat(history.id)}
                            className="ml-2 p-1 text-gray-500 hover:text-red-500"
                        >
                            <svg
                                className="w-5 h-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                />
                            </svg>
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
} 