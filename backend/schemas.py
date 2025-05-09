from pydantic import BaseModel
from typing import Optional, List
from datetime import date
from models import PlantingType

class SeedBase(BaseModel):
    plant_type: str
    name: str
    days_to_maturity: int
    company: Optional[str] = None
    planting_type: PlantingType
    weeks_before_frost: Optional[int] = None
    weeks_after_frost: Optional[int] = None
    seed_spacing: Optional[str] = None
    seed_notes: Optional[str] = None
    color: Optional[str] = None

class SeedCreate(SeedBase):
    pass

class Seed(SeedBase):
    id: int
    is_system: bool
    user_id: Optional[int]
    created_at: date
    updated_at: Optional[date]

    class Config:
        from_attributes = True

class TaskBase(BaseModel):
    seed_id: int
    task_type: str
    start_date: date
    end_date: date
    notes: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    user_id: int
    created_at: date
    updated_at: Optional[date]

    class Config:
        from_attributes = True

# Update User schema to include relationships
class User(UserBase):
    id: int
    is_active: bool
    created_at: date
    updated_at: Optional[date]
    gardening_zone: Optional[str]
    zipcode: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    last_frost_date: Optional[str]
    first_frost_date: Optional[str]
    seeds: List[Seed] = []
    tasks: List[Task] = []

    class Config:
        from_attributes = True 