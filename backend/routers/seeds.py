from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
from models.seed import Seed
from schemas import Seed as SeedSchema, SeedBase
from auth import get_current_user
from datetime import datetime

router = APIRouter(
    prefix="/seeds",
    tags=["seeds"]
)

@router.get("/", response_model=List[SeedSchema])
def get_seeds(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    # TODO: look up the canonical way to query -- this looks like I am getting the full database and then filtering in memory
    seeds = db.query(Seed).filter(Seed.user_id == current_user.id).all()
    return seeds

@router.post("/", response_model=SeedSchema)
def create_seed(
    seed: SeedBase,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_seed = Seed(
        **seed.dict(),
        user_id=current_user.id,
        created_at=datetime.now(),
        updated_at=datetime.now(),
    )
    db.add(db_seed)
    db.commit()
    db.refresh(db_seed)
    return db_seed

@router.get("/{seed_id}", response_model=SeedSchema)
def get_seed(
    seed_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    seed = db.query(Seed).filter(
        Seed.id == seed_id,
        Seed.user_id == current_user.id
    ).first()
    if seed is None:
        raise HTTPException(status_code=404, detail="Seed not found")
    return seed

@router.put("/{seed_id}", response_model=SeedSchema)
def update_seed(
    seed_id: int,
    seed: SeedSchema,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    db_seed = db.query(Seed).filter(
        Seed.id == seed_id,
        Seed.user_id == current_user.id
    ).first()
    if db_seed is None:
        raise HTTPException(status_code=404, detail="Seed not found")
    
    for key, value in seed.dict().items():
        setattr(db_seed, key, value)
    
    db.commit()
    db.refresh(db_seed)
    return db_seed

@router.delete("/{seed_id}")
def delete_seed(
    seed_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    seed = db.query(Seed).filter(
        Seed.id == seed_id,
        Seed.user_id == current_user.id
    ).first()
    if seed is None:
        raise HTTPException(status_code=404, detail="Seed not found")
    
    db.delete(seed)
    db.commit()
    return {"message": "Seed deleted"} 