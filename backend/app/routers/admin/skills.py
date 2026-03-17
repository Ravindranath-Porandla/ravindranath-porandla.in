from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.core.exceptions import NotFoundError
from app.repositories.skill_repo import SkillRepository
from app.schemas.skill import (
    SkillCategoryCreate, SkillCategoryUpdate, SkillCategoryResponse,
    SkillCreate, SkillUpdate, SkillResponse,
)

router = APIRouter(prefix="/admin/skills", tags=["Admin – Skills"])


@router.get("", response_model=List[SkillCategoryResponse], summary="Get all categories + skills")
async def list_skills(db: AsyncSession = Depends(get_db), _=Depends(get_current_admin)):
    repo = SkillRepository(db)
    return await repo.get_all_categories()


@router.post("/categories", response_model=SkillCategoryResponse,
             status_code=status.HTTP_201_CREATED, summary="Create skill category")
async def create_category(
    data: SkillCategoryCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = SkillRepository(db)
    return await repo.create_category(data)


@router.patch("/categories/{cat_id}", response_model=SkillCategoryResponse,
              summary="Update skill category")
async def update_category(
    cat_id: str,
    data: SkillCategoryUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = SkillRepository(db)
    cat = await repo.get_category_by_id(cat_id)
    if not cat:
        raise NotFoundError("Skill category")
    return await repo.update_category(cat, data)


@router.delete("/categories/{cat_id}", status_code=status.HTTP_204_NO_CONTENT,
               summary="Delete skill category (and its skills)")
async def delete_category(
    cat_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = SkillRepository(db)
    cat = await repo.get_category_by_id(cat_id)
    if not cat:
        raise NotFoundError("Skill category")
    await repo.delete_category(cat)


@router.post("", response_model=SkillResponse, status_code=status.HTTP_201_CREATED,
             summary="Create a skill")
async def create_skill(
    data: SkillCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = SkillRepository(db)
    # Verify category exists
    cat = await repo.get_category_by_id(data.category_id)
    if not cat:
        raise NotFoundError("Skill category")
    return await repo.create_skill(data)


@router.patch("/{skill_id}", response_model=SkillResponse, summary="Update a skill")
async def update_skill(
    skill_id: str,
    data: SkillUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = SkillRepository(db)
    skill = await repo.get_skill_by_id(skill_id)
    if not skill:
        raise NotFoundError("Skill")
    return await repo.update_skill(skill, data)


@router.delete("/{skill_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a skill")
async def delete_skill(
    skill_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = SkillRepository(db)
    skill = await repo.get_skill_by_id(skill_id)
    if not skill:
        raise NotFoundError("Skill")
    await repo.delete_skill(skill)
