def _get_token(client, username="user1", password="pass1"):
    client.post("/auth/register", json={"username": username, "password": password})
    res = client.post("/auth/login", data={"username": username, "password": password})
    return res.json()["access_token"]


def test_metrics_history_empty(client):
    token = _get_token(client)
    res = client.get("/metrics/history", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert res.json() == []


def test_metrics_history_returns_data(client, db):
    from datetime import datetime, timezone
    from app.db.models import MetricSnapshot

    for i in range(3):
        db.add(MetricSnapshot(cpu=50.0 + i, memory=60.0, api_latency_ms=100.0, error_rate=1.0))
    db.commit()

    token = _get_token(client)
    res = client.get("/metrics/history", headers={"Authorization": f"Bearer {token}"})
    assert res.status_code == 200
    assert len(res.json()) == 3
