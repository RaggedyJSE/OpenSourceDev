from fastapi import FastAPI, Request
import requests
from fastapi.middleware.cors import CORSMiddleware
from supabase import create_client
import os
from openai import OpenAI
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
LLM_ENDPOINT = os.getenv("LLM_ENDPOINT")
LLM_API_KEY = os.getenv("LLM_API_KEY")
LLM_MODEL = os.getenv("LLM_MODEL")

# --- Validate ---
if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("❌ Missing Supabase credentials in .env file")

if not OPENAI_API_KEY:
    raise ValueError("❌ Missing OpenAI API key in .env file")

if not LLM_API_KEY:
    raise ValueError("❌ Missing LLM API key in .env file")

# --- Initialize clients ---
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
openai = OpenAI(api_key=OPENAI_API_KEY)

# --- FastAPI app setup ---
app = FastAPI(title="AI MealMate Backend 🍳")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Later restrict to frontend URL (e.g. "http://localhost:5173")
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Basic test route ---
@app.get("/")
async def root():
    """Simple check to see if FastAPI runs."""
    return {"message": "Hello from MealMate backend 🍳"}


# --- Supabase test route ---
@app.get("/test_supabase")
async def test_supabase():
    """Query a small bit of data from Supabase to confirm connection."""
    try:
        response = supabase.table("users").select("*").limit(1).execute()
        return {"data": response.data}
    except Exception as e:
        return {"error": str(e)}


# --- OpenAI test route ---
@app.get("/test_openai")
async def test_openai():
    """Send a simple prompt to GPT-4o to confirm API key works."""
    try:
        completion = openai.chat.completions.create(
            model="gpt-4o",
            messages=[{"role": "user", "content": "Say hello from the MealMate app"}],
        )
        return {"response": completion.choices[0].message.content}
    except Exception as e:
        return {"error": str(e)}

@app.get("/test_llm")
async def test_llm():
    """Test connection to the free-tier LLM via OpenRouter."""
    try:
        response = requests.post(
            LLM_ENDPOINT,
            headers={
                "Authorization": f"Bearer {LLM_API_KEY}",
                "Content-Type": "application/json",
            },
            json={
                "model": LLM_MODEL,
                "messages": [{"role": "user", "content": "Say hello from MealMate 🍳"}],
            },
        )
        return response.json()
    except Exception as e:
        return {"error": str(e)}


# --- Suggest recipes route ---
@app.post("/suggest_recipes")
async def suggest_recipes(request: Request):
    body = await request.json()
    ingredient_list = body.get("items", [])
    #ingredient_list = ["chicken", "rice", "broccoli"]

    if not ingredient_list:
        return {"error": "Missing 'items' list of ingredients"}

    prompt = f"Suggest 3 easy dinner recipes using: {', '.join(ingredient_list)}"

    response = requests.post(
        LLM_ENDPOINT,
        headers={
            "Authorization": f"Bearer {LLM_API_KEY}",
            "Content-Type": "application/json",
        },
        json={
            "model": LLM_MODEL,
            "messages": [{"role": "user", "content": prompt}],
        },
    )

    data = response.json()
    content = data.get("choices", [{}])[0].get("message", {}).get("content", "")

    return {"recipes": content}