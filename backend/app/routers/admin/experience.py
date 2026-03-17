from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.core.exceptions import NotFoundError
from app.repositories.experience_repo import ExperienceRepository
from app.schemas.experience import ExperienceCreate, ExperienceUpdate, ExperienceResponse

router = APIRouter(prefix="/admin/experience", tags=["Admin – Experience"])


@router.get("", response_model=List[ExperienceResponse], summary="List all experience entries")
async def list_experience(db: AsyncSession = Depends(get_db), _=Depends(get_current_admin)):
    repo = ExperienceRepository(db)
    return await repo.get_all()


@router.post("", response_model=ExperienceResponse, status_code=status.HTTP_201_CREATED,
             summary="Create an experience entry")
async def create_experience(
    data: ExperienceCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = ExperienceRepository(db)
    return await repo.create(data)


@router.patch("/{exp_id}", response_model=ExperienceResponse, summary="Update an experience entry")
async def update_experience(
    exp_id: str,
    data: ExperienceUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = ExperienceRepository(db)
    exp = await repo.get_by_id(exp_id)
    if not exp:
        raise NotFoundError("Experience")
    return await repo.update(exp, data)


@router.delete("/{exp_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete an experience entry")
async def delete_experience(
    exp_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = ExperienceRepository(db)
    exp = await repo.get_by_id(exp_id)
    if not exp:
        raise NotFoundError("Experience")
    await repo.delete(exp)
