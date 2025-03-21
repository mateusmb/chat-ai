import os
from fastapi import APIRouter, Depends, HTTPException
from openai import OpenAI
from config import get_openai_client
import json
from fastapi.responses import StreamingResponse
from models import PromptRequest


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


@router.get("/")
async def root():
    return {"message": "Welcome to the AI Chat API. Use /docs to see the API documentation."}


async def stream_openai_response(client: OpenAI, prompt: str):
    try:
        response = client.chat.completions.create(
            model=os.getenv("MODEL_NAME", "gpt-3.5-turbo"),
            messages=[{"role": "user", "content": prompt}],
            stream=True
        )
        
        for chunk in response:
            if chunk.choices[0].delta.content is not None:
                yield f"data: {json.dumps({'content': chunk.choices[0].delta.content})}\n\n"
        
        yield f"data: {json.dumps({'done': True})}\n\n"
    except Exception as e:
        fallback = get_fallback_response(prompt)
        yield f"data: {json.dumps({'content': fallback})}\n\n"
        yield f"data: {json.dumps({'done': True})}\n\n"


@router.post("/ask")
async def ask(prompt: PromptRequest, client: OpenAI = Depends(get_openai_client)):
    """
    Process a user prompt and return a streaming AI-generated response.

    This endpoint accepts a prompt and returns a Server-Sent Events (SSE) stream containing
    the AI-generated response. If the OpenAI service is unavailable, it falls back to
    rule-based responses based on the prompt content.

    Args:
        prompt (PromptRequest): The request containing the user's prompt.
        client (OpenAI): The OpenAI client instance (injected via dependency).

    Returns:
        StreamingResponse: A text/event-stream response containing:
            - Content chunks: {"content": "chunk of text"}
            - Completion marker: {"done": true}
            - Error handling: Falls back to rule-based responses if OpenAI fails

    Example:
        Request:
        {
            "prompt": "What is the capital of France?"
        }
        Response (stream):
        data: {"content": "The capital of France is Paris."}
        data: {"done": true}

    Raises:
        HTTPException: 500 status code if there's an error processing the request.
    """
    try:
        return StreamingResponse(
            stream_openai_response(client, prompt.prompt),
            media_type="text/event-stream"
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 