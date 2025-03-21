import os
from unittest.mock import patch, MagicMock


os.environ["OPENAI_API_KEY"] = "test-api-key"
os.environ["MODEL_NAME"] = "gpt-3.5-turbo"


import pytest
from fastapi.testclient import TestClient
from main import create_app


@pytest.fixture
def mock_openai_client():
    """Create a mock OpenAI client"""
    mock_client = MagicMock()
    return mock_client


@pytest.fixture
def test_app(mock_openai_client):
    """Create a test application instance"""
    return create_app(openai_client=mock_openai_client)


@pytest.fixture
def test_client(test_app):
    """Create a test client"""
    return TestClient(test_app)


def test_root_endpoint(test_client):
    response = test_client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to the AI Chat API. Use /docs to see the API documentation."}


def test_ask_endpoint_success(test_client, mock_openai_client):
    mock_response = MagicMock()
    mock_response.choices = [
        MagicMock(message=MagicMock(content="This is a test response"))
    ]
    mock_openai_client.chat.completions.create.return_value = mock_response
    
    response = test_client.post("/ask", json={"prompt": "Hello"})
    assert response.status_code == 200
    assert response.json()["response"] == "This is a test response"
    assert response.json()["source"] == "openai"


def test_ask_endpoint_invalid_request(test_client):
    response = test_client.post("/ask", json={})
    assert response.status_code == 422


def test_ask_endpoint_fallback(test_client, mock_openai_client):
    mock_openai_client.chat.completions.create.side_effect = Exception("API Error")
    
    response = test_client.post("/ask", json={"prompt": "Hello"})
    assert response.status_code == 200
    assert "fallback mode" in response.json()["response"]
    assert response.json()["source"] == "fallback"


def test_fallback_responses(test_client, mock_openai_client):
    mock_openai_client.chat.completions.create.side_effect = Exception("API Error")
    
    response = test_client.post("/ask", json={"prompt": "Hello"})
    assert response.status_code == 200
    assert "Hello! I'm currently in fallback mode" in response.json()["response"]
    assert response.json()["source"] == "fallback"
    
    response = test_client.post("/ask", json={"prompt": "Hi there"})
    assert response.status_code == 200
    assert "Hello! I'm currently in fallback mode" in response.json()["response"]
    assert response.json()["source"] == "fallback"
    
    response = test_client.post("/ask", json={"prompt": "How are you?"})
    assert response.status_code == 200
    assert "I'm functioning in fallback mode" in response.json()["response"]
    assert response.json()["source"] == "fallback"
    
    response = test_client.post("/ask", json={"prompt": "What is the weather?"})
    assert response.status_code == 200
    assert "I apologize, but I'm currently in fallback mode" in response.json()["response"]
    assert response.json()["source"] == "fallback"
    
    response = test_client.post("/ask", json={"prompt": "Random text"})
    assert response.status_code == 200
    assert "I'm currently in fallback mode" in response.json()["response"]
    assert response.json()["source"] == "fallback" 