from fastapi import APIRouter, Depends, HTTPException, status
from typing import Annotated
from app.schemas.token import Token
from datetime import timedelta
from app.database.database import database, users
from fastapi.security import OAuth2PasswordRequestForm
from app.services.auth import authenticate_user
from app.services.jwt import ACCESS_TOKEN_EXPIRE_MINUTES, create_access_token

router = APIRouter()

@router.post("/token")
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()]
) -> Token:

    user_from_db = await database.fetch_one(
            users.select().where(
                users.c.username == form_data.username))
    user = authenticate_user(
        dict(user_from_db),
        form_data.password
    )
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"username": form_data.username}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")
