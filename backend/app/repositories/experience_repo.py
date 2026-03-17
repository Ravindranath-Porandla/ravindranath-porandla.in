import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.experience import Experience
from app.schemas.experience import ExperienceCreate, ExperienceUpdate


class ExperienceRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> List[Experience]:
        result = await self.db.execute(
            select(Experience).order_by(Experience.order_index)
        )
        return result.scalars().all()

    async def get_by_id(self, exp_id: str) -> Optional[Experience]:
        result = await self.db.execute(select(Experience).where(Experience.id == exp_id))
        return result.scalars().first()

    async def create(self, data: ExperienceCreate) -> Experience:
        exp = Experience(
            id=str(uuid.uuid4()),
            company=data.company,
            role=data.role,
            duration=data.duration,
            description=data.description,
            achievements=data.achievements or [],
            order_index=data.order_index,
        )
        self.db.add(exp)
        await self.db.commit()
        await self.db.refresh(exp)
        return exp

    async def update(self, exp: Experience, data: ExperienceUpdate) -> Experience:
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(exp, field, value)
        await self.db.commit()
        await self.db.refresh(exp)
        return exp

    async def delete(self, exp: Experience) -> None:
        await self.db.delete(exp)
        await self.db.commit()
