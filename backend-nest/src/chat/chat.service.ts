import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { Observable } from 'rxjs';
import { PromptRequest } from '../types/chat.types';

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

    async streamResponse(prompt: PromptRequest): Promise<Observable<string>> {
        try {
            const response = await this.openai.chat.completions.create({
                model: this.configService.get<string>('MODEL_NAME', 'gpt-3.5-turbo'),
                messages: [{ role: 'user', content: prompt.prompt }],
                stream: true,
            });

            return new Observable<string>(subscriber => {
                const processStream = async () => {
                    try {
                        for await (const chunk of response) {
                            if (chunk.choices[0]?.delta?.content) {
                                subscriber.next(chunk.choices[0].delta.content);
                            }
                        }
                        subscriber.next('data: {"done": true}\n\n');
                        subscriber.complete();
                    } catch (error) {
                        subscriber.error(error);
                    }
                };

                processStream();
            });
        } catch (error) {
            const fallback = this.getFallbackResponse(prompt.prompt);
            return new Observable<string>(subscriber => {
                subscriber.next(fallback);
                subscriber.next('data: {"done": true}\n\n');
                subscriber.complete();
            });
        }
    }
} 