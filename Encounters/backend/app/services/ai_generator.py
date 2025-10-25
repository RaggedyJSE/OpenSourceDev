import httpx
import supabase
from app.core.config import settings
import re
import json

async def generate_encounter(req):
    # Load character data if present
    party_summary = ""
    if req.user_id and getattr(req, "party_id", None):
        res = supabase.table("parties").select("character_ids").eq("id", req.party_id).single().execute()
        char_ids = res.data["character_ids"]
        chars = supabase.table("characters").select("name, class, race, level").in_("id", char_ids).execute().data
        party_summary = "Party composition:\n" + "\n".join([f"- {c['name']} ({c['race']} {c['class']} lvl {c['level']})" for c in chars])

    prompt = f"""
    Create {req.encounter_count} D&D 5e encounters.
    Environment: {req.environment}
    Tone: {req.tone}
    Difficulty: {req.difficulty}
    Focus: {', '.join(req.focus)}
    {party_summary}
    {"Story seed: " + req.story_seed if req.story_seed else ""}
    Narrative mode: {"Yes" if req.narrative else "No"}.
    Output structured JSON...
    """

    headers = {
        "Authorization": f"Bearer {settings.LLM_API_KEY}",
        "Content-Type": "application/json",
    }
        
    payload = {
        "model": settings.LLM_MODEL,
        "messages": [{"role": "user", "content": prompt}],
        #"response_format": {"type": "json_object"},
    }
    async with httpx.AsyncClient() as client:
        res = await client.post(settings.LLM_ENDPOINT, json=payload, headers=headers)
        if res.status_code != 200:
            print("❌ LLM Error:", res.status_code, res.text)
        res.raise_for_status()
        data = res.json()

    raw = data["choices"][0]["message"]["content"]

    # 🧹 Clean up Markdown fences and any leading text
    cleaned = re.sub(r"^.*?```json\s*|```$", "", raw, flags=re.DOTALL).strip()

    # 🧠 Try parsing JSON safely
    try:
        encounter_data = json.loads(cleaned)
    except json.JSONDecodeError:
        print("⚠️ Could not parse JSON, returning raw text.")
        encounter_data = {"raw_text": raw}

    return encounter_data
