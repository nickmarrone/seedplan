from pydantic import BaseModel
from datetime import datetime
from typing import Optional

class SeedBase(BaseModel):
    name: str
    plant_type: str
    days_to_maturity: int
    company: Optional[str] = None
    planting_type: str
    weeks_before_frost: Optional[int] = None
    weeks_after_frost: Optional[int] = None
    seed_spacing: Optional[str] = None
    seed_notes: Optional[str] = None
    color: Optional[str] = None



class Seed(SeedBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime