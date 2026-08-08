from fastapi import APIRouter, HTTPException
from app.schemas.product import ProductCreate, ProductUpdate
from app.services.product_service import ProductService

router = APIRouter(
    prefix="/api/v1/products",
    tags=["Products"],
)


@router.get("/")
async def get_products():
    return await ProductService.get_all_products()


@router.get("/{product_id}")
async def get_product(product_id: str):
    product = await ProductService.get_product(product_id)

    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    return product


@router.post("/")
async def create_product(product: ProductCreate):
    return await ProductService.create_product(product)


@router.put("/{product_id}")
async def update_product(product_id: str, product: ProductUpdate):
    updated = await ProductService.update_product(product_id, product)

    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")

    return updated


@router.delete("/{product_id}")
async def delete_product(product_id: str):
    deleted = await ProductService.delete_product(product_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Product not found")

    return {"message": "Product deleted successfully"}