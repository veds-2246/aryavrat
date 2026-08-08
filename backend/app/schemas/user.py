from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    phone: str
    name: Optional[str] = None


class UserResponse(UserCreate):
    id: str
    created_at: datetime
    updated_at: datetime