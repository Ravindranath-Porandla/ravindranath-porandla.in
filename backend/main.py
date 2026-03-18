from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from slowapi.middleware import SlowAPIMiddleware

from app.core.config import settings
from app.core.database import create_all_tables
from app.middleware.logging import LoggingMiddleware

# ─── Routers ──────────────────────────────────────────────────
from app.routers.auth import router as auth_router
# Public
from app.routers.public.posts import router as public_posts_router
from app.routers.public.skills import router as public_skills_router
from app.routers.public.experience import router as public_experience_router
from app.routers.public.navigation import router as public_navigation_router
from app.routers.public.settings import router as public_settings_router
from app.routers.public.contact import router as public_contact_router
# Admin
from app.routers.admin.posts import router as admin_posts_router
from app.routers.admin.skills import router as admin_skills_router
from app.routers.admin.experience import router as admin_experience_router
from app.routers.admin.navigation import router as admin_navigation_router
from app.routers.admin.settings import router as admin_settings_router
from app.routers.admin.messages import router as admin_messages_router


# ─── Rate limiter ─────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])


# ─── Lifespan (startup / shutdown) ────────────────────────────
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: create tables if they don't exist (dev convenience)
    # In production, use Alembic migrations instead.
    if settings.environment == "development":
        await create_all_tables()
    yield
    # Shutdown: nothing to clean up (connection pool handled by engine)


# ─── App ──────────────────────────────────────────────────────
app = FastAPI(
    title="Portfolio API",
    description="""
## Personal Portfolio Backend

A production-ready CMS-like API for an AI Engineer portfolio.

### Features
- 🔐 **JWT Auth** — access + refresh token flow
- 📝 **Posts / Writing** — full CRUD with references, tags, publish toggle
- 🧭 **Navigation** — dynamic header columns, reorderable
- ⚙️ **Settings** — key-value CMS for bio, email, homepage text
- 🛠️ **Skills** — categories + individual skills
- 💼 **Experience** — timeline entries
- 📬 **Contact Messages** — form submissions with read tracking

### Auth
Use `POST /auth/login` to get an access token, then click **Authorize** above and paste it.
    """,
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan,
)

# ─── State for rate limiter ───────────────────────────────────
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ─── Middleware ───────────────────────────────────────────────
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(LoggingMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Routers ──────────────────────────────────────────────────
# Auth
app.include_router(auth_router)

# Public APIs (no auth required)
app.include_router(public_posts_router)
app.include_router(public_skills_router)
app.include_router(public_experience_router)
app.include_router(public_navigation_router)
app.include_router(public_settings_router)
app.include_router(public_contact_router)

# Admin APIs (JWT required)
app.include_router(admin_posts_router)
app.include_router(admin_skills_router)
app.include_router(admin_experience_router)
app.include_router(admin_navigation_router)
app.include_router(admin_settings_router)
app.include_router(admin_messages_router)


# ─── Root health check ────────────────────────────────────────
@app.get("/", tags=["Health"])
async def root():
    return {
        "status": "ok",
        "version": "1.0.0",
        "environment": settings.environment,
        "docs": "/docs",
    }


@app.get("/health", tags=["Health"])
async def health_check():
    """Railway / uptime-robot health check endpoint."""
    return {"status": "ok"}


@app.get("/debug/db", tags=["Health"])
async def debug_db():
    """Temporary: test DB connection and return the actual error if any."""
    import traceback
    from sqlalchemy import text
    from app.core.database import engine, _connect_args
    from app.core.config import settings
    try:
        async with engine.connect() as conn:
            result = await conn.execute(text("SELECT 1 AS ok"))
            row = result.fetchone()
        return {
            "status": "ok",
            "db_result": row[0],
            "environment": settings.environment,
            "is_production": settings.is_production,
            "ssl_args": str(_connect_args),
            "db_url_prefix": settings.database_url[:40] + "...",
        }
    except Exception as e:
        return {
            "status": "error",
            "error_type": type(e).__name__,
            "error": str(e),
            "trace": traceback.format_exc()[-800:],
            "environment": settings.environment,
            "is_production": settings.is_production,
            "ssl_args": str(_connect_args),
            "db_url_prefix": settings.database_url[:40] + "...",
        }

