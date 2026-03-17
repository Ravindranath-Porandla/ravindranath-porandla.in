from fastapi import APIRouter
import json
from pathlib import Path

router = APIRouter()

DATA_PATH = Path(__file__).parent.parent / "data" / "skills.json"


@router.get("/skills")
async def get_skills():
    with open(DATA_PATH) as f:
        return json.load(f)
