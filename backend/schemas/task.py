from pydantic import BaseModel
from datetime import date
from typing import Optional

class TaskBase(BaseModel):
    seed_id: int
    task_type: str
    start_date: date
    end_date: date
    notes: Optional[str] = None
    color: Optional[str] = None

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    user_id: int
    created_at: date
    updated_at: Optional[date] = None

    class Config:
        from_attributes = True 