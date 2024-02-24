from fastapi import (
    Query, Path, Body, Response, status,
    HTTPException, APIRouter
)
from typing import List
from app.schemas.graphs import Graph, GraphResponse
from app.database.database import database, graphs
import json
import logging
import math

router = APIRouter(prefix="/graphs")

@router.post("/")
async def create_graph(
    graph: Graph = Body(
        ...,
        **Graph.model_config,
        openapi_examples={

        }
)) -> GraphResponse:
    """Rota principal para criar um novo grafo"""

    # Cria comando SQL para inserir grafo na tabela graphs
    # e executa salvando id da query
    last_record_id = await database.execute(
        graphs.insert().values(
            graph.model_dump()
    ))

    # Retorna detalhes do grafo criado e id correspondente
    logging.info("Grafo criado com sucesso")

    return GraphResponse(
        id=last_record_id,**graph.model_dump()
    )



































@router.get(
    "/view_graph/{graph_id}",
    summary="Mostra um único grafo pelo id",
    response_description="Detalhes do grafo",
)
async def view_graph_by_id(
    graph_id: int = Path(..., title="id da entrada"),
):
    """
    Mostra detalhamento de um grafo pelo id.
    """
    # Verifica existencia do grafo pelo id passado
    graph_exists = await database.fetch_one(
        graphs.select().where(graphs.c.id == graph_id)
    )

    # Retorna exceção 404 caso o id não tenha sido encontrado
    if not graph_exists:
        logging.error("Grafo não encontrado")
        raise HTTPException(
            status_code=404,
            detail="Grafo não encontrado",
        )

    logging.info("Consulta concluída")
    # Captura dados do grafo no banco de dados e retorna



@router.get(
    "/",
    summary="Mostra grafos registrados",
    response_description="Lista de grafos registrados",
    response_model=List[GraphResponse],
)
async def view_graphs(
    query: list = Query(
        default_factory=list
    ),
    limit: int = Query(default=10, ge=1, le=50),
    recent: bool = False
):
    """
    Mostra grafos registrados.
    """
    # Cria comando para buscar grafos no banco de dados
    # pelos filtros de limite e ordem de criação
    if not recent:
        query = graphs.select().limit(limit)
    if recent:
        query = graphs.select().order_by(
            graphs.c.created_at.desc()).limit(limit)

    # if not query:
    #     logging("Consulta não pode ser concluída")
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Consulta não pode ser concluída",
    #     )

    logging.info("Consulta concluída")
    return await database.fetch_all(query)

@router.put("/{graph_id}")
async def update_graph(
        graph_id: int = Path(..., title="Id do grafo"),
        graph: Graph = Body(
        ...,
        **Graph.model_config,
        openapi_examples={
            "normal": {
                "summary":
                    "Altera um grafo e o salva na tabela" + \
                    "graphs do banco de dados",
                "description": "Um exemplo normal",
                "value": {
                    "coordinates": {
                        "A": [1, 2],
                        "B": [3, 4],
                        "C": [5, 6]
                    },
                    "routes": {
                        "rota_1": ("A", "B"),
                        "rota_2": ("A", "C")
                    }
                }
            }}
)) -> GraphResponse:
    """
    Altera um grafo.
    Returns:
        Id e detalhes do grafo alterado.
    """
    # Verifica existencia do grafo pelo id passado
    query = graphs.select().where(graphs.c.id == graph_id)
    graph_exists = await database.fetch_one(query)
    # Levanta exceção 404 caso não exista
    if not graph_exists:
        logging.error("Grafo não existe")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grafo não existe",
        )

    # Realiza alterações e retorna
    await database.execute(
        graphs.update().where(
            graphs.c.id == graph_id
        ).values(**graph.model_dump(exclude_unset=True))
    )

    logging.info("Alterações concluídas")
    return GraphResponse(
        id=graph_id, **graph.model_dump()
    )

@router.delete("/{graph_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_graph(
        graph_id: int = Path(..., title="Id do grafo"),
):
    """
    Deleta um grafo.
    Returns:
        Status code 204, confirmando a exclusão.
    """
    query = graphs.select().where(graphs.c.id == graph_id)
    graph_exists = await database.fetch_one(query)
    # Levanta exceção 404 caso não exista
    if not graph_exists:
        logging.error("Grafo não existe")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Grafo não existe",
        )

    # Realiza exclusão e retorna
    await database.execute(
        graphs.delete().where(
            graphs.c.id == graph_id)
    )

    logging.info("Grafo deletado")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
