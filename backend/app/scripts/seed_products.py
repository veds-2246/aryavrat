import asyncio
from datetime import datetime
from app.database.mongodb import database

products = [
    {
        "name": "Fresh Cow Milk",
        "description": "Pure farm fresh cow milk",
        "category": "Milk",
        "price": 60,
        "unit": "1 L",
        "stock": 100,
        "image": "",
        "is_available": True,
    },
    {
        "name": "Fresh Buffalo Milk",
        "description": "Rich and creamy buffalo milk",
        "category": "Milk",
        "price": 70,
        "unit": "1 L",
        "stock": 80,
        "image": "",
        "is_available": True,
    },
    {
        "name": "Toned Milk",
        "description": "Healthy toned milk",
        "category": "Milk",
        "price": 55,
        "unit": "1 L",
        "stock": 120,
        "image": "",
        "is_available": True,
    },
    {
        "name": "Fresh Curd",
        "description": "Homemade style fresh curd",
        "category": "Dairy",
        "price": 50,
        "unit": "500 g",
        "stock": 60,
        "image": "",
        "is_available": True,
    },
    {
        "name": "Paneer",
        "description": "Soft fresh paneer",
        "category": "Dairy",
        "price": 180,
        "unit": "500 g",
        "stock": 40,
        "image": "",
        "is_available": True,
    },
    {
        "name": "Desi Ghee",
        "description": "Traditional pure desi ghee",
        "category": "Dairy",
        "price": 650,
        "unit": "1 kg",
        "stock": 25,
        "image": "",
        "is_available": True,
    },
]


async def seed():
    collection = database["products"]

    # Clear existing products
    await collection.delete_many({})

    now = datetime.utcnow()

    for product in products:
        product["created_at"] = now
        product["updated_at"] = now

    await collection.insert_many(products)

    print("Aryavrat products seeded successfully!")


if __name__ == "__main__":
    asyncio.run(seed())