from fastapi import FastAPI

app = FastAPI(
    title="Aryavrat Milk Delivery API",
    description="Backend API for Aryavrat Milk Delivery Application",
    version="1.0.0",
)


@app.get("/")
async def root():
    return {
        "message": "Welcome to Aryavrat API 🚀"
    }


@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "service": "Aryavrat Backend",
        "version": "1.0.0",
    }