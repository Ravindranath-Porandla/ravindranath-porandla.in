"""
Seed Script — Creates initial admin user + sample data.

Run with:
    cd backend
    python -m scripts.seed

Requires DATABASE_URL to be set in .env
"""
import asyncio
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from app.core.config import settings
from app.core.security import hash_password
from app.core.database import Base
from app.models.user import AdminUser
from app.models.navigation import NavItem
from app.models.settings import SiteSettings
from app.models.skill import SkillCategory, Skill
from app.models.experience import Experience
from app.models.post import Post
import uuid
from datetime import datetime, timezone


ADMIN_EMAIL = "admin@portfolio.com"
ADMIN_PASSWORD = "Admin123!"  # ⚠️  Change this immediately after seeding!


async def seed():
    engine = create_async_engine(settings.database_url, echo=True)
    AsyncSession = async_sessionmaker(engine, expire_on_commit=False)

    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSession() as session:
        # ── Admin User ──────────────────────────────────────────
        admin = AdminUser(
            id=str(uuid.uuid4()),
            email=ADMIN_EMAIL,
            hashed_password=hash_password(ADMIN_PASSWORD),
            is_active=True,
            created_at=datetime.now(timezone.utc),
        )
        session.add(admin)

        # ── Navigation ──────────────────────────────────────────
        nav_items = [
            NavItem(id=str(uuid.uuid4()), label="Writing",    route="/writing",    order_index=0, is_visible=True),
            NavItem(id=str(uuid.uuid4()), label="About",      route="/about",      order_index=1, is_visible=True),
            NavItem(id=str(uuid.uuid4()), label="Projects",   route="/projects",   order_index=2, is_visible=True),
            NavItem(id=str(uuid.uuid4()), label="Experience", route="/experience", order_index=3, is_visible=True),
            NavItem(id=str(uuid.uuid4()), label="Contact",    route="/contact",    order_index=4, is_visible=True),
        ]
        session.add_all(nav_items)

        # ── Settings ────────────────────────────────────────────
        now = datetime.now(timezone.utc)
        settings_data = [
            SiteSettings(key="email",          value="ravindranath@example.com", value_type="text", updated_at=now),
            SiteSettings(key="bio",            value="AI Engineer focused on production ML systems.", value_type="text", updated_at=now),
            SiteSettings(key="intro",          value="Hello, I'm Ravindranath. I build production ML systems.", value_type="text", updated_at=now),
            SiteSettings(key="footer_text",    value="Built with FastAPI & Next.js", value_type="text", updated_at=now),
            SiteSettings(key="github_url",     value="https://github.com/Ravindranath-Porandla", value_type="text", updated_at=now),
            SiteSettings(key="linkedin_url",   value="https://linkedin.com/in/ravindranath-porandla", value_type="text", updated_at=now),
            SiteSettings(key="homepage_hero",  value='{"title":"Hello, I\'m Ravindranath.","tagline":"Building production ML systems. Focused on infrastructure, reliability, and shipping models that actually work."}', value_type="json", updated_at=now),
        ]
        session.add_all(settings_data)

        # ── Skill Categories + Skills ────────────────────────────
        categories = {
            "ML / AI": ["PyTorch", "TensorFlow", "scikit-learn", "Hugging Face", "LangChain", "RAG"],
            "Backend":  ["Python", "FastAPI", "Django", "PostgreSQL", "Redis", "Celery"],
            "MLOps":    ["Docker", "Kubernetes", "MLflow", "Airflow", "GitHub Actions", "Weights & Biases"],
            "Cloud":    ["AWS", "GCP", "Azure", "Supabase", "Vercel"],
        }
        for order, (cat_name, skills) in enumerate(categories.items()):
            cat = SkillCategory(id=str(uuid.uuid4()), name=cat_name, order_index=order)
            session.add(cat)
            for s_order, skill_name in enumerate(skills):
                session.add(Skill(
                    id=str(uuid.uuid4()),
                    category_id=cat.id,
                    name=skill_name,
                    order_index=s_order,
                ))

        # ── Experience ──────────────────────────────────────────
        experiences = [
            Experience(
                id=str(uuid.uuid4()),
                company="AI Startup",
                role="Senior ML Engineer",
                duration="Jan 2024 – Present",
                description="Lead ML infrastructure for a real-time recommendation engine.",
                achievements=[
                    "Reduced model inference latency by 60% using TensorRT optimisation",
                    "Deployed A/B testing framework serving 10M+ daily predictions",
                    "Built self-healing data pipelines with Airflow + Great Expectations",
                ],
                order_index=0,
            ),
            Experience(
                id=str(uuid.uuid4()),
                company="Tech Consulting Firm",
                role="ML Engineer",
                duration="Jun 2022 – Dec 2023",
                description="Built ML solutions for enterprise clients across fintech and healthcare.",
                achievements=[
                    "Delivered fraud detection model with 97.3% precision for a fintech client",
                    "Architect of a HIPAA-compliant NLP pipeline for clinical note summarisation",
                    "Mentored 3 junior engineers on MLOps best practices",
                ],
                order_index=1,
            ),
        ]
        session.add_all(experiences)

        # ── Sample Posts ────────────────────────────────────────
        posts = [
            Post(
                id=str(uuid.uuid4()),
                title="Building Reliable ML Pipelines: Lessons from Production",
                slug="building-reliable-ml-pipelines",
                summary="Practical patterns for designing ML pipelines that don't break at 3 AM.",
                content="# Building Reliable ML Pipelines\n\nLessons learned after running ML in production for years...",
                tags=["mlops", "python", "production"],
                is_published=True,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
            Post(
                id=str(uuid.uuid4()),
                title="Feature Stores: When You Need One and When You Don't",
                slug="feature-stores-when-you-need-one",
                summary="A pragmatic guide to evaluating whether your team needs a feature store.",
                content="# Feature Stores\n\nA feature store is a centralised repository for ML features...",
                tags=["mlops", "feature-engineering"],
                is_published=True,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
            Post(
                id=str(uuid.uuid4()),
                title="Draft: RAG Architecture Patterns",
                slug="rag-architecture-patterns",
                summary="Exploring different RAG patterns for production LLM apps.",
                content="# RAG Patterns\n\nRetrieval-Augmented Generation (RAG) is...",
                tags=["llm", "rag", "architecture"],
                is_published=False,
                created_at=datetime.now(timezone.utc),
                updated_at=datetime.now(timezone.utc),
            ),
        ]
        session.add_all(posts)

        await session.commit()

    await engine.dispose()

    print("\n✅ Seed complete!")
    print(f"   Admin email:    {ADMIN_EMAIL}")
    print(f"   Admin password: {ADMIN_PASSWORD}")
    print("   ⚠️  Change the admin password immediately!\n")


if __name__ == "__main__":
    asyncio.run(seed())
