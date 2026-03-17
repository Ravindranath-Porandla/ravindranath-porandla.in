from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from app.core.database import get_db
from app.repositories.contact_repo import ContactRepository
from app.schemas.contact import ContactCreate, ContactAckResponse

router = APIRouter(prefix="/contact", tags=["Public – Contact"])


@router.post("", response_model=ContactAckResponse, status_code=status.HTTP_201_CREATED,
             summary="Submit a contact message")
async def submit_contact(data: ContactCreate, db: AsyncSession = Depends(get_db)):
    repo = ContactRepository(db)
    await repo.create(data)
    return ContactAckResponse(success=True)
