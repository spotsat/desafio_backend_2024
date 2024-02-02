import re
from pydantic import BaseModel, Field
from typing import Dict, Optional, Tuple

class Graph(BaseModel):
    """ Modelo de grafo """
    coordinates: Optional[
        Dict[str, list]
    ] = Field(
        None,
        example={"A": [1, 2], "B": [3, 4], "C": [5, 6]}
    )
    routes: Optional[
        Dict[str,Tuple[str, str]]
    ] = Field(
        None,
        example={
            "rota_1": ("A", "B"),
            "rota_2": ("A", "C")
        }
    )

class GraphResponse(Graph):
    """ Modelo de resposta do grafo """
    id: int

class ShortestDistanceResponse(Graph):
    """
    Modelo de resposta da menor distancia de rotas
    entre um nó e outro do grafo
    """
    shortest_distance: str