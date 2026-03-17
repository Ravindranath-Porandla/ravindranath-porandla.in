from typing import List
from fastapi import APIRouter, Depends, status, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.core.exceptions import NotFoundError
from app.repositories.post_repo import PostRepository
from app.schemas.post import PostCreate, PostUpdate, PostResponse, PostListResponse, PaginatedPostsResponse

router = APIRouter(prefix="/admin/posts", tags=["Admin – Posts"])


@router.get("", response_model=PaginatedPostsResponse, summary="List all posts (incl. unpublished)")
async def list_posts_admin(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = PostRepository(db)
    posts, total = await repo.get_all_admin(page=page, page_size=page_size)
    return PaginatedPostsResponse(
        items=[PostListResponse.model_validate(p) for p in posts],
        total=total,
        page=page,
        page_size=page_size,
        has_next=(page * page_size) < total,
    )


@router.post("", response_model=PostResponse, status_code=status.HTTP_201_CREATED,
             summary="Create a new post")
async def create_post(
    data: PostCreate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = PostRepository(db)
    return await repo.create(data)


@router.get("/{post_id}", response_model=PostResponse, summary="Get a post by ID (admin)")
async def get_post_admin(
    post_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = PostRepository(db)
    post = await repo.get_by_id(post_id)
    if not post:
        raise NotFoundError("Post")
    return post


@router.patch("/{post_id}", response_model=PostResponse, summary="Update a post")
async def update_post(
    post_id: str,
    data: PostUpdate,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = PostRepository(db)
    post = await repo.get_by_id(post_id)
    if not post:
        raise NotFoundError("Post")
    return await repo.update(post, data)


@router.patch("/{post_id}/publish", response_model=PostResponse, summary="Toggle publish status")
async def toggle_publish(
    post_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = PostRepository(db)
    post = await repo.get_by_id(post_id)
    if not post:
        raise NotFoundError("Post")
    return await repo.toggle_publish(post)


@router.delete("/{post_id}", status_code=status.HTTP_204_NO_CONTENT, summary="Delete a post")
async def delete_post(
    post_id: str,
    db: AsyncSession = Depends(get_db),
    _=Depends(get_current_admin),
):
    repo = PostRepository(db)
    post = await repo.get_by_id(post_id)
    if not post:
        raise NotFoundError("Post")
    await repo.delete(post)
