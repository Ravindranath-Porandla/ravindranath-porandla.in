from fastapi import APIRouter, Depends, status
from slowapi import Limiter
from slowapi.util import get_remote_address
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.core.dependencies import get_current_admin
from app.services.auth_service import AuthService
from app.schemas.auth import LoginRequest, AdminUserResponse, TokenRefreshRequest

router = APIRouter(prefix="/auth", tags=["Auth"])
limiter = Limiter(key_func=get_remote_address)


@router.post("/login", summary="Admin login — returns access + refresh tokens")
async def login(data: LoginRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    return await service.login(data)


@router.post("/refresh", summary="Refresh access token using a refresh token")
async def refresh(data: TokenRefreshRequest, db: AsyncSession = Depends(get_db)):
    service = AuthService(db)
    return await service.refresh(data.refresh_token)


@router.get("/me", response_model=AdminUserResponse, summary="Get current admin profile")
async def me(current_admin=Depends(get_current_admin)):
    return current_admin


@router.post("/logout", status_code=status.HTTP_204_NO_CONTENT, summary="Logout (client should discard tokens)")
async def logout(current_admin=Depends(get_current_admin)):
    # JWT is stateless; client is responsible for discarding the token.
    return None
