from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import desc
from pydantic import BaseModel

from app.db.session import get_db
from app.db.models import MetricSnapshot, User
from app.api.routes.auth import get_current_user
from app.services.ai_service import ask_about_metrics
from app.core.config import settings

router = APIRouter(prefix="/ai", tags=["ai"])


class AskRequest(BaseModel):
    question: str


@router.post("/ask")
def ask(
    req: AskRequest,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    if not settings.OPEN_ROUTER_API_KEY:
        raise HTTPException(status_code=503, detail="OpenRouter API key not configured")
    recent = (
        db.query(MetricSnapshot)
        .order_by(desc(MetricSnapshot.timestamp))
        .limit(60)
        .all()
    )
    metrics = [
        {
            "timestamp": r.timestamp.isoformat(),
            "cpu": r.cpu,
            "memory": r.memory,
            "api_latency_ms": r.api_latency_ms,
            "error_rate": r.error_rate,
        }
        for r in reversed(recent)
    ]
    answer = ask_about_metrics(req.question, metrics)
    return {"answer": answer}
