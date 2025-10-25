from supabase import create_client
from app.core.config import settings

supabase = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)

async def save_encounter(user_id: str, data: dict):
    supabase.table("encounters").insert({
        "user_id": user_id,
        "data": data
    }).execute()
