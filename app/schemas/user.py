import re
from pydantic import BaseModel, constr, Field, validator
from typing import Dict, Union, Optional
from unidecode import unidecode

class User(BaseModel):
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
    # user_type
    # is_active


class UserResponse(User):
    """ Modelo de resposta do usuário """
    id: int
    username: str