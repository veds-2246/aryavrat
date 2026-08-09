from datetime import datetime
from bson import ObjectId

from app.database.mongodb import database
from app.schemas.address import AddressCreate, AddressUpdate

COLLECTION = database["addresses"]


class AddressService:

    @staticmethod
    async def create_address(address: AddressCreate):
        try:
            data = address.model_dump()
        except AttributeError:
            data = address.dict()

        now = datetime.utcnow()

        # Ensure only one default address per user
        if data.get("is_default"):
            await COLLECTION.update_many(
                {"user_id": data["user_id"]},
                {"$set": {"is_default": False}},
            )

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
    async def get_addresses_by_user(user_id: str):
        addresses = []

        async for address in COLLECTION.find(
            {"user_id": user_id}
        ).sort("created_at", -1):
            address["id"] = str(address["_id"])
            del address["_id"]
            addresses.append(address)

        return addresses

    @staticmethod
    async def get_address(address_id: str):
        address = await COLLECTION.find_one(
            {"_id": ObjectId(address_id)}
        )

        if not address:
            return None

        address["id"] = str(address["_id"])
        del address["_id"]

        return address

    @staticmethod
    async def update_address(
        address_id: str,
        address_update: AddressUpdate,
    ):
        try:
            raw = address_update.model_dump()
        except AttributeError:
            raw = address_update.dict()

        update_data = {
            k: v
            for k, v in raw.items()
            if v is not None
        }

        existing = await COLLECTION.find_one(
            {"_id": ObjectId(address_id)}
        )

        if not existing:
            return None

        # If setting this address as default,
        # remove default from all other addresses
        if update_data.get("is_default"):
            await COLLECTION.update_many(
                {"user_id": existing["user_id"]},
                {"$set": {"is_default": False}},
            )

        update_data["updated_at"] = datetime.utcnow()

        await COLLECTION.update_one(
            {"_id": ObjectId(address_id)},
            {"$set": update_data},
        )

        return await AddressService.get_address(address_id)

    @staticmethod
    async def delete_address(address_id: str):
        result = await COLLECTION.delete_one(
            {"_id": ObjectId(address_id)}
        )

        return result.deleted_count > 0