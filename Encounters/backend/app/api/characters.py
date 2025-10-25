from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.supabase_client import supabase

router = APIRouter()

from typing import Optional
from pydantic import BaseModel

class Character(BaseModel):
    user_id: str
    name: str
    class_name: str
    race: str
    level: int
    description: Optional[str] = None


@router.post("/")
async def create_character(char: Character):
    try:
        data = supabase.table("characters").insert({
            "user_id": char.user_id,
            "name": char.name,
            "class": char.class_name,
            "race": char.race,
            "level": char.level,
            "description": char.description
        }).execute()
        return data.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}")
async def get_characters(user_id: str):
    data = supabase.table("characters").select("*").eq("user_id", user_id).execute()
    return data.data
