from typing import List, Optional
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.services.supabase_client import supabase

router = APIRouter()

class Party(BaseModel):
    user_id: str
    name: str
    description: Optional[str] = None       # ← fixed
    character_ids: List[str]                # ← list type hint for 3.8

@router.post("/")
async def create_party(party: Party):
    try:
        data = supabase.table("parties").insert({
            "user_id": party.user_id,
            "name": party.name,
            "description": party.description,
            "character_ids": party.character_ids,
        }).execute()
        return data.data[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{user_id}")
async def get_parties(user_id: str):
    data = supabase.table("parties").select("*").eq("user_id", user_id).execute()
    return data.data
