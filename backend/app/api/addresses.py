from typing import Optional
from fastapi import APIRouter, HTTPException

from app.schemas.address import AddressCreate, AddressUpdate
from app.services.address_service import AddressService

router = APIRouter(
    prefix="/api/v1/addresses",
    tags=["Addresses"],
)


@router.post("/")
async def create_address(address: AddressCreate):
    return await AddressService.create_address(address)


@router.get("/")
async def get_addresses(user_id: Optional[str] = None):
    if not user_id:
        raise HTTPException(
            status_code=400,
            detail="user_id is required",
        )

    return await AddressService.get_addresses_by_user(user_id)


@router.get("/{address_id}")
async def get_address(address_id: str):
    address = await AddressService.get_address(address_id)

    if not address:
        raise HTTPException(
            status_code=404,
            detail="Address not found",
        )

    return address


@router.put("/{address_id}")
async def update_address(
    address_id: str,
    address_update: AddressUpdate,
):
    address = await AddressService.update_address(
        address_id,
        address_update,
    )

    if not address:
        raise HTTPException(
            status_code=404,
            detail="Address not found",
        )

    return address


@router.delete("/{address_id}")
async def delete_address(address_id: str):
    deleted = await AddressService.delete_address(address_id)

    if not deleted:
        raise HTTPException(
            status_code=404,
            detail="Address not found",
        )

    return {
        "message": "Address deleted successfully",
    }