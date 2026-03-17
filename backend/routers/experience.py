from fastapi import APIRouter
import json
from pathlib import Path

router = APIRouter()

DATA_PATH = Path(__file__).parent.parent / "data" / "experience.json"


@router.get("/experience")
async def get_experience():
    with open(DATA_PATH) as f:
        return json.load(f)
