import uuid
from typing import Optional
from sqlalchemy import String, Integer, Text, JSON
from sqlalchemy.orm import Mapped, mapped_column
from app.core.database import Base


class Experience(Base):
    __tablename__ = "experience"

    id: Mapped[str] = mapped_column(
        String(36), primary_key=True, default=lambda: str(uuid.uuid4())
    )
    company: Mapped[str] = mapped_column(String(255), nullable=False)
    role: Mapped[str] = mapped_column(String(255), nullable=False)
    duration: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    achievements: Mapped[Optional[list]] = mapped_column(JSON, nullable=True, default=list)
    order_index: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
