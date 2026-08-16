from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class SubscriptionCreate(BaseModel):
    user_id: str
    address_id: str
    product_id: str
    product_name: str

    quantity: float = Field(..., gt=0)

    schedule: str              # daily | custom
    selected_days: Optional[List[str]] = None

    start_date: str

class SubscriptionUpdate(BaseModel):
    quantity: Optional[float] = Field(default=None, gt=0)
    schedule: Optional[str] = None
    selected_days: Optional[List[str]] = None
    status: Optional[str] = None
    address_id: Optional[str] = None

class SubscriptionResponse(SubscriptionCreate):
    id: str
    status: str
    next_delivery_date: str
    created_at: datetime
    updated_at: datetime