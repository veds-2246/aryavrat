from datetime import datetime
from bson import ObjectId
from app.database.mongodb import database
from app.schemas.product import ProductCreate, ProductUpdate

COLLECTION = database["products"]


class ProductService:

    @staticmethod
    async def create_product(product: ProductCreate):
        data = product.model_dump()

        now = datetime.utcnow()

        data["created_at"] = now
        data["updated_at"] = now

        result = await COLLECTION.insert_one(data)

        created = await COLLECTION.find_one({"_id": result.inserted_id})

        created["id"] = str(created["_id"])
        del created["_id"]

        return created

    @staticmethod
    async def get_all_products():
        products = []

        async for product in COLLECTION.find():
            product["id"] = str(product["_id"])
            del product["_id"]
            products.append(product)

        return products

    @staticmethod
    async def get_product(product_id: str):
        product = await COLLECTION.find_one({"_id": ObjectId(product_id)})

        if not product:
            return None

        product["id"] = str(product["_id"])
        del product["_id"]

        return product

    @staticmethod
    async def update_product(product_id: str, product_update: ProductUpdate):
        update_data = {
            k: v
            for k, v in product_update.model_dump().items()
            if v is not None
        }

        update_data["updated_at"] = datetime.utcnow()

        await COLLECTION.update_one(
            {"_id": ObjectId(product_id)},
            {"$set": update_data},
        )

        return await ProductService.get_product(product_id)

    @staticmethod
    async def delete_product(product_id: str):
        result = await COLLECTION.delete_one({"_id": ObjectId(product_id)})

        return result.deleted_count > 0