from datetime import datetime
from pydantic import BaseModel, EmailStr


class ContactCreate(BaseModel):
    name: str
    email: EmailStr
    message: str


class ContactResponse(BaseModel):
    id: str
    name: str
    email: str
    message: str
    is_read: bool
    created_at: datetime

    model_config = {"from_attributes": True}


class ContactAckResponse(BaseModel):
    success: bool
    message: str = "Your message has been received. Thank you!"
