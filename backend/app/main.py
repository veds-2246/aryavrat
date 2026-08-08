from fastapi import FastAPI
from app.database.mongodb import database
from app.api.products import router as product_router

app = FastAPI(
    title="Aryavrat Milk Delivery API",
    version="1.0.0",
)

app.include_router(product_router)


@app.get("/")
async def root():
    return {
        "message": "Welcome to Aryavrat API 🚀"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy"
    }


@app.get("/health/db")
async def database_health():
    await database.command("ping")

    return {
        "database": "connected"
    }