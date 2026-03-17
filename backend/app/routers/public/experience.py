from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.repositories.experience_repo import ExperienceRepository
from app.schemas.experience import ExperienceResponse

router = APIRouter(prefix="/experience", tags=["Public – Experience"])


@router.get("", response_model=List[ExperienceResponse], summary="Get all experience entries")
async def get_experience(db: AsyncSession = Depends(get_db)):
    repo = ExperienceRepository(db)
    return await repo.get_all()
