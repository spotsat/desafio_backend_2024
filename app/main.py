from fastapi import FastAPI, Depends
from typing import Annotated
# from app.schemas.core import Tags
from app.database.database import database, users
from app.routes import api
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

app = FastAPI(
    # summary="Geografos",
    title="Geografos",
    # description="Calcula grafos"
)

app.include_router(api.router)



@app.on_event("startup")
async def startup_event():
   await database.connect()

@app.on_event("shutdown")
async def shutdown_event():
    await database.disconnect()