import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.config import settings
from app.services.supabase_client import supabase

router = APIRouter() 

import httpx
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from app.core.config import settings
from app.services.supabase_client import supabase

router = APIRouter()

class UserSignup(BaseModel):
    email: str
    password: str
    username: str

@router.post("/")
async def create_user(user: UserSignup):
    """
    Creates a new Supabase Auth user and corresponding entry in public.users.
    """
    try:
        # 1️⃣ Create user in Supabase Auth
        async with httpx.AsyncClient() as client:
            res = await client.post(
                f"{settings.SUPABASE_URL}/auth/v1/signup",
                headers={
                    "apikey": settings.SUPABASE_KEY,
                    "Content-Type": "application/json",
                },
                json={
                    "email": user.email,
                    "password": user.password,
                },
            )
            if res.status_code >= 400:
                raise HTTPException(status_code=res.status_code, detail=res.text)
            
            auth_data = res.json()
            auth_user_id = auth_data.get("user", {}).get("id")

            if not auth_user_id:
                raise HTTPException(status_code=500, detail="Failed to create user in Supabase Auth")

        # 2️⃣ Create record in your public.users table
        data = supabase.table("users").insert({
            "id": auth_user_id,
            "username": user.username
        }).execute()

        # 3️⃣ Return combined user info
        return {
            "id": auth_user_id,
            "email": user.email,
            "username": user.username
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/{username}")
async def get_user(username: str):
    try:
        data = supabase.table("users").select("*").eq("username", username).single().execute()
        if not data.data:
            raise HTTPException(status_code=404, detail="User not found")
        return data.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
