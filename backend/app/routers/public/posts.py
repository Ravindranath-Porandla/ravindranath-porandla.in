from typing import List
from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.repositories.post_repo import PostRepository
from app.schemas.post import PostResponse, PostListResponse, PaginatedPostsResponse
from app.core.exceptions import NotFoundError

router = APIRouter(prefix="/posts", tags=["Public – Posts"])


@router.get("", response_model=PaginatedPostsResponse, summary="List published posts (paginated)")
async def list_posts(
    page: int = Query(1, ge=1),
    page_size: int = Query(10, ge=1, le=50),
    db: AsyncSession = Depends(get_db),
):
    repo = PostRepository(db)
    posts, total = await repo.get_published(page=page, page_size=page_size)
    return PaginatedPostsResponse(
        items=[PostListResponse.model_validate(p) for p in posts],
        total=total,
        page=page,
        page_size=page_size,
        has_next=(page * page_size) < total,
    )


@router.get("/{slug}", response_model=PostResponse, summary="Get a single published post by slug")
async def get_post(slug: str, db: AsyncSession = Depends(get_db)):
    repo = PostRepository(db)
    post = await repo.get_by_slug(slug, published_only=True)
    if not post:
        raise NotFoundError("Post")
    return post
