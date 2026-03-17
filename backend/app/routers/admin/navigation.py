from typing import List
from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.core.exceptions import NotFoundError
from app.repositories.navigation_repo import NavigationRepository
from app.schemas.navigation import (
    NavItemCreate, NavItemUpdate, NavItemResponse, NavReorderRequest
)

router = APIRouter(prefix="/admin/navigation", tags=["Admin – Navigation"])


@router.get("", response_model=List[NavItemResponse], summary="List all nav items (incl. hidden)")
async def list_nav(db: AsyncSession = Depends(get_db), _=Depends(get_current_admin)):
    repo = NavigationRepository(db)
    return await repo.get_all(visible_only=False)


@router.post("", response_model=NavItemResponse, status_code=status.HTTP_201_CREATED,
             summary="Create a nav item")
async def create_nav(
    data: NavItemCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = NavigationRepository(db)
    return await repo.create(data)


@router.patch("/{nav_id}", response_model=NavItemResponse, summary="Update a nav item")
async def update_nav(
    nav_id: str,
    data: NavItemUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = NavigationRepository(db)
    item = await repo.get_by_id(nav_id)
    if not item:
        raise NotFoundError("Nav item")
    return await repo.update(item, data)


@router.delete("/{nav_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a nav item")
async def delete_nav(
    nav_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = NavigationRepository(db)
    item = await repo.get_by_id(nav_id)
    if not item:
        raise NotFoundError("Nav item")
    await repo.delete(item)


@router.post("/reorder", status_code=status.HTTP_204_NO_CONTENT,
             summary="Bulk reorder nav items")
async def reorder_nav(
    data: NavReorderRequest,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = NavigationRepository(db)
    await repo.bulk_reorder(data)
