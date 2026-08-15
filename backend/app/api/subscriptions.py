from fastapi import APIRouter, HTTPException
from typing import List

from app.schemas.subscription import (
    SubscriptionCreate,
    SubscriptionUpdate,
    SubscriptionResponse,
)
from app.services.subscription_service import SubscriptionService

router = APIRouter(prefix="/subscriptions", tags=["Subscriptions"])


@router.post("/", response_model=SubscriptionResponse)
async def create_subscription(subscription: SubscriptionCreate):
    return await SubscriptionService.create_subscription(subscription)


@router.get("/", response_model=List[SubscriptionResponse])
async def get_subscriptions(user_id: str):
    return await SubscriptionService.get_all_subscriptions(user_id)


@router.get("/{subscription_id}", response_model=SubscriptionResponse)
async def get_subscription(subscription_id: str):
    subscription = await SubscriptionService.get_subscription(subscription_id)

    if not subscription:
        raise HTTPException(status_code=404, detail="Subscription not found")

    return subscription


@router.put("/{subscription_id}", response_model=SubscriptionResponse)
async def update_subscription(subscription_id: str, subscription_update: SubscriptionUpdate):
    updated = await SubscriptionService.update_subscription(
        subscription_id,
        subscription_update,
    )

    if not updated:
        raise HTTPException(status_code=404, detail="Subscription not found")

    return updated

@router.put("/{subscription_id}/skip", response_model=SubscriptionResponse)
async def skip_next_delivery(subscription_id: str):
    updated = await SubscriptionService.skip_next_delivery(subscription_id)

    if not updated:
        raise HTTPException(status_code=404, detail="Subscription not found")

    return updated


@router.delete("/{subscription_id}")
async def delete_subscription(subscription_id: str):
    deleted = await SubscriptionService.delete_subscription(subscription_id)

    if not deleted:
        raise HTTPException(status_code=404, detail="Subscription not found")

    return {"message": "Subscription deleted successfully"}