# DevPulse

A real-time infrastructure monitoring dashboard with an AI assistant. Built to demonstrate full-stack observability tooling across FastAPI, React, WebSockets, PostgreSQL, and LangChain.

<video src="frontend/public/readme-vid.webm" autoplay loop muted playsinline width="100%"></video>

![Dashboard preview](https://github.com/user-attachments/assets/e234a9d3-6dab-4284-a776-e55a748218b0)

---

## What it does

DevPulse simulates a live infrastructure monitoring environment — the kind of internal tooling used at observability-focused companies. Every second, the backend generates CPU, memory, latency, and error rate snapshots, persists them to PostgreSQL, and streams them to the frontend over WebSockets. The dashboard displays live charts and stat cards that update in real time.

An AI chat panel lets you ask natural-language questions about the metrics — "why did latency spike?" or "how's memory trending?" — and get answers backed by the last 60 seconds of actual data.

**Features:**
- Live metric stream via WebSocket (CPU, memory, API latency, error rate)
- Real-time Recharts line charts and stat cards with threshold-based colour alerts
- AI chat assistant powered by Claude over recent DB rows (context stuffing, not RAG)
- JWT authentication with admin and viewer roles
- Protected routes on both frontend and backend
- Full Docker setup — one command to run everything
- REST API with auto-generated OpenAPI docs at `/docs`

---

## Tech stack

| Layer | Technology |
|---|---|
| Backend | FastAPI, Python 3.12, SQLAlchemy 2, Alembic |
| Database | PostgreSQL 16 |
| Auth | JWT (python-jose), bcrypt |
| AI | LangChain, Claude via OpenRouter |
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Charts | Recharts |
| Infrastructure | Docker, docker-compose, Nginx |
| Tests | Pytest, SQLite (test DB) |

---

## Quick start (Docker)

The fastest way to run the full stack:

```bash
git clone https://github.com/Kylehinks97/devpulse.git
cd devpulse
cp .env.example .env
```

Edit `.env` and add your keys:

```env
OPEN_ROUTER_API_KEY=your-openrouter-api-key-here
SECRET_KEY=any-random-string-here
```

Then:

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API docs | http://localhost:8000/docs |

---

## Local development

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL running locally (or keep Docker just for the DB)

### Setup

```bash
# Install all dependencies
make install

# Copy and configure env
cp .env.example backend/.env
# Edit backend/.env with your DATABASE_URL, SECRET_KEY, OPEN_ROUTER_API_KEY
```

### Run

In two terminals:

```bash
# Terminal 1 — backend (with hot reload)
make backend-dev

# Terminal 2 — frontend (with HMR)
make frontend-dev
```

Frontend proxies `/auth`, `/metrics`, and `/ai` to `localhost:8000` via Vite config, so no CORS issues in local dev.

### Run tests

```bash
make test
```

Tests use SQLite so no database setup is needed.

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | PostgreSQL connection string |
| `SECRET_KEY` | Yes | Secret used to sign JWTs — use a long random string in production |
| `OPEN_ROUTER_API_KEY` | No | Needed for the AI chat panel. Get one at openrouter.ai |

---

## Why I built this

I wanted a project that touched the full stack of an observability platform — not just a CRUD app, but something with real-time data flow, a meaningful data model, and an AI layer that actually uses the data rather than just wrapping a chat API.

The architecture maps directly to how production monitoring tools work: a backend that ingests and stores time-series data, a WebSocket layer for live delivery, a query layer for historical analysis, and an LLM that reasons over recent state. Building it end-to-end gave me a solid understanding of where the interesting engineering challenges are in that stack — particularly around how you structure data so an LLM can answer questions about it usefully.
