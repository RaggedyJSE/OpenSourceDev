from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.ai_generator import generate_encounter
from app.services.supabase_client import save_encounter

router = APIRouter()

from typing import List, Optional

class EncounterRequest(BaseModel):
    environment: str
    tone: str
    difficulty: str
    focus: List[str]   # 👈 instead of list[str]
    encounter_count: int
    narrative: bool
    story_seed: Optional[str] = None
    user_id: Optional[str] = None


@router.post("/")
async def create_encounter(req: EncounterRequest):
    try:
        data = await generate_encounter(req)
        if req.user_id:
            await save_encounter(req.user_id, data)
        return data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
