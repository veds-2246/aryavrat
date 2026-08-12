from motor.motor_asyncio import AsyncIOMotorClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")

client = AsyncIOMotorClient(
    MONGODB_URI,
    server_api=ServerApi("1"),
    tls=True,
    tlsAllowInvalidCertificates=False,
    maxPoolSize=20,
    minPoolSize=5,
    serverSelectionTimeoutMS=5000,
    connectTimeoutMS=10000,
    socketTimeoutMS=20000,
    retryWrites=True,
)

database = client["aryavrat"]

async def ping_database():
    try:
        await client.admin.command("ping")
        print("MongoDB connected successfully")
    except Exception as e:
        print("MongoDB connection failed:", e)