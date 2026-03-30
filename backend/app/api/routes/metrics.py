from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime, timedelta, timezone

from app.db.session import get_db
from app.db.models import MetricSnapshot, User
from app.api.routes.auth import get_current_user

router = APIRouter(prefix="/metrics", tags=["metrics"])


@router.get("/history")
def get_history(
    minutes: int = Query(default=60, ge=1, le=1440),
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
):
    since = datetime.now(timezone.utc) - timedelta(minutes=minutes)
    rows = (
        db.query(MetricSnapshot)
        .filter(MetricSnapshot.timestamp >= since)
        .order_by(desc(MetricSnapshot.timestamp))
        .limit(500)
        .all()
    )
    return [
        {
            "timestamp": r.timestamp.isoformat(),
            "cpu": r.cpu,
            "memory": r.memory,
            "api_latency_ms": r.api_latency_ms,
            "error_rate": r.error_rate,
        }
        for r in reversed(rows)
    ]
