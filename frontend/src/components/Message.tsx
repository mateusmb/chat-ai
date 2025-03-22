import React from 'react';
import { Message as MessageType } from '../types/chat';

interface MessageProps {
    message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
    const isUser = message.role === 'user';

    return (
        <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
            <div
                className={`max-w-[70%] rounded-lg p-3 ${
                    isUser
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-900'
                }`}
            >
                <p className="whitespace-pre-wrap">{message.content}</p>
                {message.timestamp && (
                    <span className="text-xs opacity-70 mt-1 block">
                        {message.timestamp.toLocaleTimeString()}
                    </span>
                )}
            </div>
        </div>
    );
}; 