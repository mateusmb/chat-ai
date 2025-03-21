import { Test, TestingModule } from '@nestjs/testing';
import { ChatService } from './chat.service';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';

const mockChatCompletions = {
    create: jest.fn()
};

const mockChat = {
    completions: mockChatCompletions
};

const mockOpenAI = {
    chat: mockChat
};

jest.mock('openai', () => ({
    __esModule: true,
    default: jest.fn().mockImplementation(() => mockOpenAI)
}));

describe('ChatService', () => {
    let service: ChatService;
    let configService: ConfigService;

    const mockConfigService = {
        get: jest.fn((key: string) => {
            switch (key) {
                case 'OPENAI_API_KEY':
                    return 'test-api-key';
                case 'MODEL_NAME':
                    return 'gpt-3.5-turbo';
                default:
                    return undefined;
            }
        }),
    };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                ChatService,
                {
                    provide: ConfigService,
                    useValue: mockConfigService,
                },
            ],
        }).compile();

        service = module.get<ChatService>(ChatService);
        configService = module.get<ConfigService>(ConfigService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('handlePrompt', () => {
        it('should return OpenAI response when successful', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: 'Test response from OpenAI'
                    }
                }]
            };

            mockChatCompletions.create.mockResolvedValue(mockResponse);

            const result = await service.handlePrompt({ prompt: 'test prompt' });

            expect(mockChatCompletions.create).toHaveBeenCalledWith({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: 'test prompt' }]
            });

            expect(result).toEqual({
                response: 'Test response from OpenAI',
                source: 'openai'
            });
        });

        it('should return fallback response when OpenAI fails', async () => {
            mockChatCompletions.create.mockRejectedValue(new Error('API Error'));

            const result = await service.handlePrompt({ prompt: 'hello' });

            expect(result).toEqual({
                response: "Hello! I'm currently in fallback mode. How can I help you?",
                source: 'fallback'
            });
        });

        it('should handle null content from OpenAI', async () => {
            const mockResponse = {
                choices: [{
                    message: {
                        content: null
                    }
                }]
            };

            mockChatCompletions.create.mockResolvedValue(mockResponse);

            const result = await service.handlePrompt({ prompt: 'test prompt' });

            expect(mockChatCompletions.create).toHaveBeenCalledWith({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: 'test prompt' }]
            });

            expect(result).toEqual({
                response: 'No response generated',
                source: 'openai'
            });
        });
    });
}); 