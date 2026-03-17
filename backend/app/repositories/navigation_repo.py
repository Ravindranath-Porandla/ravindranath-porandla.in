import uuid
from typing import List, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.models.navigation import NavItem
from app.schemas.navigation import NavItemCreate, NavItemUpdate, NavReorderRequest


class NavigationRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_all(self, visible_only: bool = False) -> List[NavItem]:
        q = select(NavItem).order_by(NavItem.order_index)
        if visible_only:
            q = q.where(NavItem.is_visible == True)
        result = await self.db.execute(q)
        return result.scalars().all()

    async def get_by_id(self, nav_id: str) -> Optional[NavItem]:
        result = await self.db.execute(select(NavItem).where(NavItem.id == nav_id))
        return result.scalars().first()

    async def create(self, data: NavItemCreate) -> NavItem:
        item = NavItem(
            id=str(uuid.uuid4()),
            label=data.label,
            route=data.route,
            is_visible=data.is_visible,
            order_index=data.order_index,
        )
        self.db.add(item)
        await self.db.commit()
        await self.db.refresh(item)
        return item

    async def update(self, item: NavItem, data: NavItemUpdate) -> NavItem:
        for field, value in data.model_dump(exclude_none=True).items():
            setattr(item, field, value)
        await self.db.commit()
        await self.db.refresh(item)
        return item

    async def delete(self, item: NavItem) -> None:
        await self.db.delete(item)
        await self.db.commit()

    async def bulk_reorder(self, reorder: NavReorderRequest) -> None:
        for entry in reorder.items:
            result = await self.db.execute(select(NavItem).where(NavItem.id == entry.id))
            item = result.scalars().first()
            if item:
                item.order_index = entry.order_index
        await self.db.commit()
