import os
from openai import OpenAI
from functools import lru_cache

@lru_cache()
def get_openai_client() -> OpenAI:
    """Get or create an OpenAI client instance."""
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        raise ValueError("OPENAI_API_KEY environment variable is not set")
    return OpenAI(api_key=api_key) 