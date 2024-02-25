from fastapi import FastAPI
from app.database.database import database
from app.api.routes import api

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