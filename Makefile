.PHONY: up down logs build restart backend-dev frontend-dev test install install-backend install-frontend setup db-shell

VENV := backend/.venv
PYTHON := $(VENV)/bin/python
PIP := $(VENV)/bin/pip
UVICORN := $(VENV)/bin/uvicorn
PYTEST := $(VENV)/bin/pytest

# ── Docker ──────────────────────────────────────────────────────────
up:
	docker compose up -d

down:
	docker compose down

build:
	docker compose build

restart:
	docker compose down && docker compose up -d

logs:
	docker compose logs -f

logs-backend:
	docker compose logs -f backend

logs-db:
	docker compose logs -f postgres

# ── Local dev ────────────────────────────────────────────────────────
backend-dev: $(VENV)
	cd backend && ../$(UVICORN) app.main:app --reload --port 8000

frontend-dev:
	cd frontend && npm run dev

# ── Tests ────────────────────────────────────────────────────────────
test: $(VENV)
	cd backend && ../$(PYTEST) -v

# ── Setup ────────────────────────────────────────────────────────────
$(VENV):
	python3 -m venv $(VENV)

install-backend: $(VENV)
	$(PIP) install -r backend/requirements.txt

install-frontend:
	cd frontend && npm install

install: install-backend install-frontend

# Creates .env from example if it doesn't exist
setup: install
	@if [ ! -f backend/.env ]; then \
		cp backend/.env.example backend/.env; \
		echo "Created backend/.env — add your OPENAI_API_KEY to it"; \
	fi

# ── Postgres (local, no Docker) ──────────────────────────────────────
db-shell:
	psql postgresql://devpulse:devpulse@localhost:5432/devpulse
