from datetime import datetime, timezone
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.settings import SiteSettings
from app.schemas.settings import SettingUpdate


class SettingsRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self) -> List[SiteSettings]:
        result = await self.db.execute(select(SiteSettings).order_by(SiteSettings.key))
        return result.scalars().all()

    async def get_by_key(self, key: str) -> Optional[SiteSettings]:
        result = await self.db.execute(select(SiteSettings).where(SiteSettings.key == key))
        return result.scalars().first()

    async def upsert(self, key: str, data: SettingUpdate) -> SiteSettings:
        setting = await self.get_by_key(key)
        if setting:
            if data.value is not None:
                setting.value = data.value
            if data.value_type is not None:
                setting.value_type = data.value_type
            setting.updated_at = datetime.now(timezone.utc)
        else:
            setting = SiteSettings(
                key=key,
                value=data.value,
                value_type=data.value_type or "text",
                updated_at=datetime.now(timezone.utc),
            )
            self.db.add(setting)
        await self.db.commit()
        await self.db.refresh(setting)
        return setting
