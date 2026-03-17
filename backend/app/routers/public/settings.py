from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.repositories.settings_repo import SettingsRepository
from app.schemas.settings import SettingResponse

router = APIRouter(prefix="/settings", tags=["Public – Settings"])


@router.get("", response_model=List[SettingResponse], summary="Get all site settings")
async def get_settings(db: AsyncSession = Depends(get_db)):
    repo = SettingsRepository(db)
    return await repo.get_all()
