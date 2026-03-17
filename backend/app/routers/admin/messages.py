from typing import List
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.core.exceptions import NotFoundError
from app.repositories.contact_repo import ContactRepository
from app.schemas.contact import ContactResponse

router = APIRouter(prefix="/admin/messages", tags=["Admin – Messages"])


@router.get("", response_model=List[ContactResponse], summary="List all contact messages")
async def list_messages(
    unread_only: bool = Query(False),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = ContactRepository(db)
    return await repo.get_all(unread_only=unread_only)


@router.patch("/{msg_id}/read", response_model=ContactResponse, summary="Mark message as read")
async def mark_read(
    msg_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = ContactRepository(db)
    msg = await repo.get_by_id(msg_id)
    if not msg:
        raise NotFoundError("Message")
    return await repo.mark_read(msg)


@router.delete("/{msg_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a message")
async def delete_message(
    msg_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = ContactRepository(db)
    msg = await repo.get_by_id(msg_id)
    if not msg:
        raise NotFoundError("Message")
    await repo.delete(msg)
