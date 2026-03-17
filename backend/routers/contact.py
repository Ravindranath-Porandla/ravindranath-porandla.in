from fastapi import APIRouter
from pydantic import BaseModel, EmailStr

router = APIRouter()


class ContactForm(BaseModel):
    name: str
    email: str
    message: str


@router.post("/contact")
async def submit_contact(form: ContactForm):
    # In production, this would send an email or save to a database
    print(f"Contact form submission from {form.name} ({form.email})")
    return {"success": True, "message": "Message received"}
