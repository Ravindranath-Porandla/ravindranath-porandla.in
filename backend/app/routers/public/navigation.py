from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.repositories.navigation_repo import NavigationRepository
from app.schemas.navigation import NavItemResponse

router = APIRouter(prefix="/navigation", tags=["Public – Navigation"])


@router.get("", response_model=List[NavItemResponse], summary="Get visible navigation items")
async def get_navigation(db: AsyncSession = Depends(get_db)):
    repo = NavigationRepository(db)
    return await repo.get_all(visible_only=True)
