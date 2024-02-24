from app.routes import (
    graphs,
    # users,
    # login,
    metrics
    )
from fastapi import APIRouter


router = APIRouter(prefix="/api/v1")

router.include_router(graphs.router, tags=["Graphs"])
router.include_router(metrics.router, tags=["Compute"])
