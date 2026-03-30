from datetime import datetime, timezone
from sqlalchemy import Float, String, DateTime, Integer, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column
from app.db.session import Base
import enum


class UserRole(str, enum.Enum):
    admin = "admin"
    viewer = "viewer"


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String, unique=True, index=True)
    hashed_password: Mapped[str] = mapped_column(String)
    role: Mapped[UserRole] = mapped_column(SAEnum(UserRole), default=UserRole.viewer)


class MetricSnapshot(Base):
    __tablename__ = "metric_snapshots"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    timestamp: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        index=True,
    )
    cpu: Mapped[float] = mapped_column(Float)
    memory: Mapped[float] = mapped_column(Float)
    api_latency_ms: Mapped[float] = mapped_column(Float)
    error_rate: Mapped[float] = mapped_column(Float)
