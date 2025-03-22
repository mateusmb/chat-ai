# Chat AI Application

A chat application with two backend implementations (FastAPI and NestJS) and a Next.js frontend.

## Prerequisites

- Docker and Docker Compose
- Make (optional, for using Makefile commands)
- OpenAI API key

## Quick Start with Docker

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd chat-ai
   ```

2. Set up environment files:
   ```bash
   make setup
   ```

3. Update the environment files with your API keys and configuration:
   - `backend-fastapi/.env`: Add your OpenAI API key
   - `backend-nest/.env`: Add your OpenAI API key
   - `frontend/.env.local`: Configure the backend URL (default: http://localhost:8000, set to http://localhost:4000 to use the NestJs backend)

4. Start the application:
   ```bash
   make start
   ```

5. Access the application:
   - Frontend: http://localhost:3000
   - FastAPI Backend: http://localhost:8000
   - FastAPI docs: http://localhost:8000/docs
   - NestJS Backend: http://localhost:4000

## Docker Commands

- Start all services: `make start`
- Stop all services: `make stop`
- Rebuild containers: `make build`
- View logs: `make logs`
- Clean up Docker resources: `make clean`
- Set up environment files: `make setup`

## Manual Setup (Without Docker)

### FastAPI Backend

1. Navigate to the FastAPI backend directory:
   ```bash
   cd backend-fastapi
   ```

2. Create and activate a virtual environment:
   ```bash
   pipenv install
   pipenv shell
   ```

3. Copy the environment file and update with your API key:
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key
   ```

4. Run the application:
   ```bash
   uvicorn main:app --reload
   ```

The FastAPI backend will be available at http://localhost:8000

### NestJS Backend

1. Navigate to the NestJS backend directory:
   ```bash
   cd backend-nest
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and update with your API key:
   ```bash
   cp .env.example .env
   # Edit .env with your OpenAI API key
   ```

4. Run the application:
   ```bash
   npm run start:dev
   ```

The NestJS backend will be available at http://localhost:4000

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment file and configure the backend URL:
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your preferred backend URL
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

The frontend will be available at http://localhost:3000

## Testing

### FastAPI Backend Tests

Run the tests using pytest:
```bash
cd backend-fastapi
pipenv run pytest
```

Options:
- `pipenv run pytest -v` for verbose output
- `pipenv run pytest --cov=.` for coverage report
- `pipenv run pytest test_api.py` to run a specific test file

The test suite covers:
- Unit tests
- Integration tests
- Error handling scenarios

### NestJS Backend Tests

Run the tests using Jest:
```bash
cd backend-nest
npm test
```

Options:
- `npm test -- --watch` for watch mode
- `npm test -- --coverage` for coverage report
- `npm test -- chat.service.spec.ts` to run a specific test file

The test suite covers:
- Unit tests for ChatService
- Integration tests for ChatController
- Error handling scenarios

## Features

- Real-time chat interface
- Support for both FastAPI and NestJS backends
- Streaming responses
- Chat history management
- Responsive design
- Error handling
- Loading states
- Environment-based configuration

## Environment Variables

### Backend FastAPI
- `OPENAI_API_KEY`: Your OpenAI API key
- `MODEL_NAME`: OpenAI model to use (default: gpt-3.5-turbo)

### Backend NestJS
- `OPENAI_API_KEY`: Your OpenAI API key
- `MODEL_NAME`: OpenAI model to use (default: gpt-3.5-turbo)

### Frontend
- `NEXT_PUBLIC_CHAT_API_URL`: URL of the backend service (default: http://localhost:8000)
