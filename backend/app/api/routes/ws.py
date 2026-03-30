import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from sqlalchemy.orm import Session

from app.db.session import SessionLocal
from app.db.models import MetricSnapshot
from app.services.simulator import generate_metric

router = APIRouter(tags=["websocket"])


@router.websocket("/ws/metrics")
async def metrics_stream(websocket: WebSocket):
    await websocket.accept()
    db: Session = SessionLocal()
    try:
        while True:
            metric = generate_metric()
            # Persist to DB
            snapshot = MetricSnapshot(**{k: v for k, v in metric.items() if k != "timestamp"})
            db.add(snapshot)
            db.commit()
            await websocket.send_json(metric)
            await asyncio.sleep(1)
    except WebSocketDisconnect:
        pass
    finally:
        db.close()
