from fastapi import APIRouter, Depends
from openai import OpenAI
import os
from models import PromptRequest, PromptResponse


router = APIRouter()


def get_fallback_response(prompt: str) -> str:
    """Generate a rule-based fallback response when OpenAI is unavailable."""
    prompt_lower = prompt.lower()
    
    if "hello" in prompt_lower or "hi" in prompt_lower:
        return "Hello! I'm currently in fallback mode. How can I help you?"
    elif "how are you" in prompt_lower:
        return "I'm functioning in fallback mode, but I'm here to help!"
    elif "?" in prompt:
        return "I apologize, but I'm currently in fallback mode and can't provide detailed answers."
    else:
        return "I'm currently in fallback mode. Please try again later or rephrase your question."


def setup_routes(app, get_client):
    """Setup routes with the provided OpenAI client getter"""
    
    @router.get("/")
    async def root():
        return {"message": "Welcome to the AI Chat API. Use /docs to see the API documentation."}

    @router.post("/ask", response_model=PromptResponse)
    async def ask_question(request: PromptRequest, client: OpenAI = Depends(get_client)):
        """
        Process a user prompt and return an AI-generated response.

        This endpoint attempts to get a response from OpenAI's GPT model. If the OpenAI service
        is unavailable, it falls back to rule-based responses based on the prompt content.

        Args:
            request (PromptRequest): The request containing the user's prompt.

        Returns:
            PromptResponse: An object containing:
                - response (str): The AI-generated or fallback response
                - source (str): Either "openai" or "fallback" indicating the response source

        Example:
            Request:
            {
                "prompt": "What is the capital of France?"
            }
            Response:
            {
                "response": "The capital of France is Paris.",
                "source": "openai"
            }
        """
        try:
            response = client.chat.completions.create(
                model=os.getenv("MODEL_NAME", "gpt-3.5-turbo"),
                messages=[
                    {"role": "user", "content": request.prompt}
                ]
            )
            
            return PromptResponse(
                response=response.choices[0].message.content,
                source="openai"
            )
        except Exception as e:
            return PromptResponse(
                response=get_fallback_response(request.prompt),
                source="fallback"
            ) 