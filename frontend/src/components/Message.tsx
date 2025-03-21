import { Message as MessageType } from '../types/chat';

interface MessageProps {
    message: MessageType;
}

export default function Message({ message }: MessageProps) {
    return (
        <div className={`flex ${message.isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                    message.isUser
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 text-gray-800'
                }`}
            >
                {message.content}
            </div>
        </div>
    );
} 