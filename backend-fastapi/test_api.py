import os
from unittest.mock import patch, MagicMock
os.environ["OPENAI_API_KEY"] = "test-api-key"
os.environ["MODEL_NAME"] = "gpt-3.5-turbo"
import pytest
from fastapi.testclient import TestClient
from main import app
from config import get_openai_client


@pytest.fixture
def mock_openai_client():
    """Create a mock OpenAI client"""
    mock_client = MagicMock()
    return mock_client


@pytest.fixture
def test_app(mock_openai_client):
    """Create a test application instance"""
    app.dependency_overrides = {get_openai_client: lambda: mock_openai_client}
    return app


@pytest.fixture
def test_client(test_app):
    """Create a test client"""
    return TestClient(test_app)


def test_root_endpoint(test_client):
    response = test_client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the AI Chat API. Use /docs to see the API documentation."}


async def mock_stream_response(*args, **kwargs):
    yield 'data: {"content": "Test response"}\n\n'
    yield 'data: {"done": true}\n\n'


async def mock_error_stream_response(*args, **kwargs):
    yield 'data: {"error": "Test error"}\n\n'
    yield 'data: {"done": true}\n\n'


def test_ask_endpoint_success(test_client):
    with patch("routes.stream_openai_response", side_effect=mock_stream_response):
        response = test_client.post("/ask", json={"prompt": "Test prompt"})
        assert response.status_code == 200
        assert "text/event-stream" in response.headers["content-type"]
        
        content = "".join(response.iter_text())
        assert "Test response" in content


def test_ask_endpoint_error(test_client):
    with patch("routes.stream_openai_response", side_effect=mock_error_stream_response):
        response = test_client.post("/ask", json={"prompt": "Test prompt"})
        assert response.status_code == 200
        assert "text/event-stream" in response.headers["content-type"]
        
        content = "".join(response.iter_text())
        assert "Test error" in content


def test_ask_endpoint_invalid_request(test_client):
    response = test_client.post("/ask", json={})
    assert response.status_code == 422


def test_ask_endpoint_fallback(test_client, mock_openai_client):
    mock_openai_client.chat.completions.create.side_effect = Exception("API Error")
    
    response = test_client.post("/ask", json={"prompt": "Hello"})
    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]
    content = "".join(response.iter_text())
    assert "fallback mode" in content


def test_fallback_responses(test_client, mock_openai_client):
    mock_openai_client.chat.completions.create.side_effect = Exception("API Error")
    
    response = test_client.post("/ask", json={"prompt": "Hello"})
    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]
    content = "".join(response.iter_text())
    assert "Hello! I'm currently in fallback mode" in content
    
    response = test_client.post("/ask", json={"prompt": "Hi there"})
    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]
    content = "".join(response.iter_text())
    assert "Hello! I'm currently in fallback mode" in content
    
    response = test_client.post("/ask", json={"prompt": "How are you?"})
    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]
    content = "".join(response.iter_text())
    assert "I'm functioning in fallback mode" in content
    
    response = test_client.post("/ask", json={"prompt": "What is the weather?"})
    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]
    content = "".join(response.iter_text())
    assert "I apologize, but I'm currently in fallback mode" in content
    
    response = test_client.post("/ask", json={"prompt": "Random text"})
    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]
    content = "".join(response.iter_text())
    assert "I'm currently in fallback mode" in content 
