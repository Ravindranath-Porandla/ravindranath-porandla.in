from typing import List, Optional
from pydantic import BaseModel


class NavItemCreate(BaseModel):
    label: str
    route: str
    is_visible: bool = True
    order_index: int = 0


class NavItemUpdate(BaseModel):
    label: Optional[str] = None
    route: Optional[str] = None
    is_visible: Optional[bool] = None
    order_index: Optional[int] = None


class NavItemResponse(BaseModel):
    id: str
    label: str
    route: str
    is_visible: bool
    order_index: int

    model_config = {"from_attributes": True}


class NavItemReorder(BaseModel):
    """List of {id, order_index} pairs for bulk reorder."""
    id: str
    order_index: int


class NavReorderRequest(BaseModel):
    items: List[NavItemReorder]
