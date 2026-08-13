from datetime import datetime, timedelta
from bson import ObjectId
from app.database.mongodb import database
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionUpdate,
)

COLLECTION = database["subscriptions"]


class SubscriptionService:

    @staticmethod
    async def create_subscription(subscription: SubscriptionCreate):
        try:
            data = subscription.model_dump()
        except AttributeError:
            data = subscription.dict()

        now = datetime.utcnow()

        # First delivery is tomorrow morning by default
        next_delivery = (now + timedelta(days=1)).date().isoformat()

        data["status"] = "active"
        data["next_delivery_date"] = next_delivery
        data["created_at"] = now
        data["updated_at"] = now

        result = await COLLECTION.insert_one(data)

        created = await COLLECTION.find_one(
            {"_id": result.inserted_id}
        )

        created["id"] = str(created["_id"])
        del created["_id"]

        return created

    @staticmethod
    async def get_all_subscriptions(user_id: str):
        subscriptions = []

        async for subscription in COLLECTION.find(
            {"user_id": user_id}
        ).sort("created_at", -1):
            subscription["id"] = str(subscription["_id"])
            del subscription["_id"]
            subscriptions.append(subscription)

        return subscriptions

    @staticmethod
    async def get_subscription(subscription_id: str):
        subscription = await COLLECTION.find_one(
            {"_id": ObjectId(subscription_id)}
        )

        if not subscription:
            return None

        subscription["id"] = str(subscription["_id"])
        del subscription["_id"]

        return subscription

    @staticmethod
    async def update_subscription(
        subscription_id: str,
        subscription_update: SubscriptionUpdate,
    ):
        try:
            raw = subscription_update.model_dump()
        except AttributeError:
            raw = subscription_update.dict()

        update_data = {
            k: v
            for k, v in raw.items()
            if v is not None
        }

        update_data["updated_at"] = datetime.utcnow()

        await COLLECTION.update_one(
            {"_id": ObjectId(subscription_id)},
            {"$set": update_data},
        )

        return await SubscriptionService.get_subscription(
            subscription_id
        )

    @staticmethod
    async def delete_subscription(subscription_id: str):
        result = await COLLECTION.delete_one(
            {"_id": ObjectId(subscription_id)}
        )

        return result.deleted_count > 0