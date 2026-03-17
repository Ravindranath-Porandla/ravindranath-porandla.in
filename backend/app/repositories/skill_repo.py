import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from app.models.skill import SkillCategory, Skill
from app.schemas.skill import SkillCreate, SkillUpdate, SkillCategoryCreate, SkillCategoryUpdate


class SkillRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all_categories(self) -> List[SkillCategory]:
        result = await self.db.execute(
            select(SkillCategory)
            .options(selectinload(SkillCategory.skills))
            .order_by(SkillCategory.order_index)
        )
        return result.scalars().all()

    async def get_category_by_id(self, cat_id: str) -> Optional[SkillCategory]:
        result = await self.db.execute(
            select(SkillCategory).options(selectinload(SkillCategory.skills)).where(SkillCategory.id == cat_id)
        )
        return result.scalars().first()

    async def create_category(self, data: SkillCategoryCreate) -> SkillCategory:
        cat = SkillCategory(id=str(uuid.uuid4()), name=data.name, order_index=data.order_index)
        self.db.add(cat)
        await self.db.commit()
        await self.db.refresh(cat)
        return cat

    async def update_category(self, cat: SkillCategory, data: SkillCategoryUpdate) -> SkillCategory:
        if data.name is not None:
            cat.name = data.name
        if data.order_index is not None:
            cat.order_index = data.order_index
        await self.db.commit()
        await self.db.refresh(cat)
        return cat

    async def delete_category(self, cat: SkillCategory) -> None:
        await self.db.delete(cat)
        await self.db.commit()

    async def get_skill_by_id(self, skill_id: str) -> Optional[Skill]:
        result = await self.db.execute(select(Skill).where(Skill.id == skill_id))
        return result.scalars().first()

    async def create_skill(self, data: SkillCreate) -> Skill:
        skill = Skill(
            id=str(uuid.uuid4()),
            category_id=data.category_id,
            name=data.name,
            order_index=data.order_index,
        )
        self.db.add(skill)
        await self.db.commit()
        await self.db.refresh(skill)
        return skill

    async def update_skill(self, skill: Skill, data: SkillUpdate) -> Skill:
        if data.name is not None:
            skill.name = data.name
        if data.order_index is not None:
            skill.order_index = data.order_index
        if data.category_id is not None:
            skill.category_id = data.category_id
        await self.db.commit()
        await self.db.refresh(skill)
        return skill

    async def delete_skill(self, skill: Skill) -> None:
        await self.db.delete(skill)
        await self.db.commit()
