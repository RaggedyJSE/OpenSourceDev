import os
from dotenv import load_dotenv
load_dotenv()

class Settings:
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
    SUPABASE_URL = os.getenv("SUPABASE_URL")
    SUPABASE_KEY = os.getenv("SUPABASE_KEY")
    LLM_API_KEY = os.getenv("LLM_API_KEY")
    LLM_ENDPOINT = os.getenv("LLM_ENDPOINT")
    LLM_MODEL = os.getenv("LLM_MODEL")

settings = Settings()
