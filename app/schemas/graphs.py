from pydantic import BaseModel, constr, conlist
from typing import List


class Coordinate(BaseModel):
    latitude: float = 0.0
    longitude: float = 0.0


class Node(BaseModel):
    name: constr(strip_whitespace=True, to_lower=True, min_length=1) = "A" # type: ignore
    coordinate: Coordinate


class Graph(BaseModel):
    """ Modelo de grafo """
    nodes: List[Node] = [
        {"name": "A", "coordinate": {"latitude": 0.0, "longitude": 0.0}},
        {"name": "B", "coordinate": {"latitude": 1.0, "longitude": 1.0}},
        ]
    edges: List[conlist(
        item_type=constr(strip_whitespace=True, to_lower=True, min_length=1),
        max_length=2,
        min_length=2,
        )] = [["A", "B"]] # type: ignore


class GraphResponse(Graph):
    """ Modelo de resposta do grafo """
    id: int
