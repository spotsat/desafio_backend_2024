from app.api.routes import (
    graphs,
    authentication,
    metrics,
    users
    )
from fastapi import APIRouter


router = APIRouter(prefix="/api/v1")

router.include_router(graphs.router, tags=["Graphs"])
router.include_router(metrics.router, tags=["Compute"])
router.include_router(authentication.router, tags=["Auth"])
router.include_router(users.router, tags=["User"])
