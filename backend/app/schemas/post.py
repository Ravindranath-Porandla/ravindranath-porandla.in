from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, field_validator
from app.models.post import REFERENCE_PLATFORMS


# ─── References ───────────────────────────────────────────────
class PostReferenceCreate(BaseModel):
    platform: str
    external_link: str
    label: Optional[str] = None

    @field_validator("platform")
    @classmethod
    def validate_platform(cls, v: str) -> str:
        if v not in REFERENCE_PLATFORMS:
            raise ValueError(f"platform must be one of {REFERENCE_PLATFORMS}")
        return v


class PostReferenceResponse(BaseModel):
    id: str
    platform: str
    external_link: str
    label: Optional[str] = None

    model_config = {"from_attributes": True}


# ─── Posts ────────────────────────────────────────────────────
class PostCreate(BaseModel):
    title: str
    summary: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = []
    is_published: bool = False
    references: Optional[List[PostReferenceCreate]] = []


class PostUpdate(BaseModel):
    title: Optional[str] = None
    summary: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = None
    is_published: Optional[bool] = None
    references: Optional[List[PostReferenceCreate]] = None


class PostResponse(BaseModel):
    id: str
    title: str
    slug: str
    summary: Optional[str] = None
    content: Optional[str] = None
    tags: Optional[List[str]] = []
    is_published: bool
    created_at: datetime
    updated_at: datetime
    references: List[PostReferenceResponse] = []

    model_config = {"from_attributes": True}


class PostListResponse(BaseModel):
    id: str
    title: str
    slug: str
    summary: Optional[str] = None
    tags: Optional[List[str]] = []
    is_published: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class PaginatedPostsResponse(BaseModel):
    items: List[PostListResponse]
    total: int
    page: int
    page_size: int
    has_next: bool
