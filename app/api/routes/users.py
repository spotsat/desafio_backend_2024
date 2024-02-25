from fastapi import (
    Body,
    status,
    HTTPException,
    APIRouter,
    Path,
    Query
)
from typing import List
from app.database.database import database, users
from app.schemas.user import NewUser, NewUserResponse
import logging


router = APIRouter(prefix="/users")

@router.post("/")
async def create_user(user: NewUser = Body(
        ...,
        **NewUser.model_config,
        openapi_examples={
            "normal": {
                "summary":
                    "Cria um usuário e o salva na tabela" + \
                    "users do banco de dados",
                "description": "Um exemplo normal",
                "value": {
                    "username": "mariannabaldez",
                    "email": "marianna.baldez@gmail.com",
                    "password": "senha123",
                }
            }}
)) -> NewUserResponse:
    """
    Cria um usuário.
    Returns:
        Id do usuário criado.
    """
    # Checando se username já existe
    query_username = users.select().where(
        users.c.username == user.username
    )

    # Retorna exceção 400 caso username já exista
    if await database.fetch_one(query_username):
        logging.error("NewUsername passado já foi registrado")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="NewUsername já registrado",
        )

    # Checando se email já existe
    query_email = users.select().where(
        users.c.email == user.email
    )

    # Retorna exceção 400 caso email já exista
    if await database.fetch_one(query_email):
        logging.error("Email passado já foi registrado")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já registrado",
        )

    from app.services.security import get_password_hash
    # Cria comando SQL para inserir um usuário
    # na tabela users e executa salvando id da query
    query = users.insert().values(
        username=user.username,
        hashed_password=get_password_hash(user.password),
        email=user.email,
        disable=False
    )
    last_record_id = await database.execute(query)
    logging.info("Usuário criado com sucesso")

    # Retorna detalhes do usuário criado e id correspondente
    return NewUserResponse(
        id=last_record_id,**user.model_dump()
    )

@router.get(
    "/{user_id}",
    summary="Mostra um único usuário pelo id",
    response_description="Detalhes de um usuário",
    response_model=NewUserResponse,
)
async def view_user_by_id(
    user_id: int = Path(..., title="Id da entrada"),
) -> NewUserResponse:
    """
    Mostra detalhamento de um único usuário pelo id.
    """
    # Busca id do usuário passado no banco de dados
    query_id = users.select().where(users.c.id == user_id)

    # Verifica existencia do usúario pelo id passado
    user_exists = await database.fetch_one(query_id)

    # Retorna exceção 404 caso o id não tenha sido encontrado
    if not user_exists:
        logging.error("Usuário não encontrado")
        raise HTTPException(
            status_code=404,
            detail="Usuário não encontrado",
        )

    logging.info("Consulta concluída")
    return user_exists

@router.get(
    "/",
    summary="Mostra usuários registrados",
    response_description="Lista de usuários registrados",
    response_model=List[NewUserResponse],
)
async def view_users(
    query: list = Query(
        default_factory=list
    ),
    limit: int = Query(default=10, ge=1, le=50),
    recent: bool = False
):
    """
    Mostra usuários registrados.
    """
    # Cria comando para buscar usuários no banco de dados
    # pelos filtros de limite e ordem de criação
    if not recent:
        query = users.select().limit(limit)
    if recent:
        query = users.select().order_by(
            users.c.created_at.desc()).limit(limit)

    # if not query:
    #     logging("Consulta não pode ser concluída")
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Consulta não pode ser concluída",
    #     )

    logging.info("Consulta concluída")
    return await database.fetch_all(query)
