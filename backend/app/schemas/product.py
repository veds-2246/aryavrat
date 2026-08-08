from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ProductCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    description: Optional[str] = None
    category: str
    price: float = Field(..., gt=0)
    unit: str
    stock: int = Field(default=0, ge=0)
    image: Optional[str] = None
    is_available: bool = True


class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    price: Optional[float] = None
    unit: Optional[str] = None
    stock: Optional[int] = None
    image: Optional[str] = None
    is_available: Optional[bool] = None


class ProductResponse(ProductCreate):
    id: str
    created_at: datetime
    updated_at: datetime