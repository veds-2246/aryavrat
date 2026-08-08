from fastapi import APIRouter, HTTPException
from app.schemas.order import OrderCreate, OrderUpdate
from app.services.order_service import OrderService

router = APIRouter(
    prefix="/api/v1/orders",
    tags=["Orders"],
)


@router.get("/")
async def get_orders():
    return await OrderService.get_all_orders()


@router.get("/{order_id}")
async def get_order(order_id: str):
    order = await OrderService.get_order(order_id)

    if not order:
        raise HTTPException(status_code=404, detail="Order not found")

    return order


@router.post("/")
async def create_order(order: OrderCreate):
    return await OrderService.create_order(order)


@router.put("/{order_id}")
async def update_order(order_id: str, order: OrderUpdate):
    updated = await OrderService.update_order(order_id, order)

    if not updated:
        raise HTTPException(status_code=404, detail="Order not found")

    return updated


@router.delete("/{order_id}")
async def delete_order(order_id: str):
    deleted = await OrderService.delete_order(order_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Order not found")

    return {"message": "Order deleted successfully"}