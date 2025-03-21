from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os
from dotenv import load_dotenv
from routes import router, setup_routes


def get_openai_client():
    """Get OpenAI client with API key from environment"""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    return OpenAI(api_key=api_key)


def create_app():
    """Create and configure the FastAPI application"""
    load_dotenv()
    
    app = FastAPI(
        title="AI Chat API",
        description="An API that provides AI-powered responses using OpenAI's GPT models",
        version="1.0.0"
    )

    # Configure CORS
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:3000"],  # Frontend URL
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Setup routes with dependency injection
    setup_routes(app, get_openai_client)
    app.include_router(router)

    return app


app = create_app() 