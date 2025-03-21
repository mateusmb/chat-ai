import { useState, useEffect } from 'react';
import { Message, ChatHistory, ChatHistoryState } from '../types/chat';

const STORAGE_KEY = 'chat-history';

const initialHistory: ChatHistory = {
    id: '1',
    messages: [
        {
            content: "Hello! I am your AI assistant. Please, ask me anything!",
            isUser: false
        }
    ],
    timestamp: Date.now()
};

const initialState: ChatHistoryState = {
    histories: [initialHistory],
    currentHistoryId: '1'
};

export function useChatHistory() {
    const [state, setState] = useState<ChatHistoryState>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem(STORAGE_KEY);
            return saved ? JSON.parse(saved) : initialState;
        }
        return initialState;
    });

    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }, [state]);

    const addMessage = (message: Message) => {
        setState(prev => {
            const histories = prev.histories.map(history => {
                if (history.id === prev.currentHistoryId) {
                    return {
                        ...history,
                        messages: [...history.messages, message],
                        timestamp: Date.now()
                    };
                }
                return history;
            });

            return {
                ...prev,
                histories
            };
        });
    };

    const createNewChat = () => {
        const newHistory: ChatHistory = {
            id: Date.now().toString(),
            messages: [
                {
                    content: "Hello! I am your AI assistant. Please, ask me anything!",
                    isUser: false
                }
            ],
            timestamp: Date.now()
        };

        setState(prev => ({
            histories: [...prev.histories, newHistory],
            currentHistoryId: newHistory.id
        }));
    };

    const switchChat = (id: string) => {
        setState(prev => ({
            ...prev,
            currentHistoryId: id
        }));
    };

    const deleteChat = (id: string) => {
        setState(prev => {
            const histories = prev.histories.filter(history => history.id !== id);
            const currentHistoryId = prev.currentHistoryId === id
                ? histories[0]?.id || null
                : prev.currentHistoryId;

            return {
                histories,
                currentHistoryId
            };
        });
    };

    const currentMessages = state.histories.find(
        history => history.id === state.currentHistoryId
    )?.messages || [];

    return {
        histories: state.histories,
        currentHistoryId: state.currentHistoryId,
        currentMessages,
        addMessage,
        createNewChat,
        switchChat,
        deleteChat
    };
} 