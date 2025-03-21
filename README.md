# AI Chat API

A FastAPI-based REST API that provides AI-powered chat functionality using OpenAI's GPT models.

## Features

- AI-powered chat responses using OpenAI's GPT models
- Fallback mechanism when OpenAI service is unavailable
- Environment variable configuration
- Comprehensive test suite
- API documentation with Swagger UI and ReDoc

## Prerequisites

- Python 3.8 or higher
- pipenv (for dependency management)
- OpenAI API key

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd chat-ai
```

2. Install dependencies using pipenv:
```bash
pipenv install
```

3. Create a `.env` file in the project root with your OpenAI API key:
```bash
OPENAI_API_KEY=your-api-key-here
MODEL_NAME=gpt-3.5-turbo
```

## Running the Application

1. Activate the virtual environment:
```bash
pipenv shell
```

2. Start the server:
```bash
cd backend
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Documentation

Once the server is running, you can access:
- Swagger UI documentation at `http://localhost:8000/docs`
- ReDoc documentation at `http://localhost:8000/redoc`

## Testing

Run the test suite:
```bash
pytest
```

## API Endpoints

### GET /
Welcome message and API information

### POST /ask
Send a prompt to get an AI-generated response

Request body:
```json
{
    "prompt": "Your question or prompt here"
}
```

Response:
```json
{
    "response": "AI-generated response",
    "source": "openai" | "fallback"
}
```

## Project Structure

```
chat-ai/
├── backend/
│   ├── __init__.py
│   ├── main.py
│   ├── models.py
│   ├── routes.py
│   └── test_api.py
├── .env
├── .gitignore
├── Pipfile
├── Pipfile.lock
└── README.md
```

## Development

The project uses:
- FastAPI for the web framework
- Pydantic for data validation
- pytest for testing
- pipenv for dependency management

## License

MIT License 