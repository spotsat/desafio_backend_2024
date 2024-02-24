from fastapi import (
    Query,
    Path,
    Body,
    Response,
    status,
    HTTPException,
    APIRouter,
)
from typing import List
from app.schemas.graphs import Graph, GraphResponse
from app.database.database import database, graphs
import json
import logging
import math
from app.services.graphs import NetGraph
from app.schemas.graphs import Graph

router = APIRouter()

@router.get("/{graph_id}/paths")
async def trace_possible_paths(
    graph_id: int,
    start: str,
    end: str,
    limit: int = Query(default=0, ge=0)
) -> List:
    """ TODO: EXPLICAR """

    # Buscando grafo
    logging.info("Buscando grafo de id %s...", graph_id)
    graph_db = await database.fetch_one(
        graphs.select().where(graphs.c.id == graph_id)
    )

    if not graph_db:
        logging.error("Grafo com id %s não encontrado", graph_id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Grafo com id {graph_id} não encontrado",
        )

    logging.info("Grafo encontrado, processando...")
    network = NetGraph(Graph(**dict(graph_db)))

    if not all(node in network.graph.nodes for node in [start.lower(), end.lower()]):
        logging.error("Caminho não existe")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rota inválida"
        )

    return network.find_all_paths(
        start.lower(), end.lower(), max_nodes=limit)

@router.get("/{graph_id}/shortest")
async def trace_shortest_path(
    graph_id: int,
    start: str,
    end: str,
) -> List:
    """ TODO: EXPLICAR """

    # Buscando grafo
    logging.info("Buscando grafo de id %s...", graph_id)
    graph_db = await database.fetch_one(
        graphs.select().where(graphs.c.id == graph_id)
    )

    if not graph_db:
        logging.error("Grafo com id %s não encontrado", graph_id)
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Grafo com id {graph_id} não encontrado",
        )

    logging.info("Grafo encontrado, processando...")
    network = NetGraph(Graph(**dict(graph_db)))

    if not all(node in network.graph.nodes for node in [start.lower(), end.lower()]):
        logging.error("Caminho não existe")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Rota inválida"
        )

    return network.shortest_path(
        start.lower(), end.lower())
