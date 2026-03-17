from typing import List, Optional
from pydantic import BaseModel


class ExperienceCreate(BaseModel):
    company: str
    role: str
    duration: str
    description: Optional[str] = None
    achievements: Optional[List[str]] = []
    order_index: int = 0


class ExperienceUpdate(BaseModel):
    company: Optional[str] = None
    role: Optional[str] = None
    duration: Optional[str] = None
    description: Optional[str] = None
    achievements: Optional[List[str]] = None
    order_index: Optional[int] = None


class ExperienceResponse(BaseModel):
    id: str
    company: str
    role: str
    duration: str
    description: Optional[str] = None
    achievements: Optional[List[str]] = []
    order_index: int

    model_config = {"from_attributes": True}
