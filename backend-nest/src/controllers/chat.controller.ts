import { Controller, Post, Body } from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { PromptRequest, PromptResponse } from '../types/chat.types';

@Controller()
export class ChatController {
    constructor(private readonly chatService: ChatService) {}

    @Post('ask')
    async handlePrompt(@Body() promptRequest: PromptRequest): Promise<PromptResponse> {
        return this.chatService.handlePrompt(promptRequest);
    }
} 