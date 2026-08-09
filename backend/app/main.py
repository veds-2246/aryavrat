from fastapi import FastAPI
from app.database.mongodb import database
from app.api.products import router as product_router
from app.api.orders import router as order_router
from app.api.users import router as user_router
from app.api.addresses import router as address_router

app = FastAPI(
    title="Aryavrat Milk Delivery API",
    version="1.0.0",
)

app.include_router(product_router)
app.include_router(order_router)
app.include_router(user_router)
app.include_router(address_router)

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