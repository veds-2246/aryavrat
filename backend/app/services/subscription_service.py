from datetime import datetime, timedelta, date
from bson import ObjectId
from app.database.mongodb import database
from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionUpdate,
)

COLLECTION = database["subscriptions"]

DAY_INDEX = {
    "Mon": 0,
    "Tue": 1,
    "Wed": 2,
    "Thu": 3,
    "Fri": 4,
    "Sat": 5,
    "Sun": 6,
}


def calculate_next_delivery_date(
    schedule: str,
    selected_days=None,
    from_date: date | None = None,
):
    if from_date is None:
        from_date = datetime.utcnow().date()

    # Daily subscription
    if schedule == "daily":
        return (from_date + timedelta(days=1)).isoformat()

    # Custom schedule
    if not selected_days:
        return (from_date + timedelta(days=1)).isoformat()

    today_index = from_date.weekday()

    future_days = sorted(
        DAY_INDEX[day]
        for day in selected_days
        if day in DAY_INDEX
    )

    for day_index in future_days:
        if day_index > today_index:
            days_ahead = day_index - today_index
            return (
                from_date + timedelta(days=days_ahead)
            ).isoformat()

    # Wrap to next week
    first_day = future_days[0]
    days_ahead = 7 - today_index + first_day

    return (
        from_date + timedelta(days=days_ahead)
    ).isoformat()


def calculate_delivery_after(
    schedule: str,
    selected_days=None,
    current_delivery_date: str | None = None,
):
    """
    Returns the delivery date after the current scheduled delivery.
    Used when user skips the next delivery.
    """
    if current_delivery_date:
        from_date = datetime.strptime(
            current_delivery_date,
            "%Y-%m-%d",
        ).date()
    else:
        from_date = datetime.utcnow().date()

    return calculate_next_delivery_date(
        schedule,
        selected_days,
        from_date,
    )

class SubscriptionService:

    @staticmethod
    async def create_subscription(subscription: SubscriptionCreate):
        try:
            data = subscription.model_dump()
        except AttributeError:
            data = subscription.dict()

        now = datetime.utcnow()
        
        if data.get("schedule") == "daily":
            data.pop("selected_days", None)

        # First delivery is tomorrow morning by default
        next_delivery = calculate_next_delivery_date(
            data.get("schedule", "daily"),
            data.get("selected_days"),
            now.date(),
    )
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

        new_schedule = update_data.get("schedule")
        new_selected_days = update_data.get("selected_days")

        unset_data = {}

        if new_schedule is not None or new_selected_days is not None:
            current = await COLLECTION.find_one(
                {"_id": ObjectId(subscription_id)}
            )

            if current:
                final_schedule = (
                    new_schedule
                    or current.get("schedule", "daily")
               )

                if final_schedule == "daily":
                    # Daily subscriptions do not use selected days.
                    update_data.pop("selected_days", None)
                    unset_data["selected_days"] = ""

                    update_data["next_delivery_date"] = (
                        datetime.utcnow().date()
                        + timedelta(days=1)
                    ).isoformat()

                else:
                    selected_days = (
                        new_selected_days
                        if new_selected_days is not None
                        else current.get("selected_days")
                    )

                    update_data["next_delivery_date"] = (
                        calculate_next_delivery_date(
                            final_schedule,
                            selected_days,
                            datetime.utcnow().date(),
                        )
                    )

        update_operation = {
            "$set": update_data,
        }

        if unset_data:
            update_operation["$unset"] = unset_data

        await COLLECTION.update_one(
            {"_id": ObjectId(subscription_id)},
            update_operation,
        )

        return await SubscriptionService.get_subscription(
            subscription_id
        )

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

        # Recalculate next delivery date if schedule changes
        # Recalculate next delivery date if schedule changes
        new_schedule = update_data.get("schedule")
        new_selected_days = update_data.get("selected_days")

        if new_schedule is not None or new_selected_days is not None:
            current = await COLLECTION.find_one(
                {"_id": ObjectId(subscription_id)}
            )

            if current:
                schedule = new_schedule or current.get("schedule", "daily")

                if schedule == "daily":
                # Daily subscriptions do not use selected days.
                    update_data.pop("selected_days", None)
                    update_data["next_delivery_date"] = (
                        datetime.utcnow().date() + timedelta(days=1)
                    ).isoformat()
                else:
                    selected_days = (
                        new_selected_days
                        if new_selected_days is not None
                        else current.get("selected_days")
                    )

                    update_data["next_delivery_date"] = calculate_next_delivery_date(
                        schedule,
                        selected_days,
                        datetime.utcnow().date(),
                    )

        unset_data = {}

        if update_data.get("schedule") == "daily":
            unset_data["selected_days"] = ""

        update_operation = {
            "$set": update_data,
        }

        if unset_data:
            update_operation["$unset"] = unset_data

        await COLLECTION.update_one(
            {"_id": ObjectId(subscription_id)},
            update_operation,
        )

        return await SubscriptionService.get_subscription(
            subscription_id
        )

    @staticmethod
    async def skip_next_delivery(subscription_id: str):
        subscription = await COLLECTION.find_one(
        {"_id": ObjectId(subscription_id)}
    )

        if not subscription:
            return None
        new_delivery = calculate_delivery_after(
        subscription.get("schedule", "daily"),
        subscription.get("selected_days"),
        subscription.get("next_delivery_date"),
    )

        await COLLECTION.update_one(
        {"_id": ObjectId(subscription_id)},
        {
            "$set": {
                "next_delivery_date": new_delivery,
                "updated_at": datetime.utcnow(),
            }
        },
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