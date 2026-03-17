from typing import Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.user import AdminUser


class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_email(self, email: str) -> Optional[AdminUser]:
        result = await self.db.execute(
            select(AdminUser).where(AdminUser.email == email)
        )
        return result.scalars().first()

    async def get_by_id(self, user_id: str) -> Optional[AdminUser]:
        result = await self.db.execute(
            select(AdminUser).where(AdminUser.id == user_id)
        )
        return result.scalars().first()

    async def create(self, email: str, hashed_password: str) -> AdminUser:
        user = AdminUser(email=email, hashed_password=hashed_password)
        self.db.add(user)
        await self.db.commit()
        await self.db.refresh(user)
        return user
