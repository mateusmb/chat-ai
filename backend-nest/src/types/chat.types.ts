export interface PromptRequest {
    prompt: string;
}

export interface PromptResponse {
    response: string;
    source: 'openai' | 'fallback';
}

export type FallbackResponse = string; 