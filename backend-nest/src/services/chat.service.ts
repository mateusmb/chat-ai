import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { PromptRequest, PromptResponse } from '../types/chat.types';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ChatService {
    private openai: OpenAI;

    constructor(private configService: ConfigService) {
        this.openai = new OpenAI({
            apiKey: this.configService.get<string>('OPENAI_API_KEY'),
        });
    }

    private getFallbackResponse(prompt: string): string {
        const promptLower = prompt.toLowerCase();
        
        if (promptLower.includes('hello') || promptLower.includes('hi')) {
            return "Hello! I'm currently in fallback mode. How can I help you?";
        } else if (promptLower.includes('how are you')) {
            return "I'm functioning in fallback mode, but I'm here to help!";
        } else if (prompt.includes('?')) {
            return "I apologize, but I'm currently in fallback mode and can't provide detailed answers.";
        } else {
            return "I'm currently in fallback mode. Please try again later or rephrase your question.";
        }
    }

    async handlePrompt(promptRequest: PromptRequest): Promise<PromptResponse> {
        try {
            const response = await this.openai.chat.completions.create({
                model: this.configService.get<string>('MODEL_NAME', 'gpt-3.5-turbo'),
                messages: [
                    { role: 'user', content: promptRequest.prompt }
                ]
            });

            const content = response.choices[0].message.content;
            if (content === null) {
                return {
                    response: 'No response generated',
                    source: 'openai'
                };
            }

            return {
                response: content,
                source: 'openai'
            };
        } catch (error) {
            return {
                response: this.getFallbackResponse(promptRequest.prompt),
                source: 'fallback'
            };
        }
    }
} 