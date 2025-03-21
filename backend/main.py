from fastapi import FastAPI
from pydantic import BaseModel
from openai import OpenAI
import os
from dotenv import load_dotenv

def get_openai_client():
    """Get OpenAI client with API key from environment"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    return OpenAI(api_key=api_key)

def create_app(openai_client=None):
    """Create and configure the FastAPI application"""
    load_dotenv()
    
    app = FastAPI(
        title="AI Chat API",
        description="An API that provides AI-powered responses using OpenAI's GPT models",
        version="1.0.0"
    )

    client = openai_client or get_openai_client()

    class PromptRequest(BaseModel):
        prompt: str

    class PromptResponse(BaseModel):
        response: str
        source: str

    def get_fallback_response(prompt: str) -> str:
        """Generate a rule-based fallback response when OpenAI is unavailable."""
        prompt_lower = prompt.lower()
        
        if "hello" in prompt_lower or "hi" in prompt_lower:
            return "Hello! I'm currently in fallback mode. Please try again later!"
        elif "how are you" in prompt_lower:
            return "I'm functioning in fallback mode, please try again later!"
        elif "?" in prompt:
            return "I apologize, but I'm currently in fallback mode and can't provide detailed answers. Please try again later."
        else:
            return "I'm currently in fallback mode. Please try again later."

    @app.post("/ask", response_model=PromptResponse)
    async def ask_question(request: PromptRequest):
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

    @app.get("/")
    async def root():
        return {"message": "Welcome to the AI Chat API. Use /docs to see the API documentation."}

    return app


app = create_app() 