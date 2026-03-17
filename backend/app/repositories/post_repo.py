import uuid
from typing import List, Optional, Tuple
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, delete
from sqlalchemy.orm import selectinload
from app.models.post import Post, PostReference
from app.schemas.post import PostCreate, PostUpdate
from slugify import slugify


class PostRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def _make_unique_slug(self, title: str, exclude_id: Optional[str] = None) -> str:
        base = slugify(title)
        slug = base
        counter = 1
        while True:
            q = select(Post).where(Post.slug == slug)
            if exclude_id:
                q = q.where(Post.id != exclude_id)
            result = await self.db.execute(q)
            if not result.scalars().first():
                return slug
            slug = f"{base}-{counter}"
            counter += 1

    async def get_all_admin(self, page: int = 1, page_size: int = 20) -> Tuple[List[Post], int]:
        offset = (page - 1) * page_size
        count_result = await self.db.execute(select(func.count(Post.id)))
        total = count_result.scalar_one()
        result = await self.db.execute(
            select(Post)
            .options(selectinload(Post.references))
            .order_by(Post.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        return result.scalars().all(), total

    async def get_published(self, page: int = 1, page_size: int = 10) -> Tuple[List[Post], int]:
        offset = (page - 1) * page_size
        count_result = await self.db.execute(
            select(func.count(Post.id)).where(Post.is_published == True)
        )
        total = count_result.scalar_one()
        result = await self.db.execute(
            select(Post)
            .where(Post.is_published == True)
            .order_by(Post.created_at.desc())
            .offset(offset)
            .limit(page_size)
        )
        return result.scalars().all(), total

    async def get_by_slug(self, slug: str, published_only: bool = True) -> Optional[Post]:
        q = select(Post).options(selectinload(Post.references)).where(Post.slug == slug)
        if published_only:
            q = q.where(Post.is_published == True)
        result = await self.db.execute(q)
        return result.scalars().first()

    async def get_by_id(self, post_id: str) -> Optional[Post]:
        result = await self.db.execute(
            select(Post).options(selectinload(Post.references)).where(Post.id == post_id)
        )
        return result.scalars().first()

    async def create(self, data: PostCreate) -> Post:
        slug = await self._make_unique_slug(data.title)
        post = Post(
            id=str(uuid.uuid4()),
            title=data.title,
            slug=slug,
            summary=data.summary,
            content=data.content,
            tags=data.tags or [],
            is_published=data.is_published,
        )
        self.db.add(post)
        await self.db.flush()

        for ref_data in (data.references or []):
            ref = PostReference(
                id=str(uuid.uuid4()),
                post_id=post.id,
                platform=ref_data.platform,
                external_link=ref_data.external_link,
                label=ref_data.label,
            )
            self.db.add(ref)

        await self.db.commit()
        await self.db.refresh(post)
        return post

    async def update(self, post: Post, data: PostUpdate) -> Post:
        if data.title is not None:
            post.title = data.title
            post.slug = await self._make_unique_slug(data.title, exclude_id=post.id)
        if data.summary is not None:
            post.summary = data.summary
        if data.content is not None:
            post.content = data.content
        if data.tags is not None:
            post.tags = data.tags
        if data.is_published is not None:
            post.is_published = data.is_published

        if data.references is not None:
            # Replace references
            await self.db.execute(delete(PostReference).where(PostReference.post_id == post.id))
            for ref_data in data.references:
                ref = PostReference(
                    id=str(uuid.uuid4()),
                    post_id=post.id,
                    platform=ref_data.platform,
                    external_link=ref_data.external_link,
                    label=ref_data.label,
                )
                self.db.add(ref)

        await self.db.commit()
        await self.db.refresh(post)
        return post

    async def toggle_publish(self, post: Post) -> Post:
        post.is_published = not post.is_published
        await self.db.commit()
        await self.db.refresh(post)
        return post

    async def delete(self, post: Post) -> None:
        await self.db.delete(post)
        await self.db.commit()
