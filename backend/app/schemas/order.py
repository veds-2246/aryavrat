from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class OrderCreate(BaseModel):
    user_id: str
    address_id: str
    product_id: str
    product_name: str
    quantity: float = Field(..., gt=0)
    price_per_unit: float = Field(..., gt=0)
    total_amount: float = Field(..., gt=0)
    delivery_date: str
    delivery_address: str
    type: str = "buyOnce"

class OrderUpdate(BaseModel):
    status: Optional[str] = None
    delivery_date: Optional[str] = None
    delivery_address: Optional[str] = None


class OrderResponse(OrderCreate):
    id: str
    status: str
    created_at: datetime
    updated_at: datetime