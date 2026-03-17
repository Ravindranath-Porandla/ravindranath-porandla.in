from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class SettingUpdate(BaseModel):
    value: Optional[str] = None
    value_type: Optional[str] = "text"  # text | json


class SettingResponse(BaseModel):
    key: str
    value: Optional[str] = None
    value_type: str
    updated_at: datetime

    model_config = {"from_attributes": True}
