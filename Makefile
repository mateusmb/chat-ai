.PHONY: start stop build clean logs

start:
	docker-compose up -d

stop:
	docker-compose down

build:
	docker-compose build

clean:
	docker-compose down -v
	docker system prune -f

logs:
	docker-compose logs -f

setup:
	@echo "Setting up environment files..."
	@if [ ! -f backend-fastapi/.env ]; then cp backend-fastapi/.env.example backend-fastapi/.env; fi
	@if [ ! -f backend-nest/.env ]; then cp backend-nest/.env.example backend-nest/.env; fi
	@if [ ! -f frontend/.env.local ]; then cp frontend/.env.example frontend/.env.local; fi
	@echo "Please update the environment files with your API keys and configuration" 