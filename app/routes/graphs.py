from fastapi import (
    Query, Path, Body, Response, status,
    HTTPException, APIRouter
)
from typing import List
from app.schemas.graphs import Graph, GraphResponse, ShortestDistanceResponse
from app.database.database import database, graphs
import json
import logging
import math

graphs_router = APIRouter(prefix="/graphs")

@graphs_router.post("/")
async def create_graph(graph: Graph = Body(
        ...,
        **Graph.model_config,
        openapi_examples={
            "normal": {
                "summary":
                    "Cria um grafo e o salva na tabela" + \
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
    Cria um grafo.
    Returns:
        Id do grafo criado.
    """
    # Cria comando SQL para inserir grafo na tabela graphs
    # e executa salvando id da query
    query = graphs.insert().values(
        coordinates=json.dumps(graph.coordinates),
        routes=json.dumps(graph.routes)
    )
    last_record_id = await database.execute(query)

    # Retorna detalhes do grafo criado e id correspondente
    logging.info("Grafo criado com sucesso")
    return GraphResponse(
        id=last_record_id,**graph.model_dump()
    )

@graphs_router.get(
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

    logging.info("Consulta conclúida")
    # Captura dados do grafo no banco de dados e retorna
    res = {
        "coordinates": json.loads(graph_exists._row['coordinates']),
        "routes": json.loads(graph_exists._row['routes']),
        }
    return res

@graphs_router.get(
    "/view_routes/{graph_id}",
    summary= \
        "Encontra todas as possíveis rotas " + \
        "de um grafo, buscando pelo id",
    response_description="Detalhes do grafo",
)
async def view_all_routes_by_graph_id(
    graph_id: int = Path(..., title="id da entrada"),
    # stop_limit: int = Query(default=0, ge=1, le=50)
):
    """
    Returns:
        Mostra os todas as possíveis rotas de um grafo,
        levando em conta limie de paradas ou não.
    """

    # Consultar o banco de dados para
    # obter o grafo com base no id
    query = await database.fetch_one(
        graphs.select().where(
        graphs.c.id == graph_id)
    )
    # Se o grafo não for encontrado,levanta uma exceção
    if not query:
        raise HTTPException(
            status_code=404,
            detail="Graph not found",
        )

    # Encontra todas as rotas do grafo e as retorna
    routes_str = query._row['routes']
    clean_str = routes_str.replace(
        '\\"', '"').replace(
        '"{', '{').replace(
        '}"', '}')
    all_routes = json.loads(clean_str)

    logging.info("Consulta conclúida")
    return all_routes

@graphs_router.get(
    "/view_shortest_route/{graph_id}",
    summary= \
        "Encontra a rota de menor " + \
        "distancia de um grafo, buscando pelo id",
    response_description="Rota de menor distancia",
)
async def view_shortest_route_by_graph_id(
    graph_id: int = Path(..., title="id da entrada"),
):
    """
    Returns:
        Rota de menor distancia de um grafo
    """
    # Consultar o banco de dados para
    # obter o grafo com base no id
    graph_exist = await database.fetch_one(
        graphs.select().where(
            graphs.c.id == graph_id
    ))

    # Se o grafo não for encontrado,levanta uma exceção
    if not graph_exist:
        raise HTTPException(
            status_code=404,
            detail="Graph not found",
        )

    # Encontra todas as cordenadas e rotas do grafo
    coordinates_str = graph_exist._row['coordinates']
    clean_str = coordinates_str.replace(
        '\\"', '"').replace(
        '"{', '{').replace(
        '}"', '}')
    coordinates = json.loads(clean_str)

    routes_str = graph_exist._row['routes']
    clean_str = routes_str.replace(
        '\\"', '"').replace(
        '"{', '{').replace(
        '}"', '}')
    all_routes = json.loads(clean_str)

    # atribuir cordenadas as rotas
    assigning_coordinates = list()
    for origin, destiny in all_routes.values():
        assigning_coordinates.append(
            [
                coordinates.get(origin),
                coordinates.get(destiny)
            ]
        )

    # Dentre todas as rotas do grafo,
    #encontra a de menor distancia e a retorna
    distances = calcula_distancias(assigning_coordinates)

    logging.info("Consulta e calculos conclúidos")
    return \
        "De todas as rotas do grafo, a menor possui " + \
        f"{min(distances)} de distancia"


@graphs_router.get(
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
    #     logging("Consulta não pode ser conclúida")
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Consulta não pode ser conclúida",
    #     )

    logging.info("Consulta conclúida")
    return await database.fetch_all(query)

@graphs_router.put("/{graph_id}")
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

@graphs_router.delete("/{graph_id}",
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

def somar_dois_em_dois(lista):
    resultado = []
    for i in range(0, len(lista)-1, 2):
        soma = lista[i] + lista[i+1]
        resultado.append(soma)
    return resultado

def calcula_distancias(routes):
    list_x = list()
    list_y = list()
    distances = list()
    for cordenadas in routes:
        for x, y in cordenadas:
            list_x.append(x)
            list_y.append(y)

    lat = somar_dois_em_dois(list_x)
    long = somar_dois_em_dois(list_y)

    for i in range(len(lat)):
        distances.append(math.sqrt(lat[i]**2+long[i]**2))

    return distances
