def test_register_and_login(client):
    # Register
    res = client.post("/auth/register", json={"username": "alice", "password": "secret"})
    assert res.status_code == 201

    # Duplicate registration fails
    res = client.post("/auth/register", json={"username": "alice", "password": "secret"})
    assert res.status_code == 400

    # Login
    res = client.post("/auth/login", data={"username": "alice", "password": "secret"})
    assert res.status_code == 200
    assert "access_token" in res.json()


def test_login_bad_password(client):
    client.post("/auth/register", json={"username": "bob", "password": "correct"})
    res = client.post("/auth/login", data={"username": "bob", "password": "wrong"})
    assert res.status_code == 401


def test_protected_route_requires_token(client):
    res = client.get("/metrics/history")
    assert res.status_code == 401
