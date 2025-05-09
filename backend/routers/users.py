from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import User as UserSchema
from auth import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["users"]
)

@router.get("/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(get_current_user)) -> UserSchema:
    return current_user

class UserUpdate(BaseModel):
    full_name: str
    gardening_zone: Optional[str] = None
    zipcode: Optional[str] = None
    last_frost_date: Optional[str] = None  # MM-DD format
    first_frost_date: Optional[str] = None  # MM-DD format

@router.put("/me", response_model=UserSchema)
async def update_user_preferences(
    updates: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> UserSchema:
    # Update user preferences
    for field, value in updates.dict(exclude_unset=True).items():
        setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user
