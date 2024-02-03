from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_graph():
    with TestClient(app) as c:
        # Cria grafo
        response_create = c.post(
            "/api/v1/graphs/",
            json={
                "coordinates": {
                "A": [1, 2],
                "B": [3, 4],
                "C": [5, 6],
                },
                "routes": {
                    "rota_1": ("A", "B"),
                    "rota_2": ("A", "C")
                }
            }
        )

        response = c.get(
            f"/api/v1/graphs/view_routes/{response_create.json()['id']}"
        )

    assert response.status_code == 200
    assert response.json() == {
        "id": response_create.json()['id']
    }

def test_view_routes():
    with TestClient(app) as c:
        # Cria grafo
        response_create = c.post(
            "/api/v1/graphs/",
            json={
                "coordinates": {
                "A": [1, 2],
                "B": [3, 4],
                "C": [5, 6],
                },
                "routes": {
                    "rota_1": ("A", "B"),
                    "rota_2": ("A", "C")
                }
            }
        )

        response = c.get(
            f"/api/v1/graphs/view_routes/{response_create.json()['id']}"
        )

    assert response.status_code == 200
    assert response.json() == {
        "routes": {
            "rota_1": ("A", "B"),
            "rota_2": ("A", "C")
        },
        "id": response_create.json()['id']
    }

def test_view_shortest_route_not_found():
    with TestClient(app) as c:
        # Cria grafo
        response = c.get(
            f"/api/v1/graphs/view_routes/786368725357387928646"
        )

    assert response.status_code == 404
    assert response.json() == {
        "detail": "Graph not found"
    }

def test_view_shortest_route():
    with TestClient(app) as c:
        # Cria grafo
        response_create = c.post(
            "/api/v1/graphs/",
            json={
                "coordinates": {
                "A": [1, 2],
                "B": [3, 4],
                "C": [5, 6],
                },
                "routes": {
                    "rota_1": ("A", "B"),
                    "rota_2": ("A", "C")
                }
            }
        )

        # Busca por rota com menor distancia
        response = c.get(
            f"/api/v1/graphs/view_shortest_route/{response_create.json()['id']}"
        )

    assert response.status_code == 200

def test_delete_ingredient():
    # Cria grafo
    with TestClient(app) as c:
        response_create = c.post(
            "/api/v1/graphs/",
            json={
                "coordinates": {
                "A": [1, 2],
                "B": [3, 4],
                "C": [5, 6],
                },
                "routes": {
                    "rota_1": ("A", "B"),
                    "rota_2": ("A", "C")
                }
            }
        )

    # Deleta grafo criado
    with TestClient(app) as c:
        response = c.delete(f"/api/v1/graphs/{response_create.json()['id']}")

    assert response.status_code == 204
