from pydantic import BaseModel

class User(BaseModel):
    username: str
    email: str | None = None
    disabled: bool | None = None

class UserInDB(User):
    hashed_password: str

class NewUser(User):
    password: str

class NewUserResponse(User):
    id: str