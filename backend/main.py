from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from datetime import timedelta
import httpx
from typing import Dict

from database import get_db, engine
from models import user as user_model
from schemas import user as user_schema
from auth import (
    verify_password,
    get_password_hash,
    create_access_token,
    get_current_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

# Create database tables
user_model.Base.metadata.create_all(bind=engine)

app = FastAPI(title="SeedPlan API")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React app URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/register", response_model=user_schema.User)
def register_user(user: user_schema.UserCreate, db: Session = Depends(get_db)):
    db_user = db.query(user_model.User).filter(user_model.User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = user_model.User(
        email=user.email,
        username=user.username,
        full_name=user.full_name,
        hashed_password=hashed_password
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@app.post("/token", response_model=user_schema.Token)
async def login_for_access_token(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    user = db.query(user_model.User).filter(user_model.User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=user_schema.User)
async def read_users_me(current_user: user_model.User = Depends(get_current_user)):
    return current_user

@app.put("/users/me", response_model=user_schema.User)
async def update_user_preferences(
    preferences: user_schema.UserUpdate,
    current_user: user_model.User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # Update user preferences
    for field, value in preferences.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

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