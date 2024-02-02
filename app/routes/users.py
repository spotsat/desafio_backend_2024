from fastapi import (
    Query, Path, Body, Response,
    status, HTTPException, APIRouter
)
from typing import List
from app.database.database import database, users, user_types
from app.schemas.user import User, UserResponse
import logging

users_router = APIRouter(prefix="/users")

@users_router.post("/")
async def create_user(user: User = Body(
        ...,
        **User.model_config,
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
                    #"user_type": "",
                    #"is_active": ""
                }
            }}
)) -> UserResponse:
    """
    Cria um usuário.
    Returns:
        Id do usuário criado.
    """
    # Checando se username já existe
    query_username = users.select().where(
        users.c.username == user.username
    )
    username_exists = await database.fetch_one(query_username)
    # Retorna exceção 400 caso username já exista
    if username_exists:
        logging.error("Username passado já foi registrado")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username já registrado",
        )

    # Checando se email já existe
    query_email = users.select().where(
        users.c.email == user.email
    )
    email_exists = await database.fetch_one(query_email)
    # Retorna exceção 400 caso email já exista
    if email_exists:
        logging.error("Email passado já foi registrado")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email já registrado",
        )

    # Cria comando SQL para inserir um usuário
    # na tabela users e executa salvando id da query
    query = users.insert().values(
        **user.model_dump(exclude_unset=True))
    last_record_id = await database.execute(query)
    logging.info("Usuário criado com sucesso")

    # Retorna detalhes do usuário criado e id correspondente
    return UserResponse(
        id=last_record_id,**user.model_dump()
    )

@users_router.get(
    "/{user_id}",
    summary="Mostra um único usuário pelo id",
    response_description="Detalhes de um usuário",
    response_model=UserResponse,
)
async def view_user_by_id(
    user_id: int = Path(..., title="Id da entrada"),
) -> UserResponse:
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

    logging.info("Consulta conclúida")
    return user_exists

@users_router.get(
    "/",
    summary="Mostra usuários registrados",
    response_description="Lista de usuários registrados",
    response_model=List[UserResponse],
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
    #     logging("Consulta não pode ser conclúida")
    #     raise HTTPException(
    #         status_code=status.HTTP_400_BAD_REQUEST,
    #         detail="Consulta não pode ser conclúida",
    #     )

    logging.info("Consulta conclúida")
    return await database.fetch_all(query)

@users_router.put("/{user_id}")
async def update_user(
        user_id: int = Path(..., title="Id do usuário"),
        user: User = Body(
            ...,
            **User.model_config,
)) -> UserResponse:
    """
    Altera um usuário.
    Returns:
        Id e detalhes do usuário alterado.
    """
    # Verifica existencia do usúrio pelo id passado
    query = users.select().where(users.c.id == user_id)
    user_exists = await database.fetch_one(query)
    # Levanta exceção 404 caso não exista
    if not user_exists:
        logging.error("Usúario não existe")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não existe",
        )

    # Realiza alterações e retorna
    await database.execute(
        users.update().where(
            users.c.id == user_id
        ).values(**user.model_dump(exclude_unset=True))
    )

    logging.info("Alterações concluídas")
    return UserResponse(
        id=user_id, **user.model_dump()
    )

@users_router.delete("/{user_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_user(
        user_id: int = Path(..., title="Id do usuário"),
):
    """
    Deleta um usuário.
    Returns:
        Status code 204, confirmando a exclusão.
    """
    query = users.select().where(users.c.id == user_id)
    user_exists = await database.fetch_one(query)
    # Levanta exceção 404 caso não exista
    if not user_exists:
        logging.error("Usúario não existe")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Usuário não existe",
        )

    # Realiza exclusão e retorna
    await database.execute(
        users.delete().where(
            users.c.id == user_id)
    )

    logging.info("Usuário deletado")
    return Response(status_code=status.HTTP_204_NO_CONTENT)
