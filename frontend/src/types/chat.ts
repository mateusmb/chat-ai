export interface Message {
    content: string;
    isUser: boolean;
}

export interface ChatResponse {
    response: string;
    source: 'openai' | 'fallback';
} 