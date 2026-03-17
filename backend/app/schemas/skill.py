from typing import List, Optional
from pydantic import BaseModel


class SkillCreate(BaseModel):
    category_id: str
    name: str
    order_index: int = 0


class SkillUpdate(BaseModel):
    name: Optional[str] = None
    order_index: Optional[int] = None
    category_id: Optional[str] = None


class SkillResponse(BaseModel):
    id: str
    name: str
    order_index: int
    category_id: str

    model_config = {"from_attributes": True}


class SkillCategoryCreate(BaseModel):
    name: str
    order_index: int = 0


class SkillCategoryUpdate(BaseModel):
    name: Optional[str] = None
    order_index: Optional[int] = None


class SkillCategoryResponse(BaseModel):
    id: str
    name: str
    order_index: int
    skills: List[SkillResponse] = []

    model_config = {"from_attributes": True}
