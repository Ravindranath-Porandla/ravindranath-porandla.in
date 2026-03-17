from typing import List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.repositories.settings_repo import SettingsRepository
from app.schemas.settings import SettingUpdate, SettingResponse

router = APIRouter(prefix="/admin/settings", tags=["Admin – Settings"])


@router.get("", response_model=List[SettingResponse], summary="Get all site settings")
async def list_settings(db: AsyncSession = Depends(get_db), _=Depends(get_current_admin)):
    repo = SettingsRepository(db)
    return await repo.get_all()


@router.patch("/{key}", response_model=SettingResponse,
              summary="Create or update a setting by key (upsert)")
async def upsert_setting(
    key: str,
    data: SettingUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = SettingsRepository(db)
    return await repo.upsert(key, data)
