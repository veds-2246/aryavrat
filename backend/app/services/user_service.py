from datetime import datetime
from bson import ObjectId

from app.database.mongodb import database
from app.schemas.user import UserCreate


class UserService:
    def __init__(self):
        self.collection = database["users"]

    async def create_or_get_user(self, user: UserCreate):
        existing = await self.collection.find_one({"phone": user.phone})

        if existing:
            return self._format(existing)

        now = datetime.utcnow()

        document = {
            "phone": user.phone,
            "name": user.name,
            "created_at": now,
            "updated_at": now,
        }

        result = await self.collection.insert_one(document)
        created = await self.collection.find_one({"_id": result.inserted_id})

        return self._format(created)

    async def get_by_phone(self, phone: str):
        user = await self.collection.find_one({"phone": phone})

        if not user:
            return None

        return self._format(user)

    async def get_by_id(self, user_id: str):
        user = await self.collection.find_one({"_id": ObjectId(user_id)})

        if not user:
            return None

        return self._format(user)

    def _format(self, document):
        return {
            "id": str(document["_id"]),
            "phone": document["phone"],
            "name": document.get("name"),
            "created_at": document["created_at"],
            "updated_at": document["updated_at"],
        }


user_service = UserService()