export interface Message {
    content: string;
    role: 'user' | 'assistant';
    timestamp?: Date;
}

export interface ChatResponse {
    response: string;
    source: 'openai' | 'fallback';
}

export interface ChatHistory {
    id: string;
    messages: Message[];
    timestamp: number;
}

export interface ChatHistoryState {
    histories: ChatHistory[];
    currentHistoryId: string | null;
} 