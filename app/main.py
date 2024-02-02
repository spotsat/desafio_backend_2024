from fastapi import FastAPI
# from app.schemas.core import Tags
from app.database.database import database
from app.routes.graphs import graphs_router
from app.routes.users import users_router

app = FastAPI(
    summary="API de exemplo",
    title="API de exemplo2",
    description="Descrição da API de exemplo",
)

app.include_router(graphs_router, prefix="/api/v1", tags=["graphs"])

@app.get("/")
async def read_main():
    return {"msg": "Hello World"}

@app.on_event("startup")
async def startup_event():
   await database.connect()

@app.on_event("shutdown")
async def shutdown_event():
    await database.disconnect()