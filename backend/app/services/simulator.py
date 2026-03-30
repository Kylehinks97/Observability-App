import random
from datetime import datetime, timezone


def generate_metric() -> dict:
    return {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "cpu": round(random.uniform(20, 95), 2),
        "memory": round(random.uniform(40, 85), 2),
        "api_latency_ms": round(random.uniform(50, 500), 2),
        "error_rate": round(random.uniform(0, 5), 2),
    }
