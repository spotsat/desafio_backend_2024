import re
from pydantic import BaseModel, constr, Field, validator
from typing import Dict, Union, Optional
from unidecode import unidecode

class Token(BaseModel):
    """ Modelo de usuário """
    username: constr(
        max_length=25,
        strip_whitespace=True,
        to_lower=True,
        min_length=1,
    ) = Field(..., example="")
    email: constr(
        max_length=25
    ) = Field(..., example="")
    password: constr(
        max_length=14,
        min_length=8
    ) = Field(..., example="")

    @validator("name")
    def apply_unidecode(cls, v):
        """ Aplica unidecode no nome do grafo """
        return re.sub(r'[^\w\s]', '', unidecode(v))

class TokenResponse(Token):
    """ Modelo de resposta do usuário """
    token: str