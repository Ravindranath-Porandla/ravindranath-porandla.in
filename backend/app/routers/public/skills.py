from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.repositories.skill_repo import SkillRepository
from app.schemas.skill import SkillCategoryResponse

router = APIRouter(prefix="/skills", tags=["Public – Skills"])


@router.get("", response_model=List[SkillCategoryResponse], summary="Get all skill categories with skills")
async def get_skills(db: AsyncSession = Depends(get_db)):
    repo = SkillRepository(db)
    return await repo.get_all_categories()
