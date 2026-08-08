from datetime import datetime
from bson import ObjectId
from app.database.mongodb import database
from app.schemas.order import OrderCreate, OrderUpdate

COLLECTION = database["orders"]


class OrderService:

    @staticmethod
    async def create_order(order: OrderCreate):
        try:
            data = order.model_dump()
        except AttributeError:
            data = order.dict()

        now = datetime.utcnow()

        data["status"] = "pending"
        data["created_at"] = now
        data["updated_at"] = now

        result = await COLLECTION.insert_one(data)

        created = await COLLECTION.find_one({"_id": result.inserted_id})

        created["id"] = str(created["_id"])
        del created["_id"]

        return created

    @staticmethod
    async def get_all_orders():
        orders = []

        async for order in COLLECTION.find().sort("created_at", -1):
            order["id"] = str(order["_id"])
            del order["_id"]
            orders.append(order)

        return orders

    @staticmethod
    async def get_order(order_id: str):
        order = await COLLECTION.find_one({"_id": ObjectId(order_id)})

        if not order:
            return None

        order["id"] = str(order["_id"])
        del order["_id"]

        return order

    @staticmethod
    async def update_order(order_id: str, order_update: OrderUpdate):
        try:
            raw = order_update.model_dump()
        except AttributeError:
            raw = order_update.dict()

        update_data = {k: v for k, v in raw.items() if v is not None}

        update_data["updated_at"] = datetime.utcnow()

        await COLLECTION.update_one(
            {"_id": ObjectId(order_id)},
            {"$set": update_data},
        )

        return await OrderService.get_order(order_id)

    @staticmethod
    async def delete_order(order_id: str):
        result = await COLLECTION.delete_one({"_id": ObjectId(order_id)})
        return result.deleted_count > 0