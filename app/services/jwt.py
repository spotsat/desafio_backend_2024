import os
from jose import jwt
from datetime import datetime, timedelta, timezone
from app.schemas.token import TokenData
from pydantic import ValidationError

SECRET_KEY = os.environ.get(
    "JWT_SECRET_KEY",
    "fd969dc73b542e5222ae2f5088658e54aefc2a61b207b85bd34c95386dae9cf4"
)

ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_username_from_token(token: str, secret_key: str) -> str:
    try:
        return TokenData(**jwt.decode(token, secret_key, algorithms=[ALGORITHM])).username
    except ValidationError as validation_error:
        raise ValueError("malformed payload in token") from validation_error
