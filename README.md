# AI Chat API

A FastAPI-based API that provides AI-powered responses using OpenAI's GPT models with a fallback mechanism.

## Features

- POST `/ask` endpoint for sending prompts to the AI model
- Automatic fallback to rule-based responses when OpenAI is unavailable
- Swagger documentation available at `/docs`
- Environment variable configuration
- Comprehensive test suite

## Prerequisites

- Python 3.8 or higher
- OpenAI API key

## Setup

1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd backend
   ```
3. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate
   ```
   
   On Windows, execute 
   ```bash
   . venv\scripts\activate
   ``` 
4. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
5. Copy the `.env.example` file to `.env`:
   ```bash
   cp .env.example .env
   ```
6. Edit the `.env` file and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   MODEL_NAME=gpt-3.5-turbo  # or gpt-4
   ```

## Running the API

Start the server with:
```bash
uvicorn main:app --reload
```

The API will be available at `http://localhost:8000`

## API Endpoints

### POST /ask
Send a prompt to the AI model.

Request body:
```json
{
    "prompt": "Your question here"
}
```

Response:
```json
{
    "response": "AI generated response",
    "source": "openai"
}
```

### GET /
Welcome message and documentation link.

### GET /docs
Interactive API documentation (Swagger UI)

## Running Tests

Run the test suite with:
```bash
pytest
```

## Error Handling

The API includes a fallback mechanism that provides rule-based responses when the OpenAI service is unavailable. The response will indicate whether it came from OpenAI or the fallback system.

## Security

- API keys are stored in environment variables
- The `.env` file is included in `.gitignore` to prevent accidental commits 