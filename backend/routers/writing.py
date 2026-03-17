from fastapi import APIRouter
import json
from pathlib import Path

router = APIRouter()

DATA_PATH = Path(__file__).parent.parent / "data" / "writing.json"


@router.get("/writing")
async def get_writing():
    with open(DATA_PATH) as f:
        return json.load(f)
