from fastapi import APIRouter
import json
from pathlib import Path

router = APIRouter()

DATA_PATH = Path(__file__).parent.parent / "data" / "projects.json"


@router.get("/projects")
async def get_projects():
    with open(DATA_PATH) as f:
        return json.load(f)
