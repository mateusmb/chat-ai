import { Controller, Post, Body, Sse } from '@nestjs/common';
import { ChatService } from './chat.service';
import { PromptRequest } from '../types/chat.types';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface SseMessage {
    data: string;
    type: string;
    id: string;
    retry: number;
}

@Controller('chat')
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post('ask')
    @Sse()
    async ask(@Body() prompt: PromptRequest): Promise<Observable<SseMessage>> {
        const stream = await this.chatService.streamResponse(prompt);
        
        return stream.pipe(
            map(data => ({
                data: data.startsWith('data: ') ? data : `data: ${JSON.stringify({ content: data })}\n\n`,
                type: 'message',
                id: Date.now().toString(),
                retry: 0,
            }))
        );
    }
} 