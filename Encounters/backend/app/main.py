from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import encounters, users, characters, parties


app = FastAPI(title="D&D Encounter Builder API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(encounters.router, prefix="/api/encounters", tags=["encounters"])
app.include_router(users.router, prefix="/api/users", tags=["users"])
app.include_router(characters.router, prefix="/api/characters", tags=["characters"])
app.include_router(parties.router, prefix="/api/parties", tags=["parties"])

@app.get("/")
async def root():
    return {"status": "ok", "message": "D&D Encounter Builder API running!"}
