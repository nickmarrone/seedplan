from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx
from typing import Dict
from routers import auth_router, users_router, seeds_router, tasks_router
from database import engine
from models import Base

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="SeedPlan API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(seeds_router)
app.include_router(tasks_router)

@app.get("/location/{zipcode}")
async def get_location_data(zipcode: str) -> Dict:
    async with httpx.AsyncClient() as client:
        # Using the Zippopotam.us API (free, no API key required)
        response = await client.get(f"http://api.zippopotam.us/us/{zipcode}")
        if response.status_code == 404:
            raise HTTPException(status_code=404, detail="Invalid zipcode")
        
        data = response.json()
        return {
            "latitude": float(data["places"][0]["latitude"]),
            "longitude": float(data["places"][0]["longitude"]),
            "state": data["places"][0]["state"],
            "city": data["places"][0]["place name"]
        }

@app.get("/")
def read_root():
    return {"message": "Welcome to SeedPlan API"}   