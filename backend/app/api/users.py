from fastapi import APIRouter, HTTPException

from app.schemas.user import UserCreate
from app.services.user_service import user_service

router = APIRouter(
    prefix="/api/v1/users",
    tags=["Users"],
)


@router.post("/")
async def create_or_get_user(user: UserCreate):
    return await user_service.create_or_get_user(user)


@router.get("/{user_id}")
async def get_user(user_id: str):
    user = await user_service.get_by_id(user_id)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user


@router.get("/phone/{phone}")
async def get_user_by_phone(phone: str):
    user = await user_service.get_by_phone(phone)

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return user