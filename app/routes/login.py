from fastapi import (
    Query, Path, Body, Header, Response,
    status, Depends, HTTPException, APIRouter
)
from fastapi.security import (
    OAuth2PasswordBearer, OAuth2PasswordRequestForm
)
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import Union, List, Annotated
from app.database.database import database, users, user_types
from app.schemas.user import User, UserResponse
from app.schemas.token import Token,TokenResponse
import logging

SECRET_KEY = "mysecretkey"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

token_router = APIRouter(prefix="/token")

@token_router.post("/token")
async def login_by_access_token(
    user: Token = Body(
        ...,
        **Token.model_config,
        openapi_examples={
            "normal": {
                "summary":
                    "",
                "description": "Um exemplo normal",
                "value": {
                    "username": "mariannabaldez",
                    "email": "marianna.baldez@gmail.com",
                    "password": "senha123",
                }
            }}
    ),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> TokenResponse:
    """
    Faz login de um usuário utilizando token de acesso
    """
    # Checando existencia do usúario
    username_exists = await database.fetch_one(
        users.select().where(
        users.c.username == user.username)
    )

    hashed_password = f"{user.password}_hash"
    password_exists = await database.fetch_one(
        users.select().where(
        users.c.hashed_password == hashed_password)
    )

    if not username_exists and password_exists:
        raise HTTPException(
            status_code=401,
            detail="Nome de usuário ou senha incorretos"
        )

    # Caso o usuário exista cadastrado, cria token de acesso
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": form_data.username},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

# Função para gerar o token JWT
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Função para obter o token
def get_current_user(token: str = Depends(OAuth2PasswordBearer(tokenUrl="token"))):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username: str = payload.get("sub")
        if username is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    return username
