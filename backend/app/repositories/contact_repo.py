import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.contact import ContactMessage
from app.schemas.contact import ContactCreate


class ContactRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, unread_only: bool = False) -> List[ContactMessage]:
        q = select(ContactMessage).order_by(ContactMessage.created_at.desc())
        if unread_only:
            q = q.where(ContactMessage.is_read == False)
        result = await self.db.execute(q)
        return result.scalars().all()

    async def get_by_id(self, msg_id: str) -> Optional[ContactMessage]:
        result = await self.db.execute(select(ContactMessage).where(ContactMessage.id == msg_id))
        return result.scalars().first()

    async def create(self, data: ContactCreate) -> ContactMessage:
        msg = ContactMessage(
            id=str(uuid.uuid4()),
            name=data.name,
            email=str(data.email),
            message=data.message,
        )
        self.db.add(msg)
        await self.db.commit()
        await self.db.refresh(msg)
        return msg

    async def mark_read(self, msg: ContactMessage) -> ContactMessage:
        msg.is_read = True
        await self.db.commit()
        await self.db.refresh(msg)
        return msg

    async def delete(self, msg: ContactMessage) -> None:
        await self.db.delete(msg)
        await self.db.commit()
