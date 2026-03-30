from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.db.session import engine
from app.db import models
from app.api.routes import auth, metrics, ws, ai

# Create tables on startup
models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="DevPulse",
    description="Real-time infrastructure monitoring dashboard",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(metrics.router)
app.include_router(ws.router)
app.include_router(ai.router)


@app.get("/health", tags=["health"])
def health():
    return {"status": "ok"}
