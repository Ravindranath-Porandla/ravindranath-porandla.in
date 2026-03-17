from pydantic import BaseModel, EmailStr


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class TokenRefreshRequest(BaseModel):
    refresh_token: str


class AdminUserResponse(BaseModel):
    id: str
    email: str
    is_active: bool

    model_config = {"from_attributes": True}
