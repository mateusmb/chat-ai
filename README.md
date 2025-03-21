# Chat AI Project

A chat application with AI capabilities, featuring FastAPI and NestJs backend implementations and a NextJs frontend.

## Backends

### FastAPI Backend (Default)

The FastAPI backend provides a simple and efficient implementation of the chat API.

#### Setup and Running

1. Navigate to the backend directory:
   ```bash
   cd backend-fastapi
   ```

2. Install dependencies using pipenv:
   ```bash
   pipenv install
   ```

3. Create a `.env` file with your OpenAI API key:
   ```
   OPENAI_API_KEY=your_api_key_here
   MODEL_NAME=gpt-3.5-turbo
   ```

4. Run the server:
   ```bash
   pipenv run uvicorn main:app --reload
   ```

The FastAPI backend will be available at `http://localhost:8000`.

#### Testing

The FastAPI backend includes a comprehensive test suite. You can run tests using the following commands:

- Run all tests:
  ```bash
  pipenv run pytest
  ```

- Run tests with verbose output:
  ```bash
  pipenv run pytest -v
  ```

- Run tests with coverage report:
  ```bash
  pipenv run pytest --cov=.
  ```

- Run a specific test file:
  ```bash
  pipenv run pytest test_api.py
  ```

The test suite includes:
- Unit tests for the chat functionality
- Integration tests for the API endpoints
- Mocked OpenAI responses
- Fallback response testing
- Error handling scenarios

### NestJS Backend

The NestJS backend provides an alternative implementation with TypeScript and a more structured architecture.

#### Setup and Running

1. Navigate to the NestJS backend directory:
   ```bash
   cd backend-nest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with your OpenAI API key:
   ```
   PORT=4000
   OPENAI_API_KEY=your_api_key_here
   MODEL_NAME=gpt-3.5-turbo
   FRONTEND_URL=http://localhost:3000
   ```

4. Run the development server:
   ```bash
   npm run start:dev
   ```

The NestJS backend will be available at `http://localhost:4000`.

#### Testing

The NestJS backend includes a comprehensive test suite. You can run tests using the following commands:

- Run all tests:
  ```bash
  npm test
  ```

- Run tests in watch mode:
  ```bash
  npm run test:watch
  ```

- Run tests with coverage report:
  ```bash
  npm run test:cov
  ```

## Frontend

The frontend is built with Next.js, TypeScript, and Tailwind CSS, providing a modern and responsive user interface.

### Setup and Running

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file to configure the backend URL:
   ```
   CHAT_API_URL=http://localhost:8000  # For FastAPI backend
   # or
   CHAT_API_URL=http://localhost:4000  # For NestJS backend
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`.

### Features

- Real-time chat interface
- Support for both FastAPI and NestJS backends
- Configurable backend URL through environment variables
- Responsive design with Tailwind CSS
- Loading states and error handling
- Auto-scrolling chat messages

### Switching Between Backends

To switch between backends, simply update the `CHAT_API_URL` in the frontend's `.env` file:
- For FastAPI: `CHAT_API_URL=http://localhost:8000`
- For NestJS: `CHAT_API_URL=http://localhost:4000`

After changing the URL, restart the frontend development server for the changes to take effect.

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
pipenv install
pipenv install --dev
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
